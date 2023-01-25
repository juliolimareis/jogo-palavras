<template>
  Initial
  <Button @click="increment">
    {{ count }}
  </Button>
</template>

<script setup>
const count = ref(0);

const increment = () => {
  count.value++;
};

</script>