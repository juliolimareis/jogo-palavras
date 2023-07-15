<template>
  <div v-if="isGameOver" class="ml-[-20px]">
    <h1 class="text-center text-primary mb-3 mt-3 text-2xl font-bold">Resultados Finais</h1>

    <table class="w-screen text-sm text-left text-gray-500 dark:text-gray-400 m-5">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Rank</th>
          <th scope="col" class="px-6 py-3">Jogador</th>
          <th scope="col" class="px-6 py-3">Pontos na mão</th>
          <th scope="col" class="px-6 py-3">Pontos Totais</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="totalScore, i in getTotalScorePlayers(results, handCardsPerPlayer)"
          :key="i"
          :class="`border-2 ${$idUser === totalScore.idPlayer ? 'border-primary' : ''} bg-white dark:bg-gray-800`"
        >
          <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ i + 1 }}°</td>
          <td class="px-6 py-4">{{ totalScore.playerName }}</td>
          <td class="px-6 py-4">{{ totalScore.scoreHand }}</td>
          <td class="px-6 py-4">{{ totalScore.totalScore }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-for="rounds, i in Object.values(results)"
    :key="i"
    class="ml-[-20px]"
  >
    <h1 class="text-center text-primary mb-3 mt-3 text-2xl">Resultados da Rodada {{ i + 1 }}</h1>

    <table class="w-screen text-sm text-left text-gray-500 dark:text-gray-400 m-5">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Jogador</th>
          <th scope="col" class="px-6 py-3">Palavra</th>
          <th scope="col" class="px-6 py-3">Pontos</th>
          <th scope="col" class="px-6 py-3">Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="result, i in rounds.sort((a, b) => { if (a.score > b.score) return -1; else if (a.score < b.score) return 1; return 0; })"
          :key="i"
          :class="`border-2 ${$idUser === result.idPlayer ? 'border-primary' : ''} bg-white dark:bg-gray-800 `"
        >
          <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ result.playerName }}</td>
          <td :class="`px-6 py-4 ${result.hasAttacked ? 'text-red-500' : ''}`">{{ getWord(result.cards)}}</td>
          <td class="px-6 py-4">{{ result.score }}</td>
          <td class="px-6 py-4">
            <template v-if="isAttack && $idUser !== result.idPlayer">
              <Button class="bg-red-500" @click="onAttack(result)" :disabled="!result.cards.length">Atacar</Button>
            </template>
            <template v-else>
              -
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <h1 v-if="!Object.keys(results).length" class="text-center text-primary mb-3 mt-3 text-2xl">Os resultados serão computados na próxima rodada.</h1>
</template>

<script lang="ts" setup>

const { $idUser } = useNuxtApp();

const props = defineProps<{
  results: Record<string, Result[]>;
  isGameOver: boolean;
  onAttack: (result: Result) => void;
  isAttack: boolean;
  handCardsPerPlayer: HandCardsPerPlayer[];
}>();

function getWord(cards: GameCard[]){
  // {{ w?.acc ? vowelsSpecialDic[w.value][w.acc] ?? "" : w.jokerValue ?? w.value }}
  return cards.map(card => {
    if(card.acc){
      //@ts-ignore
      return vowelsSpecialDic[card.value][card.acc];
    }

    return card.jokerValue ?? card.value;
  }).join("") || "-";
}

</script>