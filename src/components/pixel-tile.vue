<script setup>
import {computed} from "vue";
import {useGridController} from "@/gridController";
import {useCities} from "@/utils/Cities";
import {getTileColor} from "@/utils/tileColor";

const gridController = useGridController();
const cities = useCities();

const props = defineProps({
  pixel: Object
})
const tileSize = 24; // Keep in sync with gameState tileSize constant

const color = computed(() => darken(diffuse(getTileColor(props.pixel), 1), ((props.pixel.height) / 40) + .75));

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
  size: `${tileSize}px`,
  left: `${props.pixel.position.x * tileSize}px`,
  top: `${props.pixel.position.y * tileSize}px`,
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
</script>

<template>
  <div class="tile" :title="title" @click="gridController.onTileClicked(props.pixel)"
       @click.right.prevent="gridController.onCancel">
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