<template>
  <div class="container w-full mx-auto px-14 mt-2">
    <Header>
      Takopi
    </Header>

    <div v-if="checkRoomStatus === 'room-not-exist'" class="text-center text-red-500 font-bold text-lg mt-10">
      Sala não encontrada.
    </div>

    <div v-else-if="checkRoomStatus === 'room-full'" class="text-center text-red-500 font-bold text-lg mt-10">
      A sala atingiu o limite máximo de jogadores.
    </div>

    <div v-else-if="checkRoomStatus === 'room-start'">
      <div class="text-center mt-3">
        <span class="font-bold">Link da sala: </span>
        
        <span class="font-bold text-primary">
          <input
            id="linkRoom"
            class="rounded-md bg-gray-300 h-9"
            type="text"
            disabled
            :value="url"
          />
        </span>
        
        <Button
          :class="`ml-2 ${isClipboard ? 'bg-green-600' : ''}`"
          @click="clipboardUrl"
        >
          {{ isClipboard ? "Copiado" : "Copiar" }}
        </Button>
  
        <div class="mt-5">
          <span class="font-bold">Nickname: </span>
          <span>
            <input
              class="rounded-md bg-gray-300 h-9"
              placeholder=" nickname"
              type="text"
              :disabled="!editName"
              v-model="name"
            />
              <Button v-if="editName" @click="setName()" class="bg-green-600 ml-3 mt-3">
                Salvar
              </Button>

              <Button v-else @click="editName = true" class="bg-primary ml-3  mt-3">
                Editar
              </Button>
          </span>
        </div> 
      </div>
  
      <div class="grid grid-cols-1 gap-4 m-auto mt-4">
        <div class="m-auto w-full">
          <Chat :chatMessage="chatMessage"/>
        </div>
  
        <div class="text-center">
          <span>
            Máximo de jogadores: <b>{{ dataRoom?.maxPlayers }}</b>
            | Rodadas: <b>{{ dataRoom?.maxRounds }}</b>
            | Tempo da Rodada: <b>{{ dataRoom?.roundTimeout }} {{ (dataRoom?.roundTimeout ?? 0) > 1 ? 'minutos' : 'minuto' }}</b>
            | Online: <b>{{ players.length }}</b>
          </span>
        </div>
  
        <div v-if="status" class="border-2 rounded-md border-gray-400 w-full h-56 overflow-y-auto">
          <span v-for="p in players" :key="p.id">
            <Profile
              v-if="p.id === idAdmin"
              class="float-left m-2"
              :name="p.name"
              :is-ready="p.isReady"
              :is-admin="true"
            />
            <Profile
              v-else
              class="float-left m-2"
              :name="p.name"
              :is-ready="p.isReady"
            />
          </span>
        </div>
  
        <div v-else class="text-red-500 text-center font-bold text-lg">
          Você está offline :(
        </div>
      </div>
  
      <div class="w-auto text-center mt-10">
        <template v-if="isAdmin">
          <Button 
            class="bg-green-600"
            @click="gameStart"
            :disabled="!isReady && players.filter((p) => p.isReady).length < 1"
          >
            Iniciar
          </Button>
        </template>
  
        <template v-else>
          <Button v-if="isReady" @click="setReady(false)" class="bg-orange-600">
            Não Estou Pronto!
          </Button>
          <Button v-else @click="setReady(true)" class="bg-green-600">
            Estou Pronto!
          </Button>
        </template>
  
        <div class="mt-4">
          <Button @click="giveUp" class="bg-orange-500">
            Abandonar
          </Button>
        </div>
      </div> 
    </div>

  </div>
</template>

<script lang="ts" setup>
import { checkRoom } from '~~/core/repository';

const { $socket, $idUser, $userName, } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const url = ref("");
const name = ref("");
const status = ref(false);
const isClipboard = ref(false);
const chatMessage = ref("");
const isAdmin = ref(false);
const isReady = ref(false);
const players = ref<Array<ServerDataPlayerInRoom>>([]);
const editName = ref(false);
const checkRoomStatus = ref<"room-full" | "room-start" | "room-not-exist">();
const idAdmin = ref();
const dataRoom = ref<CheckRoomResponse>();

const clipboardUrl = () => {
  clipboard(url.value).then(() => isClipboard.value = true);
  setTimeout(() => isClipboard.value = false, 10000);
};

onMounted(async () => {
  const idRoom = route.params.id as string;
  const checkRoomResponse = await checkRoom(idRoom);

  if(checkRoomResponse?.roomExists){
    dataRoom.value = checkRoomResponse;

    if(checkRoomResponse?.gameReady){
      router.replace(`/game/${checkRoomResponse.idRoom}`);
      return;
    }else if(checkRoomResponse?.roomIsFull){
      checkRoomStatus.value = "room-full";
      return;
    }
    
    checkRoomStatus.value = "room-start";

    idAdmin.value = checkRoomResponse?.idAdmin;

    if(checkRoomResponse?.idAdmin === $idUser){
      isAdmin.value = true;
    }
  }else{
    checkRoomStatus.value = "room-not-exist";
    return;
  }

  url.value = document.URL;
  name.value = $userName;

  // if(navigator?.userAgent.includes("Firefox")){
  $socket.send(JSON.stringify({
    channel: "enter-room",
    idUser: $idUser,
    idRoom,
    name: $userName,
    data: {}
  }));
  // }

  // $socket.onopen = () => {
  //   $socket.send(JSON.stringify({
  //     channel: "enter-room",
  //     idUser: $idUser,
  //     idRoom,
  //     name: $userName,
  //     data: {}
  //   }));
  // }

  $socket.onmessage = ({ data }) => {
    const res = JSON.parse(data) as ServerData;

    switch (res.channel) {
      case "players-in-room":
        if(Array.isArray(res.data)){
          status.value = true;

          const admin = res.data.find(p => p.id === idAdmin.value);

          if(admin){
            players.value = [admin].concat(res.data.filter(p => p.id !== idAdmin.value));
          }else{
            players.value = res.data;
          }
        }
        break;
      case "chat-message":
        if(!chatMessage.value){
            chatMessage.value += `${res.data.message}`;
          }else{
            chatMessage.value += `\n${res.data.message}`;
          }
        break;
      case "game-start":
        if(res.data?.path){
          router.replace(`/game/${res.data.path}`);
        }
        break;
      default:
        break;
    }
  };

  $socket.onclose = () => {
    status.value = false;
  };
  
  $socket.onerror = (err) => console.log(err);
});

function setName(){
  if(name.value.trim()){
    localStorage.userName = name.value;
    
    $socket.send(
        JSON.stringify({
          channel: "set-name",
          data: {
            name: name.value 
          }
        } as PlayerData<ServerDataSerName>
      )
    );
    
    editName.value = false;
  }
}

function setReady(_isReady: boolean){
    isReady.value = _isReady;

    $socket.send(
        JSON.stringify({
          channel: "set-ready",
          data: {
            isReady: isReady.value 
          }
        } as PlayerData
      )
    );   
}

function gameStart(){
    $socket.send(
        JSON.stringify({
          channel: "game-start",
          data: {}
        }
      )
    );   
}

function clipboard(text: string) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(text);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = text;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        // textArea.style.display = "none";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((res: any, rej: any) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
        });
    }
}

function giveUp() {
  $socket.send(
    JSON.stringify({
      channel: "give-up",
      data: {}   
    })
  );

  router.replace("/");
}
</script>