<template>
  <div class="container mx-auto px-14 max-w-md mt-2">
    <Header>
      Takopi
    </Header>

    <Subtitle class="m-4">
      Criar Sala
    </Subtitle>

    <ul class="text-center w-max-[300px]">
      <li v-for="error in errors" class="text-red-600">
        - {{ error }}
      </li>
    </ul>

    <div class="grid grid-cols-1 gap-4 m-auto mt-2">
      <div class="m-auto">

        <label
          class="block mb-2 text-sm font-medium text-gray-900 -dark:text-primary"
        > Número máximo de jogadores
        </label>
        <input
          v-model="roomData.maxPlayers"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 -dark:bg-gray-700 -dark:border-gray-600 -dark:placeholder-gray-400 -dark:text-white -dark:focus:ring-blue-500 -dark:focus:border-blue-500"
          placeholder="3"
          required
          max="10"
          min="2"
        >
      </div>

      <div class="m-auto">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 -dark:text-primary"
        >Rodadas
        </label>
        <input
          v-model="roomData.maxRounds"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 -dark:bg-gray-700 -dark:border-gray-600 -dark:placeholder-gray-400 -dark:text-white -dark:focus:ring-blue-500 -dark:focus:border-blue-500"
          placeholder="3"
          required
          max="10"
          min="1"
        >
      </div>

      <div class="m-auto">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 -dark:text-primary"
        >Tempo por rodada em minutos</label>
        <input
          v-model="roomData.roundTimeout"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 -dark:bg-gray-700 -dark:border-gray-600 -dark:placeholder-gray-400 -dark:text-white -dark:focus:ring-blue-500 -dark:focus:border-blue-500"
          placeholder="3"
          required
          max="5"
          min="1"
        >
      </div>

      <!-- <div class="m-auto">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 -dark:text-primary"
        >Nível de dificuldade</label>
        <select
          v-model="roomData.difficulty"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 -dark:bg-gray-700 -dark:border-gray-600 -dark:placeholder-gray-400 -dark:text-white -dark:focus:ring-blue-500 -dark:focus:border-blue-500"
        >
          <option
            selected
            value="0"
          >
            Fácil
          </option>
          <option value="1">
            Médio
          </option>
          <option value="2">
            Difícil
          </option>
        </select>
      </div> -->
    </div>

    <div class="w-auto text-center mt-10">
      <Button
        :disabled="isLoading"
        @click="onCreate"
      >
        {{ isLoading ? 'Criando ...' : 'Criar Sala' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createRoom, checkPlayerRoom, } from "~~/core/repository";

const { $idUser } = useNuxtApp();

const errors = ref<string[]>([]);

const isLoading = ref(false);
const linkRoom = ref("");
const roomData = ref<RoomData>({
  id: "create",
  maxRounds: 3,
  maxPlayers: 2,
  difficulty: "0",
  roundTimeout: 3,
  idAdmin: $idUser
});

onMounted(() => {
  checkPlayerRoom($idUser).then(res => {
    if(res?.isInRoom && res?.idRoom){
      linkRoom.value = `/room/${res.idRoom}`;
    }
  });
});

function validate() {
  const { maxRounds, maxPlayers, roundTimeout, } = roomData.value;

  errors.value = [];

  if(!maxPlayers || maxPlayers < 2){
    errors.value.push("Número máximo de jogadores é inválido");
  }

  if(!maxRounds){
    errors.value.push("Número de rodadas é inválido");
  }

  if(!roundTimeout){
    errors.value.push("Tempo da rodada é inválido");
  }

  if(maxRounds > 10){
    errors.value.push("Número máximo de rodadas deve ser menor que 10");
  }

  if(maxPlayers > 10) {
    errors.value.push("Número máximo de players deve ser menor que 10");
  }

  if(roundTimeout > 5){
    errors.value.push("Número máximo de minutos por turno deve ser menor que 5");
  }

  return errors.value;

}

const onCreate = () => {
  if(validate().length) return;

  isLoading.value = true;

  createRoom(roomData.value).then((res) => {
    if(res.body?.idRoom){
      window.location.replace(`/room/${res.body.idRoom}`);
    }
  });
};

</script>