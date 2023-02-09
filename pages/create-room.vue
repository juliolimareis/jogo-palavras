<template>
  <div class="container mx-auto px-14 max-w-md mt-2">
    <Header>
      Takopi
    </Header>

    <Subtitle class="m-4">
      Criar Sala
    </Subtitle>

    <div class="grid grid-cols-1 gap-4 m-auto mt-2">
      <div class="m-auto">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 -dark:text-primary"
        >Número máximo de jogadores
        </label>
        <input
          v-model="roomData.maxPlayers"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 -dark:bg-gray-700 -dark:border-gray-600 -dark:placeholder-gray-400 -dark:text-white -dark:focus:ring-blue-500 -dark:focus:border-blue-500"
          placeholder="3"
          required
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
        >
      </div>

      <div class="m-auto">
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
      </div>
    </div>

    <div class="w-auto text-center mt-10">
      <Button @click="onCreate">
        Criar Sala
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoomData, } from "~~/types/types/types";

const { $idUser } = useNuxtApp();

const roomData = ref<RoomData>({
  difficulty: "0",
  maxPlayers: 2,
  maxRounds: 3,
  id: "create",
  roundTimeout: 3,
  idAdmin: $idUser
});

const onCreate = () => {
  fetch("/api/create-room", {
    method: "POST",
    body: JSON.stringify(roomData.value),
  }).then(res => res.json()).then((res) => {
    if(res.body.idRoom){
      useRouter().push(`/room/${res.body.idRoom}`);
    }
    console.log(res);
  });
};

</script>