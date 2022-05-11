<script setup>
import {Simulation, useGameState} from "@/gameState";
import PixelTile from "@/components/pixel-tile";
import {computed, onMounted, ref} from "vue";
import PixelDrawer from "@/components/pixel-drawer";
import {useMousePosition} from "@/useMousePosition";
import GameCursor from "@/components/game-cursor";
import GameInfo from "@/components/GameInfo";
import Stars from "@/components/BackgroundStars";
import BackgroundStars from "@/components/BackgroundStars";
import PlanetRenderer from "@/components/PlanetRenderer";

const gameState = useGameState();
const mousePosition = useMousePosition();

const offsetX = ref(20);

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

  let lastNow = Date.now();
  const planetRotationLoop = () => {
    const now = Date.now();
    const delta = (now - lastNow) / 1000;

    offsetX.value += delta * 10;

    lastNow = now;

    requestAnimationFrame(planetRotationLoop);
  }

  planetRotationLoop();
});

const css = computed(() => ({
  gridWidth: `${gameState.worldData.width * gameState.worldData.tileSize}px`,
  gridHeight: `${gameState.worldData.height * gameState.worldData.tileSize}px`,
}));

</script>

<template>
  <background-stars/>
  <!--  <game-cursor/>-->
  <div class="playArea">
    <pixel-drawer class="playArea-left"/>
    <planet-renderer class="playArea-middle"/>
    <!--    <div class="grid">-->
    <!--      <pixel-tile v-for="(pixel, index) in gameState.pixels" :key="index" :pixel="pixel" :offsetX="offsetX"/>-->
    <!--    </div>-->
    <game-info class="playArea-right"/>
  </div>
</template>

<style lang="scss" scoped>
.playArea {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  display: flex;
}

.playArea-left {
  width: 8em;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  padding-right: 6em;
}

.playArea-middle {
  flex: 0 0 auto;
}

.playArea-right {
  width: 8em;
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  margin-left: 6em;
}

.grid {
  position: relative;
  width: v-bind('css.gridWidth');
  height: v-bind('css.gridHeight');
  overflow: hidden;
  border-radius: 50%;
}
</style>