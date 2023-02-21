<template>
  <div
    v-if="status === 'offline'"
    class="mt-20 text-orange-500 text-center font-bold text-lg"
  >
    Você está offline.
  </div>

  <div
    v-else-if="status === 'timeout'"
    class="mt-20 text-red-500 text-center font-bold text-lg"
  >
    Não foi possível estabelecer a conexão :(
  </div>

  <div
    v-else-if="status === 'not-found'"
    class="mt-20 text-red-500 text-center font-bold text-lg"
  >
    Sala não encontrada.
  </div>

  <div
    v-else-if="status === 'not-ready'"
    class="mt-20 text-primary text-center font-bold text-lg"
  >
    Jogo ainda não começou.

    <div>
      <Button class="mt-5" @click="router.push(`/room/${$idRoom}`)">Entrar na sala.</Button>
    </div>
    
  </div>

  <div v-else-if="status === 'loading'" class="mt-20 text-primary text-center font-bold text-lg">
    Carregando .....
  </div>

  <template v-else />
</template>

<script lang="ts" setup>
const router = useRouter();
const { $idRoom } = useNuxtApp();

defineProps<{ status: MessageStatus }>();
</script>