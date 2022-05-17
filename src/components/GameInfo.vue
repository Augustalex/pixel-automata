<script setup>

import {computed} from "vue";
import {useGameState} from "@/gameState";
import {useCities} from "@/utils/Cities";

const gameState = useGameState();
const cities = useCities();

const humidity = computed(() => {
  return Math.round(gameState.info.humidity * 100);
});
const population = computed(() => {
  const cityData = cities.value.get('city-1');
  return cityData ? cityData.population : 0;
});
</script>
<template>
  <div class="info">
    <div class="textContainer">
      <h1>HUMIDITY<br>{{ humidity }}%</h1>
      <h1>POPULATION<br>{{ population }}</h1>
    </div>
  </div>
</template>
<style scoped>
.info {
  position: relative;
}

.textContainer {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: center;
}

h1 {
  font-size: 1.4em;
  letter-spacing: .2em;
  user-select: none;
}
</style>