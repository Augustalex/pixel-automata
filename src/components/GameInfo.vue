<script setup>

import {computed} from "vue";
import {useGameState} from "@/gameState";
import {useCities} from "@/utils/Cities";
import {FireThreshold} from "@/systems/SimulatePolution";
import {calculateSeaLevel} from "@/systems/SimulateWaterSpread";

const gameState = useGameState();
const cities = useCities();

const seaLevel = computed(() => {
  return gameState.info.humidity === 0 ? '0%' : `${calculateSeaLevel(gameState.info.humidity) * 10}%`;
});
const heat = computed(() => {
  return Math.round(((gameState.info.averageTemperature - 1) / (FireThreshold - 1)) * 100);
});
const population = computed(() => {
  let total = 0;
  for (let [_, cityData] of cities.value) {
    if(cityData) {
      total += cityData.population;
    }
  }

  return total;
});
</script>
<template>
  <div class="info">
    <div class="textContainer">
      <h1>POLLUTION<br>{{ heat }}%</h1>
      <h1>SEA LEVEL<br>{{ seaLevel }}</h1>
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