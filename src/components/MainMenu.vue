<script setup>
import PlanetImage from "@/components/PlanetImage";
import {useView} from "@/utils/useView";
import {computed, ref} from "vue";
import FlowRow from "@/components/FlowRow";

const view = useView();
const startingLength = 2;
const startingTime = ref(0);
const startingProgress = ref(0);
const starting = ref(false);
const visible = ref(true);

const css = computed(() => ({
  background: `hsl(0, 0%, 14%)`
}));

const fadeOut = computed(() => ({
  opacity: 1 - startingProgress.value
}))

function start() {
  if (starting.value) {
    return;
  } else {
    starting.value = true;
    startingTime.value = Date.now();
  }

  const loop = () => {
    const now = Date.now();

    const progress = ((now - startingTime.value) / 1000) / startingLength;
    if (progress < 1) {
      startingProgress.value = easeOutCubic(progress)
    }

    if (progress > .2) {
      view.startGame();
    }

    if (progress > 1) {
      visible.value = false;
    } else {
      requestAnimationFrame(loop);
    }
  };
  loop();
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
</script>
<template>
  <template v-if="visible">
    <div class="backgroundColor"/>
    <div class="fadeout">

      <planet-image @click="start"/>
      <div class="menu-leftPosition">
        <flow-row/>
        <flow-row/>
        <flow-row letters="R"/>
        <flow-row letters="E"/>
        <flow-row letters="D"/>
        <flow-row/>
        <flow-row letters="P"/>
        <flow-row letters="I"/>
        <flow-row letters="X"/>
        <flow-row letters="E"/>
        <flow-row letters="L"/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
      </div>
      <div class="menu-position">
        <button class="button red-letter" @click="start">
          START
        </button>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
        <flow-row/>
      </div>
    </div>
  </template>
</template>
<style lang="scss" scoped>
.fadeout {
  opacity: v-bind('fadeOut.opacity');
}

.backgroundColor {
  width: 100vw;
  height: 100vh;
  z-index: 0;
  //background: hsla(0, 0, 95%);
  background: v-bind('css.background');
}

.menu-leftPosition {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  top: 50%;
  left: calc(50% - 50vh);
  transform: translate(-100%, -50%);
  height: 100%;
  box-sizing: border-box;
}

.menu-position {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  top: 50%;
  right: calc(50% - 50vh);
  transform: translate(100%, -50%);
  height: 100%;
  box-sizing: border-box;
}

button.button {
  cursor: default;
  user-select: none;
  display: block;
  font-family: VCR;
  background: none;
  border: none;
  font-size: 3.2em;
  margin: 0;
  //color: rgba(245, 163, 147, 0.9);
  color: hsla(0, 0, 147, 0.9);
  padding: 0;

  &:hover {
    //color: white;
    color: black;

    //background: rgba(245, 163, 147, 0.9);
    background: hsla(0, 0, 147, 0.9);
  }
}

button.button:hover {
  cursor: pointer;
}

button.red-letter {
  color: hsl(0deg 55% 55%);

  &:hover {
    color: hsl(0deg 55% 55%);
  }
}
</style>