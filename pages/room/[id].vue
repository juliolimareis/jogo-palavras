<template>
  <div class="container w-full mx-auto px-14 mt-2">
    <Header>
      Takopi
    </Header>

    <div class="text-center mt-3">
      <span class="font-bold">Link da sala: </span>
      <!-- <span id="linkRoom" class="font-bold text-primary"> {{ url }}</span> -->
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
      <!-- <label class="text-black">Nickname: </label> -->
      <div>
        <span class="font-bold">Nickname: </span>
        <span>
          <input
            class="rounded-md bg-gray-300 h-9"
            placeholder=" nickname"
            type="text"
            :disabled="!editName"
            v-model="name"
          >
        <Button v-if="editName" @click="setName()" class="bg-green-600 ml-3 mt-3">
          Salvar
        </Button>
        
        <Button v-else @click="editName = true" class="bg-primary ml-3  mt-3">
          Editar
        </Button>
        </span>
      </div>
      
      <!-- <p v-if="isSalveName" class="text-green-500">Nome salvo com sucesso!</p> -->
     </div> 
    </div>

    <div class="grid grid-cols-1 gap-4 m-auto mt-4">
      <div class="m-auto w-full">
        <Chat :chatMessage="chatMessage"/>
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
        <Button @click="useRouter().replace('/')" class="bg-orange-500">
          Sair
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const router = useRouter();
const { $socket, $idRoom, $idUser, $userName, } = useNuxtApp();

const url = ref("");
const name = ref("");
const status = ref(false);
const isClipboard = ref(false);
const chatMessage = ref("");
const isAdmin = ref(false);
const isReady = ref(false);
const players = ref<Array<ServerDataPlayerInRoom>>([]);
const editName = ref(false);
const idAdmin = ref("");

const clipboardUrl = () => clipboard(url.value).then(() => isClipboard.value = true);

onMounted(async () => {
  await checkRoom();

  url.value = document.URL;
  name.value = $userName;

  if(navigator?.userAgent.includes("Firefox")){
    $socket.send(JSON.stringify({
      channel: "enter-room",
      idUser: $idUser,
      idRoom: $idRoom,
      name: $userName,
      data: {}
    }));
  }

  $socket.onopen = () => {
    $socket.send(JSON.stringify({
      channel: "enter-room",
      idUser: $idUser,
      idRoom: $idRoom,
      name: $userName,
      data: {}
    }));
  }

  $socket.onmessage = ({ data }) => {
    const res = JSON.parse(data) as ServerData;
    status.value = true;

    switch (res.channel) {
      case "players-in-room":
        if(Array.isArray(res.data)){
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

async function checkRoom() { //room-test = b675b85c-407e-493f-a8da-9c9c222164d8
  await fetch(`/api/check-room/${$idRoom}`, { method: "GET" })
    .then(res => res.json())
    .then(res => {
      console.log(res);

      if(res?.gameReady && res?.idRoom){
        router.replace(`/game/${res.idRoom}`);
        return;
      }

      idAdmin.value = res?.idAdmin;

      if(res?.idAdmin === $idUser){
        isAdmin.value = true;
      }
    })
    .catch(err => console.log(err));
}

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

</script>