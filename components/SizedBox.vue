<template>
  <div :class="`w-[${w}px] h-[${h}px]`" />
</template>

<script setup>
defineProps({
  w: {
    type: String,
    default: "0"
  },
  h: {
    type: String,
    default: "0"
  },
});
</script>