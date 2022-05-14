<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGameState} from "@/gameState";
import {TileSize, WorldHeight, WorldWidth} from "@/utils/constants";
import {useGridController} from "@/gridController";
import {getTileColor} from "@/utils/tileColor";
import {toCssHslColor} from "@/utils/toCssColor";
import {useGameInputController} from "@/utils/useGameInputController";
import {useViewOffset} from "@/utils/useViewOffset";
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";

const gameState = useGameState();

const running = ref(true);
const canvasRef = ref(null);
const gridController = useGridController();
const gameInput = useGameInputController({target: canvasRef});
const viewOffset = useViewOffset();
const horizontalRotateAction = useHorizontalRotateAction();

const css = computed(() => ({
  width: `${WorldWidth * TileSize}px`,
  height: `${WorldHeight * TileSize}px`
}));

const humidityValue = computed(() => {
  return -Math.min(Math.round((gameState.info.humidity * 1.5) * 200), 200);
});
const ringColor = computed(() => `inset 0 0 40px 20px ${toCssHslColor([23 + humidityValue.value, 90, 90, .5])}`);
const atmosphereColor = computed(() => `inset 0 0 100px 300px ${toCssHslColor([23 + humidityValue.value, 20, 60, .1])}`);
const boxShadow = computed(() => ringColor.value + ', ' + atmosphereColor.value);


onMounted(() => {
  const canvas = canvasRef.value;
  canvas.width = WorldHeight * TileSize;
  canvas.height = WorldHeight * TileSize;

  gameInput.start();

  let lastNow = Date.now();
  const loop = () => {
    if (!running.value) return;

    const viewOffsetX = viewOffset.get().value;


    const now = Date.now();
    const delta = (now - lastNow) / 1000;
    gameInput.update({now, delta});
    viewOffset.update({now, delta});

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const pixel of gameState.pixels) {
      const {x, y} = pixel.position;
      context.fillStyle = colorToCss(color(pixel, gameState.info));
      const newX = Math.round(x * TileSize + viewOffsetX);
      context.fillRect(newX % viewOffset.worldLength() - TileSize, y * TileSize, TileSize, TileSize);
    }

    lastNow = now;

    requestAnimationFrame(loop);
  }

  loop();

  function color(pixel, worldInfo) {
    return darken(diffuse(getTileColor(pixel, worldInfo), 1), ((pixel.height) / 40) + .75);
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

});
onBeforeUnmount(() => {
  gameInput.stop();
  running.value = false;
})
</script>
<template>
  <div class="canvasWrapper">
    <canvas ref="canvasRef" class="canvas"/>
    <div class="canvasOverlay"/>
  </div>
</template>
<style scoped lang="scss">
.canvasWrapper {
  width: calc(v-bind('css.height'));
  height: calc(v-bind('css.height'));
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.canvas {
  width: v-bind('css.height');
  height: v-bind('css.height');
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.canvasOverlay {
  width: calc(v-bind('css.height'));
  height: calc(v-bind('css.height'));
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  border-radius: 50%;
  overflow: hidden;

  box-shadow: v-bind(boxShadow);

  pointer-events: none;
}
</style>