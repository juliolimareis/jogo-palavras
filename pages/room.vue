<template>
  <div class="container w-full mx-auto px-14 mt-2">
    <Header>
      Takopi
    </Header>

    <div class="text-center mt-3">
      <span class="font-bold">Link da sala:</span>
      <span class="font-bold text-primary"> http://localhost:3000/room/gprjgowcvwepp</span>
      <Button class="ml-2">
        Copiar
      </Button>
    </div>

    <div class="grid grid-cols-1 gap-4 m-auto mt-2">
      <div class="m-auto w-full">
        <Chat class="" />
      </div>

      <div class="border-2 rounded-md border-gray-400 w-full h-56 overflow-y-auto">
        <Profile
          v-for="name in players"
          :key="name"
          class="float-left m-2"
          :name="name"
        />
      </div>
    </div>

    <div class="w-auto text-center mt-10">
      <Button class="bg-green-600">
        Iniciar
      </Button>

      <div class="mt-4">
        <Button class="bg-orange-300">
          Sair
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const players = ref(["João", "Maria", "José", "Pedro", "Ana", "Paula", "Rafael", "Fernanda", "Mateus", "Carla",
  "Miguel", "Marcos", "Lucas", "Julia", "Bruno", "Camila", "Gustavo", "Larissa", "Thiago", "Letícia", "Ricardo", "Gabriela", "Vitor", "Fátima", "Daniela", "Eduardo", "Marina", "André", "Renata", "Guilherme", "Isabela"]);

</script>