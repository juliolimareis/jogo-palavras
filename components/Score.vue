<template>
  <div v-for="rounds, i in Object.values(results)" :key="i">
    <h1 class="text-center text-primary mb-3 text-2xl">Resultados da Rodada {{ i + 1 }}</h1>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 m-5">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Jogador</th>
          <th scope="col" class="px-6 py-3">Palavra</th>
          <th scope="col" class="px-6 py-3">Pontos</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="result, i in rounds"
          :key="i"
          :class="`border-2 ${$idUser === result.idPlayer ? 'border-primary' : ''} bg-white dark:bg-gray-800`"
        >
          <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ result.playerName }}</td>
          <td class="px-6 py-4">{{ getWord(result.cards)}}</td>
          <td class="px-6 py-4">{{ result.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
const { $idUser } = useNuxtApp();

const props = defineProps<{ results: Record<string, Result[]>, isGameOver: boolean }>();
// const winnerName = ref("");

// function sumTotalWinner(){
//   return 
// }

function getWord(cards: GameCard[]){
  return cards.map(card => {
    if(card.jokerValue) return card.jokerValue;
    return card.value;
  }).join("") ?? "-";
}
</script>