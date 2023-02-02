<template>
  <button
    :disabled="disabled"
    :class="classes()"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  }
});

const classes = () => {
  // const classes = "disabled:opacity-50"
  const defaultClasses = "max-w-sm font-semibold px-5 py-2 rounded-lg text-white bg-primary text-md";

  if(props.disabled){
    return defaultClasses.concat(" ", "disabled:opacity-50");
  }

  return defaultClasses;
};

</script>