<script setup>
import {computed} from "vue";
import {useGridController} from "@/gridController";
import {useCities} from "@/utils/Cities";

const gridController = useGridController();
const cities = useCities();

const props = defineProps({
  pixel: Object
})
const tileSize = 24;

const color = computed(() => diffuse(getColor(), 1));

const title = computed(() => {
  const header = `${capitalize(props.pixel.pixelType)}`;

  if (props.pixel.pixelType === 'city') {
    const cityData = cities.value.get(props.pixel.cityId);
    if (!cityData) {
      return `Village`;
    } else {
      return `${header}\nLevel ${cityData.maxLevel}\nPopulation ${cityData.population}k`;
    }
  }
  return `${header} ${props.pixel.variation} ${props.pixel.temperature || ''}`;
});

const css = computed(() => ({
  size: `${tileSize}px`,
  left: `${props.pixel.position.x * tileSize}px`,
  top: `${props.pixel.position.y * tileSize}px`,
  border: `1px solid ${colorToCss(diffuse(color.value, .5))}`,
  background: colorToCss(color.value)
}));

function capitalize(text) {
  return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
}

function getColor() {
  const variation = props.pixel.variation;
  if (props.pixel.pixelType === 'grass') return [
    applyVariation(120, 0, variation),
    applyVariation(70, 1, variation),
    applyVariation(76, 1, variation),
    1
  ];
  if (props.pixel.pixelType === 'ice') return [
    applyVariation(120, 0, variation),
    applyVariation(10, 2, variation),
    applyVariation(100, .5, variation),
    1
  ];
  if (props.pixel.pixelType === 'dead-grass') return [
    applyVariation(60, 0, variation),
    applyVariation(90, 2, variation),
    applyVariation(80, 1, variation),
    1
  ];
  if (props.pixel.pixelType === 'farm') return [
    applyVariation(60, 0, variation),
    applyVariation(90, 2, variation),
    applyVariation(80, 1, variation),
    1
  ];
  if (props.pixel.pixelType === 'water') {
    const saturationVariation = props.pixel.streamX;
    const lightnessVariation = (props.pixel.streamY + props.pixel.streamX) / 2;
    return [
      applyVariation(190, 0, variation),
      applyVariation(80, 1, 0),
      applyVariation(60, 1, lightnessVariation, 20),
      1
    ];
  }
  if (props.pixel.pixelType === 'city') return [
    applyVariation(190, 0, 0),
    applyVariation(0, 0, 0),
    applyVariation(50, 5, 10 - props.pixel.cityLevel),
    1
  ];
  return [0, 0, 0, 1];
}

function applyVariation(value, degree, variation, MAX_VARIATION = 10) {
  const startColor = Math.max(value - degree * MAX_VARIATION, degree * MAX_VARIATION)

  return startColor + degree * variation;
}

function diffuse([red, green, blue, alpha = 1], factor) {
  return [red, green, blue, alpha * factor];
}

function colorToCss(color) {
  const [hue, saturation, lightness, alpha = 1] = color;
  return `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
}
</script>

<template>
  <div class="tile" :title="title" @click="gridController.onTileClicked(props.pixel)">
  </div>
</template>

<style lang="scss" scoped>
.tile {
  width: v-bind('css.size');
  height: v-bind('css.size');
  box-sizing: border-box;
  border: v-bind('css.border');
  background: v-bind('css.background');

  position: absolute;
  left: v-bind('css.left');
  top: v-bind('css.top');
}
</style>