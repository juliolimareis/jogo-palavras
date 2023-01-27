<template>
  <div class="w-40 text-center relative border-2 border-gray-300 rounded-md p-3 bg-gray-100">
    <ProfileIcon class="mx-auto mb-1" />
    <span class="top-3 left-[87px] absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
    <span class="">
      {{ props.name }}
    </span>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({ name: { default: "", type: String } });

</script>