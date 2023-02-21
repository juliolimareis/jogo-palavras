<template> 
  <Modal
    class="m-auto"
    :isOpen="modalJoker"
    :onClose="closeModalJoker"
  >
    <template v-slot:title>Valor do Curinga</template>
    
    <template v-slot:body>
      <LatterOptions :onSelect="setJoker"/>
    </template>
  </Modal>

  <Modal
    class="m-auto"
    :isOpen="modalAttack"
    :onClose="closeModalAttack"
  >
    <template v-slot:title>Selecionar Ataque</template>
    
    <template v-slot:body>
      <AttackOptions :result="selectedResultAttack" :on-attack="onAttack" :amount-attacks="countAttacks()"/>
    </template>
  </Modal>

  <div v-if="status === 'round-score'">
    
    <div v-if="isAdmin && isGameOver" class="m-3 text-center">
      <Button @click="sendGameRestart">Reiniciar</Button>
    </div>

    <div v-if="!isGameOver && timeout !== '-' && timeout !== '0'" class="m-3 text-center">
      <Button @click="status = 'start'">Voltar</Button>
    </div>

    <div v-if="!isGameOver && timeout === '0'" class="m-3 text-center text-primary">
      <span>Preparando próximo turno ...</span>
    </div>

    <Score :results="results" :isGameOver="isGameOver" :isAttack="isAttack" :on-attack="onRequestAttack"/>
  </div>

  <div>

    <StatusMessage :status="status" />
    
    
    <div v-if="status === 'start'" class="-border-2 border-gray-500 row-span-1">
      <div class="text-2xl font-bold text-center text-primary">
        Takopi - {{ $userName }}
      </div>
      
      <div class="text-mg font-bold text-center">
        Cartas da Mesa
      </div>

      <div class="mx-auto -border-2 border-gray-400 w-[350px] h-[130px] mt-1">
        <Card v-for="(c, i) in tableCards" :key="i"
          :class="`relative float-left m-2 ${c.isSelected ? 'shadow-md shadow-gray-500' : ''}`"
          :card="c"
          @click="upsertWork(c)"
        />
      </div>
    </div>

    <div v-if="status === 'start'" class="-border-2 border-red-500">

      <div class="m-auto text-center mt-4">
        <span>
          <span class="float-left ml-3 text-2xl font-bold">{{ timeout }}</span>
          <b>
            <span 
              :class="`${wordColor}`"
              v-for="w in selectedCards" >{{ w.jokerValue ?? w.value }}
            </span>
            <span> {{ sumSelectCards() }}</span>
          </b>&nbsp;&nbsp;
        </span>

        <div><span class="text-red-500 text-sm">{{ errorMessageCheckWord }}</span></div>
        <hr>
      </div>

      <div
        class="-border-2 border-gray-200 max-w-[800px] h-[250px] overflow-auto m-auto mt-3"
      >
        <Card v-for="(c, i) in handCards" :key="i"
          :class="`float-left m-1 mx-4 ${c.isSelected ? 'shadow-md shadow-gray-500' : ''}`"
          :card="c"
          @click="upsertWork(c)"
        />
      </div>
    
      
      <div class="-border-2 border-green-500">
        <div class="">
          <Button class="float-left" @click="onCheckWord" :disabled="isLoaderCheckWord || selectedCards.length < 2">{{isLoaderCheckWord ? 'Verificando' : 'Verificar Palavra'}}</Button>
          <Button class="tex-center" @click="status = 'round-score'">Rank</Button>
          <Button :disabled="isLoaderCheckWord" @click="resetWord" class="bg-red-400 float-right">Apagar</Button>
        </div>
      </div>
    </div>

  </div>

</template>

<script lang="ts" setup>
import { identTotalScore } from "~~/game/player";
import { checkRoom, checkWord } from "~~/core/repository";

const router = useRouter();
const { $socket, $idRoom, $idUser, $userName } = useNuxtApp();

const status = ref<MessageStatus>("loading");
const timeout = ref("-");

const handCards = ref<GameCard[]>([]);
const tableCards = ref<GameCard[]>([]);
const selectedCards = ref<GameCard[]>([]);
const profilePlayersRoom = ref<ServerDataPlayerInRoom[]>([]);

const modalJoker = ref(false);
const selectedJoker = ref<GameCard>();

const wordColor = ref("");
const isWordValid = ref(false);
const isAdmin = ref(false);
const isLoaderCheckWord = ref(false);
const errorMessageCheckWord = ref("");

const results = ref<Record<string, Result[]>>({});
const isGameOver = ref(false);

const modalAttack = ref(false);
const isAttack = ref(true);
const selectedResultAttack = ref<Result>();

onMounted(async () => {
  const checkRoomResponse = await checkRoom($idRoom);

  if(checkRoomResponse?.roomExists){    
    if(!checkRoomResponse?.gameReady){
      status.value = "not-ready";
    }
    if(checkRoomResponse?.idAdmin === $idUser){
      isAdmin.value = true;
    }
  }else{
    status.value = "not-found";
    return;
  }

  setTimeout(() => {
    if(status.value === "loading") {
      status.value = "timeout";
    }
  }, 5000);

  sendEnterGame()

  $socket.onmessage = async ({ data }) => {
    const res = JSON.parse(data) as ServerData;

    switch (res.channel) {
      case "round-timeout":
        timeout.value = String(res.data.timeout);

        if(res.data.timeout <= 0){
          status.value = "round-score"

          if(selectedCards.value.length > 1 && !isWordValid.value){
            await onCheckWord();
          }

          let data = { cards: selectedCards.value };

          if(!isWordValid.value){
            data = { cards: [] };
          }
          
          $socket.send(JSON.stringify({
            channel: "finish-round",
            data
          }));
        }

        break;
      case "player-in-game":
        // console.log("Game start");
        closeModalJoker();
        
        const data = res.data as ServerDataPlayerInGame;
        console.log("hand", data.handCards);

        profilePlayersRoom.value = data.profilePlayersRoom;
        status.value = "start";
        handCards.value = data.handCards;
        tableCards.value = data.tableCards;
        selectedCards.value = [];
        isGameOver.value = false;
        wordColor.value = "";
        isAttack.value = handCards.value.some(c => c.value === "ATK");
        results.value = identTotalScore(res.data.results);
        isWordValid.value = false;
        break;
        case "result-round":
          closeModalJoker();
          // console.log("result-round");
          // console.log(res.data);
          results.value = identTotalScore(res.data);
          status.value = "round-score"
          break;
        case "next-round":
          console.log("next-round");
          $socket.send(JSON.stringify({
            channel: "enter-game",
            data: {}
          }));
          break;
        case "end-game":
          // console.log("end-game");
          // console.log(res.data);
          status.value = "round-score";
          isGameOver.value = true;
          isAttack.value = false;
          closeModalAttack();
          closeModalJoker();
          break;
        case "game-restart":
          sendEnterGame()
          break;
        case "attack":
          results.value = identTotalScore(res.data.results);

          // console.log(res.data);
          break;
        case "refresh-hand":
          handCards.value = res.data.handCards;
          break;
      default:
        break;
    }
  };

  $socket.onclose = () => status.value = "offline";
});

function onRequestAttack(result: Result) {
  console.log("onAttack", result);
  selectedResultAttack.value = result;
  modalAttack.value = true;
}

function onAttack(selectedIds: number[]) {
  console.log("onAttack", selectedIds);

  $socket.send(JSON.stringify({
    channel: "attack",
    data: {
      result: selectedResultAttack.value,
      cardsIds: selectedIds
    }
  }))

  closeModalAttack();
}

const countAttacks = () => handCards.value.filter(c => c.value === 'ATK').length;

const sumSelectCards = () => {
  if(isWordValid.value && selectedCards.value.length){
    return ` (${selectedCards.value.reduce((t, sc) => sc.points + t, 0) + 10})`
  }

  return "";
}

function sendEnterGame(){
  $socket.send(JSON.stringify({
    channel: "enter-game",
    idUser: $idUser,
    idRoom: $idRoom,
    name: $userName,
    data: {}
  }));
}

function sendGameRestart(){
  $socket.send(JSON.stringify({
    channel: "game-restart",
    data: {}
  }));
}

function setJoker(latter : string){
  if(isLoaderCheckWord.value) return;

  console.log(latter);

  if(selectedJoker.value){
    selectedJoker.value.jokerValue = latter;
  }

  closeModalJoker();
}

const closeModalJoker = () => modalJoker.value = false;
const closeModalAttack = () => {
  selectedResultAttack.value = undefined;
  modalAttack.value = false;
}

function resetWord() {
  selectedCards.value = [];
  handCards.value.forEach(c => c.isSelected = false);
  tableCards.value.forEach(c => c.isSelected = false);
  isWordValid.value = false;
  wordColor.value = ""
};

function upsertWork(card: GameCard){
  isWordValid.value = false;

  console.log(card)

  if(isLoaderCheckWord.value) return;
  
  if(card.value === "ATK") {
    console.log("Atk")
    status.value = "round-score"
    return;
  };

  const i = selectedCards.value.indexOf(card);

  if(i === -1){
    if(card.value === "?"){
      modalJoker.value = true;
      selectedJoker.value = card;
    }

    card.isSelected = true;
    selectedCards.value.push(card);
  }else {
    card.isSelected = false;
    selectedCards.value.splice(i, 1);
  }
}

function onCheckWord(){
  isLoaderCheckWord.value = true;
  isWordValid.value = false;
  errorMessageCheckWord.value = "";

  const word = selectedCards.value.map(c => {
    if(c.value !== "ATK"){
      if(c.value === "?"){
        return c?.jokerValue ?? "";
      }
      return c.value;
    } return "";
  }).join("").toLocaleLowerCase();

  if(word.trim()){
    checkWord(word)
      .then(res => {
        isWordValid.value = !!(res?.isValid);
      })
      .catch(err => {
        errorMessageCheckWord.value = "Erro na verificação da palavra. Você pode tentar novamente."
      }) 
      .finally(() => {
        isLoaderCheckWord.value = false
        if(isWordValid.value){
          wordColor.value = "text-green-500";
        }else{
          wordColor.value = "text-red-500";
        }
      });
  }else{
    isLoaderCheckWord.value = false;
  }
}

</script>