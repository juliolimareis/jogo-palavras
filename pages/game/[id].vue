<template>  
  <div v-if="status === 'offline'" class="mt-20 text-orange-500 text-center font-bold text-lg">
    Você está offline.
  </div>
  
  <div v-else-if="status === 'timeout'" class="mt-20 text-red-500 text-center font-bold text-lg">
    Não foi possível estabelecer a conexão :(
  </div>
  
  <div v-else-if="status === 'not-found'" class="mt-20 text-red-500 text-center font-bold text-lg">
    Sala não encontrada.
  </div>
 
  <div v-else-if="status === 'not-ready'" class="mt-20 text-primary text-center font-bold text-lg">
    Jogo ainda não começou.
  </div>

  <div v-else-if="status === 'start'" class="">
    <div class="ml-3 text-mg font-bold text-center">
      Cartas da Mesa
    </div>

    <div class="mx-auto border-2 border-gray-400 w-[350px] h-[130px] mt-1">
      <Card v-for="(c, i) in tableCards" :key="i"
        class="relative float-left m-2"
        :value="c.value"
        :points="c.points"
      />
    </div>

    <div class="m-auto text-center mt-4">
      <span>
        <span class="float-left ml-3 text-2xl font-bold">{{ timeout }}</span>
        <b>PALAVRA</b>&nbsp;&nbsp;
        <Button class="p-1">Verificar</Button>
      </span>
    </div>

    <div
      class="border-2 border-gray-400 max-w-[800px] overflow-auto m-auto mt-3"
    >
    <Card v-for="(c, i) in handCards" :key="i"
      class="float-left m-1 mx-4"
      :value="c.value"
      :points="c.points"
    />
    </div>

  </div>

  <div v-else class="mt-20 text-primary text-center font-bold text-lg">
    Carregando .....
  </div>
</template>

<script lang="ts" setup>
import { checkRoom } from "~~/core/repository";
import { Card as GameCard, ServerData, ServerDataPlayerInGame } from "~~/types";
// import { Card, ServerData, ServerDataPlayerInGame, } from "~~/types";

const status = ref<"start" | "loading" | "offline" | "timeout" | "not-found" | "not-ready">("loading");
const timeout = ref("-");

const handCards = ref<GameCard[]>([]);
const tableCards = ref<GameCard[]>([]);

onMounted(async () => {
  const { $socket, $idRoom, $idUser, $userName } = useNuxtApp();
  const checkRoomResponse = await checkRoom($idRoom);

  console.log("checkRoomResponse:", checkRoomResponse);

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

  $socket.onmessage = ({ data }) => {
    const res = JSON.parse(data) as ServerData;

    switch (res.channel) {
      case "round-timeout":
        timeout.value = String(res.data.timeout);
        break;
      case "player-in-game":
        status.value = "start";

        const data = res.data as ServerDataPlayerInGame;

        handCards.value = data.handCards;
        tableCards.value = data.tableCards;
        
        console.log(data);
        break;
      default:
        break;
    }
  };

  $socket.onclose = () => status.value = "offline";
});

</script>

<style scoped>

</style>