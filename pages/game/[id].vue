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

  <div class="grid grid-rows-3 h-screen">

    <StatusMessage :status="status" />
    
    <div v-if="status === 'start'" class="-border-2 border-gray-500 row-span-1">
      <div class="text-mg font-bold text-center">
        Cartas da Mesa
      </div>

      <div class="mx-auto -border-2 border-gray-400 w-[350px] h-[130px] mt-1">
        <Card v-for="(c, i) in tableCards" :key="i"
          :class="`relative float-left m-2 ${c.isSelected ? 'shadow-md shadow-gray-500' : ''}`"
          :value="c.value"
          :points="c.points"
          @click="upsertWork(c)"
        />
      </div>
    </div>

    <div v-if="status === 'start'" class="-border-2 border-red-500">

      <div class="m-auto text-center mt-4">
        <span>
          <span class="float-left ml-3 text-2xl font-bold">{{ timeout }}</span>
          <b><span 
            :class="`${isWordValid ? 'text-green-500' : ''}`"
            v-for="w in selectedCards" >{{ w.jokerValue ?? w.value }}</span></b>&nbsp;&nbsp;
        </span>
        <hr>
      </div>

      <div
        class="-border-2 border-gray-200 max-w-[800px] h-[250px] overflow-auto m-auto mt-3"
      >
        <Card v-for="(c, i) in handCards" :key="i"
          :class="`float-left m-1 mx-4 ${c.isSelected ? 'shadow-md shadow-gray-500' : ''}`"
          :value="c.value"
          :points="c.points"
          @click="upsertWork(c)"
        />
      </div>
    
      
      <div class="-border-2 border-green-500">
        <div class="">
          <Button class="float-left" @click="checkWord" :disabled="isLoaderCheckWord || selectedCards.length < 2">{{isLoaderCheckWord ? 'Verificando' : 'Verificar Palavra'}}</Button>
          <Button @click="resetWork" class="bg-red-400 float-right">Apagar</Button>
        </div>
      </div>
    </div>

    <div v-if="status === 'round-score'">
      <Score :results="results" :isGameOver="isGameOver"/>
    </div>

  </div>

</template>

<script lang="ts" setup>
import { identTotalScore } from "~~/core/dataUser";
import { checkRoom } from "~~/core/repository";

const status = ref<MessageStatus>("loading");
const timeout = ref("-");

const handCards = ref<GameCard[]>([]);
const tableCards = ref<GameCard[]>([]);
const selectedCards = ref<GameCard[]>([]);

const modalJoker = ref(false);
const selectedJoker = ref<GameCard>();

const isWordValid = ref(false);
const isLoaderCheckWord = ref(false);

const results = ref<Record<string, Result[]>>({});
const isGameOver = ref(false);

onMounted(async () => {
  const { $socket, $idRoom, $idUser, $userName } = useNuxtApp();
  const checkRoomResponse = await checkRoom($idRoom);

  // console.log("checkRoomResponse:", checkRoomResponse);

  if(checkRoomResponse?.roomExists){    
    if(!checkRoomResponse?.gameReady){
      status.value = "not-ready";
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

  if(navigator?.userAgent.includes("Firefox")){
    $socket.send(JSON.stringify({
      channel: "enter-game",
      idUser: $idUser,
      idRoom: $idRoom,
      name: $userName,
      data: {}
    }));
  }

  $socket.onopen = () => {
    $socket.send(JSON.stringify({
      channel: "enter-game",
      idUser: $idUser,
      idRoom: $idRoom,
      name: $userName,
      data: {}
    }));
  };

  $socket.onmessage = async ({ data }) => {
    const res = JSON.parse(data) as ServerData;

    switch (res.channel) {
      case "round-timeout":
        timeout.value = String(res.data.timeout);

        if(res.data.timeout <= 0){
          if(!isWordValid.value){
            await checkWord();
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
        console.log("Game start");

        const data = res.data as ServerDataPlayerInGame;
        status.value = "start";
        handCards.value = data.handCards;
        tableCards.value = data.tableCards;
        selectedCards.value = [];        
        break;
        case "result-round":
          console.log("result-round");
          console.log(res.data);
          results.value = identTotalScore(res.data);
          status.value = "round-score";
          break;
        case "next-round":
          console.log("next-round");
          $socket.send(JSON.stringify({
            channel: "enter-game",
            data: {}
          }));
          break;
        case "end-game":
          console.log("end-game");
          console.log(res.data);
          status.value = "round-score";
          isGameOver.value = true;
          break;
      default:
        break;
    }
  };

  $socket.onclose = () => status.value = "offline";
});

function setJoker(latter : string){
  if(selectedJoker.value){
    selectedJoker.value.jokerValue = latter;
  }
  closeModalJoker();
}

const closeModalJoker = () => modalJoker.value = false;

function resetWork() {
  selectedCards.value = [];
  handCards.value.forEach(c => c.isSelected = false);
  tableCards.value.forEach(c => c.isSelected = false);
  isWordValid.value = false;
};

function upsertWork(card: GameCard){
  isWordValid.value = false;

  if(card.value === "ATK") return

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

async function checkWord(){
  isLoaderCheckWord.value = true;

  const word = selectedCards.value.map(c => {
    if(c.value !== "ATK"){
      if(c.value === "?"){
        return c?.jokerValue ?? "";
      }
      return c.value;
    } return "";
  }).join("").toLocaleLowerCase();

  if(word.trim()){
      await fetch(`/api/check-word/${word}`, { method: "GET" })
        .then(res => res.json())
        .then(res => {
          isWordValid.value = !!(res?.isValid)
          // console.log(res);
        }).finally(() => isLoaderCheckWord.value = false);
  }else{
    isLoaderCheckWord.value = false;
    console.log("word is empty");
  }
}

</script>

<style scoped>

</style>