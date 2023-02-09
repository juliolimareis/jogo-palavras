<template>
  <div class="-h-screen w-full place-items-center -bg-gray-200 -dark:bg-black">
    <span class="flex flex-col items-centers space-y-4">
      <textarea
        :value="chatMessage"
        class="w-full h-40 bg-gray-300 rounded-sm"
        disabled
      />
      <textarea
        v-model="message"
        class="rounded-sm bg-gray-300"
        placeholder="message ..."
        type="text"
      />

      <div class="text-center">
        <Button
          class="align-middle"
          @click="sendMessage"
        >
          Enviar mensagem
        </Button>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { DataChat, PlayerData, } from "~~/types/types/types";

defineProps({
  chatMessage: {
    defaultValue: "",
    type: String,
  }
});

const { $socket } = useNuxtApp();

const message = ref("");

const sendMessage = () => {
  if(message.value.trim()){
    $socket.send(
      JSON.stringify(
      {
        channel: "chat-message",
        data: { message: message.value.replace(/^\s*$/gm, "") },
      } as PlayerData<DataChat>
    ));
    message.value = ""
  }
};

</script>