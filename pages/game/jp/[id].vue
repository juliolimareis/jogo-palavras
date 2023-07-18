<template>
  <Modal
    class="m-auto"
    :isOpen="modalOptionCard"
    :onClose="closeModalOptionCard"
  >
    <template v-slot:title>Agregar novo valor</template>

    <template v-slot:body>
      <JpLatterOptions :onSelect="setOptionLatter" :card="selectedCard"/>
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
    <div>
      <Button class="m-3 float-right bg-orange-600" @click="giveUp">Desistir</Button>
    </div>

    <div v-if="isAdmin && isGameOver" class="m-3 text-center">
      <Button @click="sendGameRestart">Reiniciar</Button>
    </div>

    <div v-if="!isGameOver && timeout !== '-' && timeout !== '0'" class="m-3 text-center">
      <Button @click="status = 'start'">Voltar</Button>
    </div>

    <div v-if="!isGameOver && timeout === '0'" class="m-3 text-center text-primary">
      <span>Preparando próximo turno ...</span>
    </div>

    <Score :results="results" :isGameOver="isGameOver" :isAttack="isAttack" :on-attack="onRequestAttack" :hand-cards-per-player="handCardsPerPlayer"/>
  </div>

  <div>

    <StatusMessage :status="status" />

    <div v-if="status === 'start'" class="-border-2 border-gray-500 row-span-1">
      <div class="text-2xl font-bold text-center text-primary">
        Takopi (日本語) - {{ $userName }} {{ `(${Object.keys(results ?? {}).length + 1}° rodada de ${maxRounds})`}}
      </div>

      <div class="text-mg font-bold text-center">
        Cartas da Mesa
      </div>

      <div class="mx-auto -border-2 border-gray-400 w-[350px] h-[130px] mt-1">
        <JpCard v-for="(c, i) in tableCards" :key="i"
          :class="`relative float-left m-2 ${c.isSelected ? 'shadow-md shadow-gray-500' : ''}`"
          :card="c"
          @click="upsertWork(c)"
          @dblclick="handleCardOption(c)"
        />
      </div>
    </div>

    <div>
      <Timer v-if="status === 'start' && timerInit" class="ml-2" :TIME_LIMIT="timerInit" :TIME_PASSED="timePassed"/>
    </div>

    <div v-if="status === 'start'" class="">

      <div class="m-auto text-center mt-4">
        <span>
          <!-- <span class="float-left ml-3 text-2xl font-bold">{{ timeout }}</span> -->
          <b>
            <span
              :class="`${wordColor}`"
              v-for="w in selectedCards" >{{ w?.finalValue ? w?.finalValue : w.jokerValue ?? w.value }}
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
        <JpCard v-for="(c, i) in handCards" :key="i"
          :class="`float-left m-1 mx-4 ${c.isSelected ? 'shadow-md shadow-gray-500' : ''}`"
          :card="c"
          @click="upsertWork(c)"
          @dblclick="handleCardOption(c)"
        />
      </div>

      <div class="flex justify-between p-3">
        <Button class="" @click="onCheckWord" :disabled="confirmRound || isLoaderCheckWord || selectedCards.length < 2">{{isLoaderCheckWord ? 'Verificando...' : 'Verificar Palavra'}}</Button>
        <Button class="" @click="status = 'round-score'">Rank</Button>
        <Button class="bg-yellow-500" @click="onConfirmRound">{{ confirmRound ? 'Não terminei!' : 'Finalizar' }}</Button>
        <Button class="bg-red-400 float-right" :disabled="isLoaderCheckWord || confirmRound" @click="resetWord" >Apagar</Button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const router = useRouter();
const route = useRoute();

const { $io, $idRoom, $idUser, $userName } = useNuxtApp();

const status = ref<MessageStatus>("loading");
const timeout = ref("-");
const timerInit = ref(0);
const roundTimeout = ref(0);
const timePassed = ref(0);

const handCards = ref<GameCard[]>([]);
const tableCards = ref<GameCard[]>([]);
const selectedCards = ref<GameCard[]>([]);
const profilePlayersRoom = ref<ServerDataPlayerInRoom[]>([]);

const modalOptionCard = ref(false);
const selectedCard = ref<GameCard>();

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
const confirmRound = ref(false);
const maxRounds = ref(0);
const handCardsPerPlayer = ref<HandCardsPerPlayer[]>([]);

const idRoom = route.params.id as string;

onMounted(async () => {
  $io.emit("check-room", { idRoom });

  $io.on("player-not-found-in-room", () => {
    status.value = "player-not-found-in-room";
  });

  $io.on("check-room", (res: any) => {
    if(res?.roomExists){
      maxRounds.value = res.maxRounds ?? 0;

      if(!res?.gameReady){
        status.value = "not-ready";
      }
      if(res?.idAdmin === $idUser){
        isAdmin.value = true;
      }

      sendEnterGame();
    }else{
      status.value = "not-found";

      return;
    }
  });

  $io.on("message", (res: ServerData) => {
    switch (res.channel) {
    case "round-timeout":
      if(!timerInit.value){
        timePassed.value = roundTimeout.value - res.data.timeout;
        timerInit.value = roundTimeout.value;
      }

      timeout.value = String(res.data.timeout);

      if(res.data.timeout <= 0){
        let data = { cards: selectedCards.value };

        timerInit.value = 0;

        status.value = "round-score";

        if(isWordValid.value){
          sendWord(data);
        }else{
          if(selectedCards.value.length > 1){
            // console.log("not valid. Check word.");

            onCheckWord()
              .then(() => {
                if(!isWordValid.value){
                  data = { cards: [] };
                }

                sendWord(data);
              });
          }else{
            sendWord({ cards: [] });
          }
        }
      }
      break;
    case "player-in-game":
      // console.log("Game start");
      closeModalOptionCard();

      const data = res.data as ServerDataPlayerInGame;
      // console.log("hand", data.handCards);

      confirmRound.value = false;
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
      roundTimeout.value = res.data.roundTimeout * 60;
      break;
    case "result-round":
      closeModalOptionCard();
      // console.log("result-round");
      // console.log(res.data);
      results.value = identTotalScore(res.data);
      status.value = "round-score";
      break;
    case "next-round":
      // console.log("next-round");
      $io.emit("message", {
        channel: "enter-game",
        data: {}
      });
      break;
    case "end-game":
      // console.log("end-game");
      // console.log(res.data);
      status.value = "round-score";
      isGameOver.value = true;
      isAttack.value = false;
      handCardsPerPlayer.value = res.data;
      closeModalAttack();
      closeModalOptionCard();
      break;
    case "game-restart":
      sendEnterGame();
      break;
    case "attack":
      results.value = identTotalScore(res.data.results);
      break;
    case "refresh-hand":
      handCards.value = res.data.handCards;
      break;
    default:
      break;
    }
  });

  $io.on("disconnect", () => {
    status.value = "disconnected";
  });
});

function sendWord(data: { cards: GameCard[] }){
  $io.emit("message", {
    channel: "finish-round",
    data
  });
}

function onConfirmRound() {
  confirmRound.value = !confirmRound.value;

  $io.emit("message", {
    channel: "confirm-round",
    data: { confirm: confirmRound.value }
  });
}
// TODO handleCardOption
function handleCardOption(card: GameCard) {
  if(confirmRound.value) return;

  wordColor.value = "";
  selectedCard.value = card;
  modalOptionCard.value = true;
  selectedCard.value.isSelected = true;

  if(!selectedCards.value.some(c => c.id === card.id)){
    selectedCards.value.push(card);
  }
}

function onRequestAttack(result: Result) {
  selectedResultAttack.value = result;
  modalAttack.value = true;
}

function onAttack(selectedIds: number[]) {
  $io.emit("message", {
    channel: "attack",
    data: {
      result: selectedResultAttack.value,
      cardsIds: selectedIds
    }
  });

  closeModalAttack();
}

const countAttacks = () => handCards.value.filter(c => c.value === "ATK").length;

const sumSelectCards = () => {
  if(isWordValid.value && selectedCards.value.length){
    return ` (${selectedCards.value.reduce((t, sc) => sc.points + t, 0) + 10})`;
  }

  return "";
};

function sendEnterGame(){
  $io.emit("message", {
    channel: "enter-game",
    idUser: $idUser,
    idRoom: $idRoom,
    name: $userName,
    data: {}
  });
}

function sendGameRestart(){
  $io.emit("message", {
    channel: "game-restart",
    data: {}
  });
}
// TODO: setOptionLatter
function setOptionLatter(latter: string){
  if(isLoaderCheckWord.value) return;

  if(selectedCard.value){
    if(selectedCard.value?.isJoker){
      selectedCard.value.jokerValue = latter;
    }else {
      if(selectedCard.value.finalValue){
        selectedCard.value.finalValue = undefined;
      }else{
        selectedCard.value.finalValue = latter;
      }
    }
  }

  closeModalOptionCard();
}

const closeModalOptionCard = () => modalOptionCard.value = false;
const closeModalAttack = () => {
  selectedResultAttack.value = undefined;
  modalAttack.value = false;
};

function resetWord() {
  selectedCards.value = [];
  handCards.value.forEach(c => c.isSelected = false);
  tableCards.value.forEach(c => c.isSelected = false);
  isWordValid.value = false;
  wordColor.value = "";
};
// TODO: upsertWork
function upsertWork(card: GameCard){
  if(isLoaderCheckWord.value || confirmRound.value) return;

  isWordValid.value = false;
  wordColor.value = "";

  if(card.value === "ATK") {
    status.value = "round-score";

    return;
  };

  const i = selectedCards.value.findIndex(c => c.id === card.id);

  if(i === -1){
    if(card.value === "?"){
      selectedCard.value = card;
      modalOptionCard.value = true;
    }

    card.isSelected = true;

    selectedCards.value.push(card);
  }else {
    card.isSelected = false;
    card.acc = undefined;
    selectedCards.value.splice(i, 1);
  }
}

async function onCheckWord(){
  isLoaderCheckWord.value = true;
  isWordValid.value = false;
  errorMessageCheckWord.value = "";

  const word = selectedCards.value.map(c => {
    if(c.value !== "ATK"){
      if(c.value === "?"){
        return c?.jokerValue ?? "";
      }else if(c.finalValue){
        return c.finalValue;
      }

      return c.value;
    }

    return "";
  }).join("").toLocaleLowerCase();

  if(word.trim()){
    await checkWord(word, "jp")
      .then(res => {
        isWordValid.value = !!(res?.isValid);
      })
      .catch(() => {
        errorMessageCheckWord.value = "Erro na verificação da palavra. Você pode tentar novamente.";
      })
      .finally(() => {
        isLoaderCheckWord.value = false;
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

function giveUp() {
  $io.emit("message", {
    channel: "give-up",
    data: {}
  });

  router.replace("/");
}

</script>