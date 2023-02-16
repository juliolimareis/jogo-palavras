<template>
  <div :class="`${bgColor} rounded-lg w-[70px] h-[100px] border-2 shadow-lg cursor-pointer`">
    <span :class="`${points > 1 ? 'left-[38%]' : 'left-[45%]'} top-[70px] relative text-white font-bold`">
      {{ points }}
    </span>

    <div
      v-if="Vowels.includes(value) || Vowels.includes(value.split('-')[1])"
      class="absolute z-10 ml-5 mt-[-20px]"
    >
      <Latter
        :class="accClass"
        :size="accSize"
        :color="color"
        :render="acc"
      />
    </div>

    <div
      v-if="value === 'J'"
      class="ml-[-10px] mt-[-22px]"
    >
      <Latter
        :size="latterSize"
        :color="color"
        :render="value"
      />
    </div>

    <div
      v-else-if="value === '?'"
      class="ml-[18px] mt-[-5px]"
    >
      <Latter
        :size="'230'"
        :color="color"
        :render="'?'"
      />
    </div>

    <div
      v-else-if="value.includes('-')"
    >
      <svg
        class="absolute z-5 top-0 left-[-12px]"
        width="90px"
        height="80px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.4902 2.23006L5.50016 4.11006C4.35016 4.54006 3.41016 5.90006 3.41016 7.12006V14.5501C3.41016 15.7301 4.19016 17.2801 5.14016 17.9901L9.44016 21.2001C10.8502 22.2601 13.1702 22.2601 14.5802 21.2001L18.8802 17.9901C19.8302 17.2801 20.6102 15.7301 20.6102 14.5501V7.12006C20.6102 5.89006 19.6702 4.53006 18.5202 4.10006L13.5302 2.23006C12.6802 1.92006 11.3202 1.92006 10.4902 2.23006Z"
          :stroke="color"
          stroke-width=".5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <Latter
        class="z-10 ml-1 mt-[-10px]"
        :size="latterSize"
        :color="color"
        :render="value.split('-')[1]"
      />
    </div>

    <div v-else-if="value === 'Ç'">
      <div
        class="ml-[3px] mt-[-20px]"
      >
        <Latter
          class="z-10"
          :size="'60'"
          :color="color"
          :render="'C'"
        />
      </div>
      <div
        class="absolute z-9 left-[20px] top-[42px]"
      >
        <Latter
          :size="'30'"
          :color="color"
          :render="'S'"
        />
      </div>
    </div>

    <div
      v-else
      class="ml-1 mt-[-10px]"
    >
      <Latter
        :size="latterSize"
        :color="color"
        :render="value"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Vowels, } from "../game/cards";

const props = defineProps({
  value: {
    default: "A",
    type: String
  },
  acc: { // accentuation
    default: "",
    type: String
  },
  color: {
    default: "#FFF",
    type: String
  },
  isSelect: {
    default: false,
    type: Boolean
  },
  type: {
    default: "", // letra = "", curinga = "?", attack = "ATK"
    type: String
  },
  points: {
    default: 1,
    type: Number
  },
});

const accSize = ref("25");
const accClass= ref("");
const latterSize = ref("60");
const bgColor = ref("bg-latter");

onMounted(() => {
  if(props.value === "J"){
    latterSize.value = "85";
  }
  else if(props.value === "?"){
    bgColor.value = "bg-joker";
  }
  else if(props.value === "ATK"){
    bgColor.value = "bg-atk";
  }
  else if(props.value.includes("-")){
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

  .bg-atk {
    background: radial-gradient(#fbc1cc, #fa99b2);
  }

  .bg-shd {
    background: radial-gradient(#60efbc, #58d5c9);
  }
</style>