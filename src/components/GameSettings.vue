<script setup>
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";
import {computed, ref} from "vue";
import {useSimulation} from "@/gameState";
import {useViewFilter} from "@/utils/useViewFilter";

const rotateAction = useHorizontalRotateAction();
const simulation = useSimulation();
const miscMenuOpen = ref(false);
const viewFilter = useViewFilter();

const simulationRunning = computed(() => simulation.value.isRunning());
const simulationIconText = computed(() => {
  if (simulationRunning.value) {
    return '>'.repeat(simulation.value.getSpeed());
  } else {
    return '||'
  }
});

const rotateClass = computed(() => {
  const classes = ['iconRow-icon', 'iconRow-toggleRotate'];
  if (rotateAction.autoRotate.value) {
    classes.push('iconRow-buttonOn');
  }

  return classes;
})

const pollutionViewOn = computed(() => viewFilter.pollutionView.value);
const heightMapOn = computed(() => viewFilter.heightMap.value);
const pixelVariationOn = computed(() => viewFilter.pixelVariation.value);

function toggleRotate() {
  rotateAction.toggleAutoRotate();
}

function toggleSpeed(e) {
  if (simulation.value.isRunning()) {
    if (simulation.value.getSpeed() < 2) {
      simulation.value.setSpeed(simulation.value.getSpeed() + 1);
    } else {
      simulation.value.stop();
    }
  } else {
    simulation.value.start();
    simulation.value.setSpeed(simulation.value.speeds.normal);
  }
}

function toggleSuperSpeed() {
  if (!simulation.value.isRunning()) {
    simulation.value.start();
  }

  simulation.value.setSpeed(simulation.value.speeds.bonkers);
}

function togglePollutionView() {
  viewFilter.pollutionView.value = !viewFilter.pollutionView.value;
}

function toggleHeightMap() {
  viewFilter.heightMap.value = !viewFilter.heightMap.value;
}

function togglePixelVariation() {
  viewFilter.pixelVariation.value = !viewFilter.pixelVariation.value;
}

</script>
<template>
  <div class="iconRow">
    <div v-if="miscMenuOpen" class="miscSettings-menu">
      <button @click="toggleRotate">AUTO-ROTATE: {{ rotateAction.autoRotate.value ? 'ON' : 'OFF' }}</button>
      <button @click="togglePollutionView">SHOW POLLUTION: {{ pollutionViewOn ? 'ON' : 'OFF' }}</button>
      <button @click="toggleHeightMap">HEIGHT MAP: {{ heightMapOn ? 'ON' : 'OFF' }}</button>
      <button @click="togglePixelVariation">TILE VARIATION: {{ pixelVariationOn ? 'ON' : 'OFF' }}</button>
    </div>
    <button :class="['iconRow-icon' ,'iconRow-buttonOn', 'iconRow-menu', miscMenuOpen ? 'miscMenu--open' : '']"
            @click="miscMenuOpen = !miscMenuOpen">
      {{ miscMenuOpen ? '___' : '|||' }}
    </button>
    <button :class="['iconRow-icon', simulationRunning ? 'iconRow-buttonOn' : '', 'iconRow-timeToggle']"
            @click.exact="toggleSpeed" @click.shift="toggleSuperSpeed">
      {{ simulationIconText }}
    </button>
  </div>
</template>
<style lang="scss" scoped>

button {
  font-size: 3em;
}

.miscSettings-menu {
  position: absolute;
  top: 100%;
  width: 1px;
  height: 1px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  z-index: 1;

  > button {
    width: 13em;
    height: 2em;
    flex: 0 0 2em;
    background: hsl(0, 0, 26);
    cursor: pointer;
    color: white;

    border: 0;
    outline: 0;
    font-family: "VCR";
    text-align: left;

    &:hover {
      background: hsl(0, 0, 40);
    }
  }
}

.iconRow {
  position: absolute;
  z-index: 1;
  top: 1em;
  left: 1em;

  display: flex;
}

.iconRow {
  > button {
    border: 0;
    outline: 0;
    font-family: "VCR";

    margin-right: .5em;
    cursor: pointer;
    width: 2.6em;
    height: 2em;
    flex: 0 0 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;

    &:hover {
      background: rgba(180, 180, 180, .5);
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.iconRow-buttonOn {
  color: white;
}

.iconRow-icon:not(.iconRow-buttonOn) {
  color: rgb(200, 200, 200);
  background: rgba(120, 120, 120, .5);
}

.iconRow-icon.miscMenu--open {
  background: hsl(0, 0, 26);

  &:hover {
    background: hsl(0, 0, 40);
  }
}
</style>