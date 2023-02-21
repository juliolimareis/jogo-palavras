<template>
  <div class="h-[250px] overflow-auto">
    <div>
      <span class="text-primary dark:text-white">Você pode destruir até {{ amountAttacks ?? 0 }} letras.</span>
    </div>

    <div
      v-for="card in result?.cards"
      :key="card.id"
      :class="`relative float-left m-3 text-primary ${selectedIds.includes(Number(card.id)) ?  'border-2 border-primary' : ''}  dark:text-white p-2 w-10 text-center rounded-lg cursor-pointer`"
      @click="upsetSelectId(card)"
    >
      {{ card.jokerValue ?? card.value }}
    </div>

    <div>
      <Button class="mt-3 bg-green-500" @click="handleOnAttack" :disabled="!amountAttacks || !selectedIds.length || result?.cards.filter(c => c.value === '@').length === result?.cards.length">Atacar!</Button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { specialLatters } from '~~/game/cards';

const selectedIds = ref<number[]>([]);

const props = defineProps<{ 
  onAttack: (selectedIds: number[]) => void,
  result?: Result,
  amountAttacks: number,
}>();

const options = [
  "A", "B", "C", "Ç", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Z", "Y", "W",
  ...specialLatters
];

function upsetSelectId(card: GameCard){
  if(card.id){
    if(selectedIds.value.length < props.amountAttacks && !selectedIds.value.includes(card.id ?? 0)){
      selectedIds.value.push(card.id);
    }else{
      selectedIds.value = selectedIds.value.filter(id => id !== card.id);
    }
  }
}

function handleOnAttack() {
  if(props.onAttack){
    props.onAttack(selectedIds.value);
  }
}

</script>