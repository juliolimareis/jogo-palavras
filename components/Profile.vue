<template>
  <div
    :class="`
    w-40 text-center relative border-2 rounded-md p-3 bg-gray-100
    ${isReady ? 'border-green-400' : 'border-gray-300'}
  `"
  >
    <ProfileIcon class="mx-auto mb-1" />
    <CrownIcon
      v-if="isAdmin"
      class="absolute z-10 top-0 left-20 rotate-[30deg]"
    />

    <span
      v-else
      class="top-3 left-[87px] bg-green-400 absolute w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full"
    />
    <span class="">
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts" setup>

defineProps({
  name: { default: "", type: String },
  isReady: { default: false, type: Boolean },
  isAdmin: { default: false, type: Boolean },
});

</script>