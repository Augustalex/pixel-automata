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
  <divc class="info">
    <h1>HUMIDITY: {{ humidity }}%</h1>
    <h1>POPULATION: {{ population }}</h1>
  </divc>
</template>
<style scoped>
.info {
  margin-left: 45px;
}
</style>