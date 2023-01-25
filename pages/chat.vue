<template>
  <!-- <Head>
    <Title>Nuxt 3 Websocket</Title>
  </Head> -->

  <!-- <Header /> -->

  <div class="h-screen w-full grid place-items-center bg-gray-200 dark:bg-black">
    <span class="flex flex-col items-centers space-y-4">
      <span class="text-slate-900 dark:text-blue-500">
        <span class="text-green-500">{{ name }} </span>
        {{ status }}
      </span>
      
      <template v-if="hasName && name">
        <textarea class="w-80 h-80 bg-white" disabled v-model="chatMessages" />
        <textarea class="rounded-lg" placeholder="message ..." type="text" v-model="message" />
        
        <button
          @click="sendMessage"
          class="bg-blue-500 text-gray-50 font-semibold px-5 py-2 rounded-lg"
        >
          Send Message
        </button>
      </template>
      
      <template v-else>
        <Label class="text-black dark:text-white">You Name: </Label>
        <input class="rounded-lg" placeholder="his name is ....." type="text" v-model="name" />
        
        <button
          @click="setName"
          class="bg-blue-500 text-gray-50 font-semibold px-5 py-2 rounded-lg"
        >
          This is my name
        </button>
      </template>
    </span>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuid } from "uuid";

const uid = uuid();
const { $socket } = useNuxtApp();

const hasName = ref(false);
const name = ref("");
const status = ref("Offline");
const message = ref("");
const chatMessages = ref("");

const getData = () => {
  return JSON.stringify(
    { 
      channel: "global-chat",
      data: { message: message.value.replace(/^\s*$/gm, "") },
      id: getUserId(),
      name: name.value
    }
  );
};

const getUserId = () => localStorage.getItem(`connection-${uid}`) || ""; 

onMounted(() => {
  const localName = localStorage.getItem("name");

  if(localName){
    name.value = localName;
    hasName.value = true;
  }

  $socket.onopen = () => {
    status.value = "connected";
    localStorage.setItem(`connection-${uid}`, uid)
    $socket.send(getData());
  }

  $socket.onmessage = ({ data }: any) => {
    if(!chatMessages.value){
      chatMessages.value += `${data}`;
    }else{
      chatMessages.value += `\n${data}`;
    }
  }

  $socket.onclose = () => {
    status.value = "disconnected";
    console.log("disconnected");
  }
});

const sendMessage = () => {
  fetch("/api/sendMessage", {
    method: "POST",
    body: getData(),
  }).then(res => res.json()).then(() => {
    message.value = "";
  });
}

const setName = () => {
  if(name.value)
    localStorage.setItem("name", name.value);
    hasName.value = true;
} 

</script>