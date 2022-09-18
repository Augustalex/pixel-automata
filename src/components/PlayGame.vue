<script setup>
import {Simulation, useGameState, useSimulation} from "@/gameState";
import {computed, onMounted, ref} from "vue";
import PixelDrawer from "@/components/pixel-drawer";
import {useMousePosition} from "@/useMousePosition";
import GameInfo from "@/components/GameInfo";
import PlanetRenderer from "@/components/PlanetRenderer";
import InfoBar from "@/components/InfoBar";
import GameSettings from "@/components/GameSettings";
import {useTileSize} from "@/utils/useTileSize";
import TechTree from "@/components/TechTree";
import PixelInfo from "@/components/PixelInfo";
import PartyChoice from "@/components/PartyChoice.vue";

const gameState = useGameState();
const mousePosition = useMousePosition();
const {tileSize} = useTileSize();

const offsetX = ref(20);

const yMax = window.innerHeight * 1.5;
const startingY = ref(yMax);

const transitionLength = 4;
const transitionTime = ref(0);
const started = ref(false);
const simulation = useSimulation();

const yPosition = computed(() => `translateY(${startingY.value}px)`);
const opacity = computed(() => `1`);
const sideBarsOpacity = computed(() => Math.max(0, Math.min(1, 1 - (startingY.value / 100))));

function getOpacity(transitionTime) {
  const eased = 1 - easeOutCubic((transitionTime) / 2);
  return 1 - Math.min(1, Math.max(0, (eased + .5)))
}

onMounted(() => {
  simulation.value.start();

  window.addEventListener('keydown', e => {
    if (e.key === 'p') {
      if (simulation.value.isRunning()) {
        simulation.value.stop();
      } else {
        simulation.value.start();
      }
    }
  });

  let lastNow = Date.now();
  const planetRotationLoop = () => {
    const now = Date.now();
    const delta = (now - lastNow) / 1000;

    offsetX.value += delta * 10;

    if (!started.value) {
      transitionTime.value = Date.now();
      started.value = true;
    }

    const progressAbsolute = now - transitionTime.value;
    const progress = (progressAbsolute / 1000) / transitionLength;
    if (progress <= 1) {
      const number = 1 - easeOutCubic(progress);
      startingY.value = yMax * (number);
    }

    lastNow = now;

    requestAnimationFrame(planetRotationLoop);
  }

  planetRotationLoop();
});

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const css = computed(() => ({
  gridWidth: `${gameState.worldData.width * tileSize.value}px`,
  gridHeight: `${gameState.worldData.height * tileSize.value}px`,
}));

</script>

<template>
  <!--  <game-cursor/>-->
  <game-settings/>
  <div class="playArea">
    <pixel-drawer class="playArea-left"/>
    <planet-renderer class="playArea-middle"/>
    <game-info class="playArea-right"/>
    <party-choice />
  </div>
  <info-bar/>
  <tech-tree/>
  <pixel-info />
</template>

<style lang="scss" scoped>
.playArea {
  position: absolute;
  transform: v-bind('yPosition');
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  display: flex;
  opacity: v-bind('opacity');
}

.playArea-left {
  width: 8em;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  padding-right: 6em;

  opacity: v-bind('sideBarsOpacity');
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
  opacity: v-bind('sideBarsOpacity');
}

.grid {
  position: relative;
  width: v-bind('css.gridWidth');
  height: v-bind('css.gridHeight');
  overflow: hidden;
  border-radius: 50%;
}
</style>