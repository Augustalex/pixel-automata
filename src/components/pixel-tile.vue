<script setup>
import {computed} from "vue";
import {useGridController} from "@/gridController";
import {useCities} from "@/utils/Cities";
import {WorldWidth} from "@/utils/constants";
import {useTileColor} from "@/utils/tileColor";
import {useTileSize} from "@/utils/useTileSize";

const gridController = useGridController();
const cities = useCities();
const {getTileColor} = useTileColor();
const {tileSize} = useTileSize();
const worldLength = computed(() => WorldWidth * tileSize.value);

const props = defineProps({
  pixel: Object,
  offsetX: Number
})

const color = computed(() => darken(diffuse(getTileColor(props.pixel, {humidity: 0}), 1), ((props.pixel.height) / 40) + .75));

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
  return `${header} ${props.pixel.height} ${props.pixel.temperature || ''}`;
});

const css = computed(() => ({
  size: `${tileSize.value}px`,
  left: `${(props.pixel.position.x * tileSize.value + props.offsetX) % worldLength.value}px`,
  top: `${props.pixel.position.y * tileSize.value}px`,
  border: `1px solid ${colorToCss(diffuse(color.value, .5))}`,
  background: colorToCss(color.value)
}));

function capitalize(text) {
  return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
}

function applyVariation(value, degree, variation, MAX_VARIATION = 10) {
  const startColor = Math.max(value - degree * MAX_VARIATION, degree * MAX_VARIATION)

  return startColor + degree * variation;
}

function diffuse([red, green, blue, alpha = 1], factor) {
  return [red, green, blue, alpha * factor];
}

function darken([hue, saturation, lightness, alpha = 1], factor) {
  return [hue, saturation, lightness * factor, alpha];
}

function colorToCss(color) {
  const [hue, saturation, lightness, alpha = 1] = color;
  return `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
}

function onMouseOver(event) {
  if (event.buttons === 1) {
    gridController.onTileClicked(props.pixel);
  }
}
</script>

<template>
  <div v-if="props.pixel.pixelType === 'space'" class="tile tile--space"/>
  <div v-else class="tile" :title="title" @mouseover="onMouseOver"
       @mousedown="gridController.onTileClicked(props.pixel)"
       @click.right.prevent="gridController.onCancel(props.pixel)">
  </div>
</template>

<style scoped>
.tile {
  width: v-bind('css.size');
  height: v-bind('css.size');
  box-sizing: border-box;
  border: v-bind('css.border');
  background: v-bind('css.background');

  position: absolute;
  left: v-bind('css.left');
  top: v-bind('css.top');
  user-select: none;
}

.tile--space {
  background: transparent;
  border: none;
}
</style>