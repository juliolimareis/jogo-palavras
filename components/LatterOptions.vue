<template>
  <div class="h-[250px] overflow-auto">
    <div
      v-for="latter in options"
      :key="latter"
      class="relative float-left m-3 text-primary dark:text-white border-2 dark:border-white p-2 w-10 text-center rounded-lg cursor-pointer"
      @click="handleSelect(latter)"
    >
      {{ latter }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { specialLatters, special } from '~~/game/cards';

const options = ref<string[]>([]);

const props = defineProps<{
  onSelect: (latter: string) => void,
  card?: GameCard,
}>();

function handleSelect(latter: string) {
  if(props.onSelect){
    props.onSelect(latter);
  }
}

onMounted(() => {
  if(props.card){
    if(props.card?.isJoker){
      options.value = ["A", "B", "C", "Ç", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Z", "Y", "W",
        ...specialLatters
      ];
    }else{
      options.value = special;
    }
  }
});

</script>