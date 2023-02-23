<template>
  <div class="h-[250px] overflow-auto">
    <div v-if="countShieldsInResult">
      <span class="text-green-500 mb-3">Esta palavra está protegida por <b>{{ countShieldsInResult }}</b> {{ countShieldsInResult > 1 ? 'escudos' : 'escudo' }}.</span>
    </div>

    <div>
      <span class="text-primary dark:text-white">Você pode destruir até <b>{{ amountAttacks ?? 0 }}</b> letras.</span>
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
      <Button class="mt-3 bg-green-500" @click="handleOnAttack" :disabled="disabledAttackButton()">Atacar!</Button>
    </div>

  </div>
</template>

<script lang="ts" setup>

const selectedIds = ref<number[]>([]);
const isProtected = ref(false);
const countShieldsInResult = ref(0);

const props = defineProps<{ 
  onAttack: (selectedIds: number[]) => void,
  result?: Result,
  amountAttacks: number,
}>();

function disabledAttackButton(){
  return !props.amountAttacks
    || !selectedIds.value.length
    // || (props.result?.cards.filter(c => c.value === '@').length ?? 0) >= props.amountAttacks
    // || props.result?.cards.some(c => c.value === '@')
    || isProtected.value
    || countShieldsInResult.value >= selectedIds.value.length
}

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

onMounted(() => {
  countShieldsInResult.value = props.result?.cards.filter(c => c.isShield).length ?? 0;

  if(countShieldsInResult?.value > props.amountAttacks){
    isProtected.value = true;
  }
});

</script>