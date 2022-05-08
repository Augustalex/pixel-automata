<script setup>
import {Simulation, useGameState} from "@/gameState";
import PixelTile from "@/components/pixel-tile";
import {computed, onMounted} from "vue";
import PixelDrawer from "@/components/pixel-drawer";
import {useMousePosition} from "@/useMousePosition";
import GameCursor from "@/components/game-cursor";
import GameInfo from "@/components/GameInfo";

const gameState = useGameState();
const mousePosition = useMousePosition();

onMounted(() => {
  const simulation = Simulation();
  simulation.start();

  window.addEventListener('keydown', e => {
    if (e.key === 'p') {
      if (simulation.isRunning()) {
        simulation.stop();
      } else {
        simulation.start();
      }
    }
  });

  window.addEventListener('mousemove', e => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  });
});

const css = computed(() => ({
  gridWidth: `${gameState.worldData.width * gameState.worldData.tileSize}px`,
  gridHeight: `${gameState.worldData.height * gameState.worldData.tileSize}px`,
}));

</script>

<template>
  <game-cursor/>
  <div class="playArea">
    <pixel-drawer/>
    <div class="grid">
      <div v-for="(pixel, index) in gameState.pixels" :key="index">
        <pixel-tile :pixel="pixel"/>
      </div>
    </div>
    <game-info/>
  </div>
</template>

<style lang="scss" scoped>
.playArea {
  display: flex;
}

.grid {
  position: relative;
  width: v-bind('css.gridWidth');
  height: v-bind('css.gridHeight');
}
</style>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
