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
  const defaultClasses = "max-w-sm font-semibold px-2 py-2 text-sm md:px-5 md:py-2 md:text-md rounded-lg text-white bg-primary";

  if(props.disabled){
    return defaultClasses.concat(" ", "disabled:opacity-50");
  }

  return defaultClasses;
};

</script>