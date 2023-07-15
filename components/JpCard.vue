<template>
  <div :class="`${bgColor} rounded-lg w-[70px] h-[100px] border-2 shadow-lg cursor-pointer`">
    <span :class="`${card.points > 1 ? 'left-[38%]' : 'left-[45%]'} top-[70px] relative text-white font-bold`">
      {{ card.points }}
    </span>

    <div v-if="card.value === 'ATK'" class="ml-[5px] mt-[-12px]">
      <BobIcon :size="55" />
    </div>

    <div v-else-if="card.value === '?'" class="ml-[11px] mt-[-1px]">
      <Latter
        :size="'46'"
        :color="color"
        :render="'?'"
      />
    </div>

    <div v-else class="ml-[10px] mt-[-22px]">
      <div class="text-[48px] text-white font-bold">
        {{ card.value }}
      </div>
    </div>

    <!-- Check if draw a shield -->
    <div v-if="card?.isShield">
      <svg
        class="relative z-5 top-[-75px] left-[-12px]"
        width="90px"
        height="80px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.4902 2.23006L5.50016 4.11006C4.35016 4.54006 3.41016 5.90006 3.41016 7.12006V14.5501C3.41016 15.7301 4.19016 17.2801 5.14016 17.9901L9.44016 21.2001C10.8502 22.2601 13.1702 22.2601 14.5802 21.2001L18.8802 17.9901C19.8302 17.2801 20.6102 15.7301 20.6102 14.5501V7.12006C20.6102 5.89006 19.6702 4.53006 18.5202 4.10006L13.5302 2.23006C12.6802 1.92006 11.3202 1.92006 10.4902 2.23006Z"
          stroke="white"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  card: GameCard,
  isSelected?: boolean,
  color?: string,
  acc?:string
}>();

const accSize = ref("25");
const accClass= ref("");
const latterSize = ref("60");
const bgColor = ref("bg-latter");

onMounted(() => {
  if(props.card.value === "J"){
    latterSize.value = "85";
  }
  else if(props.card.value === "?"){
    bgColor.value = "bg-joker";
  }
  else if(props.card.value === "ATK"){
    bgColor.value = "bg-atk";
  }
  else if(props.card.value.includes("-")){
    bgColor.value = "bg-shd";
  }
  else if(props.acc === "´"){
    accSize.value = "13";
    accClass.value = "ml-2 mt-1";
  }
});

</script>

<style scoped>
  .bg-latter {
    background: radial-gradient(#1fe4f5, #3fbafe);
  }

  .bg-joker {
    background: radial-gradient(#eafe76, #e2af22);
  }

  /* .bg-atk {
    background: radial-gradient(#fbc1cc, #fa99b2);
  } */
  .bg-atk {
    background: radial-gradient(#ddb6b6, #e71212);
  }

  .bg-shd {
    background: radial-gradient(#60efbc, #58d5c9);
  }
</style>