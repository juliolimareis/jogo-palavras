<template>
  <div class="wrapper">
    <div class="container">
      <div class="background-circle" />
      <div class="text-inside-circle text-2xl">
        <p id="number-inside-circle">
          90
        </p>
      </div>
    </div>
    <!-- <button
      class="button-click"
      onclick="animateButtonClick()"
    >
      Animate with Random Value
    </button> -->
  </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

/* * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
} */

.wrapper {
  /* width: 200px;
  height: 200px; */
  /* position: absolute; */
  /* top: 0;
  bottom: 0;
  left: 0;
  right: 0; */
  /* margin: auto; */
  /* display: flex; */
  /* flex-direction: column;
  justify-content: center;
  align-items: center; */
}

.container {
  width: 100px;
  height: 100px;
}

.background-circle {
  /* width = container's size (200px) - ( 2 * svg's stroke-width (24px) ) .
        Increase a little bit */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.2);

  /* To center it inside the container.
        margin = ( container's size (200px) - the element's size (156px) ) / 2
        */
  margin: 22px;
  position: absolute;
}

.foreground-circle {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  /* To start the svg circle from the top */
  transform: rotate(-90deg);

  /* To center it inside the container */
  position: absolute;
  margin: 10px;
}

.foreground-circle svg circle {
  /* stroke-dasharray = 2 * (22/7) * svg's radius value (90px) */
  /* stroke-dasharray: 155; max 155 */
  stroke-dasharray: 60;
}

.text-inside-circle {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#number-inside-circle {
  font-weight: 700;
}

.remaining-text {
  font-weight: 400;
  font-size: 70px;
}

/* .button-click {
  background-color: #50c878;
  border: 1px solid transparent;
  padding: 0.4em 0.8em;
  border-radius: 0.4em;
  color: whitesmoke;
  cursor: pointer;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  font-weight: 400;
} */

/* To prevent svg border being cut off */
svg:not(:root) {
  overflow: visible;
}
</style>