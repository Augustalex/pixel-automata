<script setup>
import {Simulation, useGameState} from "@/gameState";
import PixelTile from "@/components/pixel-tile";
import {onMounted} from "vue";
import PixelDrawer from "@/components/pixel-drawer";
import {useMousePosition} from "@/useMousePosition";
import GameCursor from "@/components/game-cursor";

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
  </div>
</template>

<style lang="scss" scoped>
.playArea {
  display: flex;
}

.grid {
  position: relative;
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
