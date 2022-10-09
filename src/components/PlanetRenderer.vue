<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGameState} from "@/gameState";
import {WATER_MAX_POLLUTION, WorldHeight, WorldWidth} from "@/utils/constants";
import {useGridController} from "@/gridController";
import {toCssHslColor} from "@/utils/toCssColor";
import {useGameInputController} from "@/utils/useGameInputController";
import {useViewOffset} from "@/utils/useViewOffset";
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";
import {useCursor} from "@/useCursor";
import {useViewFilter} from "@/utils/useViewFilter";
import {useTileColor} from "@/utils/tileColor";
import {useTileSize} from "@/utils/useTileSize";
import {useCanvas} from "@/utils/useCanvas";
import {LayerItems} from "@/utils/transformers";
import {RedPixels} from "@/engine/RedPixels.js";

const gameState = useGameState();

const running = ref(true);
const gridController = useGridController();
const cursor = useCursor();
const canvasRef = useCanvas();
const gameInput = useGameInputController({target: canvasRef});
const viewOffset = useViewOffset();
const horizontalRotateAction = useHorizontalRotateAction();
const viewFilter = useViewFilter();
const {getTileColor} = useTileColor();
const {tileSize} = useTileSize();

const css = computed(() => ({
  width: `${WorldWidth * tileSize.value}px`,
  height: `${WorldHeight * tileSize.value}px`
}));

const humidityValue = computed(() => {
  return -Math.min(Math.round((gameState.info.humidity * 1.5) * 200), 200);
});
const ringColor = computed(() => `inset 0 0 40px 20px ${toCssHslColor([23 + humidityValue.value, 90, 90, .5])}`);
const atmosphereColor = computed(() => `inset 0 0 100px 300px ${toCssHslColor([23 + humidityValue.value, 20, 60, .1])}`);
const boxShadow = computed(() => ringColor.value + ', ' + atmosphereColor.value);

onMounted(() => {
  const canvas = canvasRef.value;

  const { renderPixel, startRender } = RedPixels({canvas});

  gameInput.start();

  let lastNow = Date.now();
  const loop = () => {
    if (!running.value) return;

    const viewOffsetX = viewOffset.get().value;

    const now = Date.now();
    const delta = (now - lastNow) / 1000;
    gameInput.update({now, delta});
    viewOffset.update({now, delta});

    const hoveringTile = cursor.hoveringTile.value;

    // const context = canvas.getContext('2d');
    // context.clearRect(0, 0, canvas.width, canvas.height);
    startRender();

    const showPollution = viewFilter.pollutionView.value;
    const showPipes = cursor.holdingItem.value === 'pipe' || viewFilter.pipeView.value;
    const showTunnels = cursor.holdingItem.value === 'tunnel';

    const hues = new Float32Array(5);
    const saturates = new Float32Array(5);
    const lightnesses = new Float32Array(5);
    const alphas = new Float32Array(5);
    for (const pixel of gameState.pixels) {
      const {x, y} = pixel.position;

      const newX = Math.round(x * tileSize.value + viewOffsetX);

      const tileSizeValue = tileSize.value;
      const py = y * tileSizeValue;
      const px = newX % viewOffset.worldLength() - tileSizeValue;

      const [h1, s1, l1, a1] = lighten(color(pixel, gameState.info), hoveringTile === pixel ? 1.4 : 1);
      // renderPixel(px, py, tileSizeValue, h1, s1, l1, a1);
      hues[0] = h1;
      saturates[0] = s1;
      lightnesses[0] = l1;
      alphas[0] = a1;

      // context.fillStyle = colorToCss(lighten(color(pixel, gameState.info), hoveringTile === pixel ? 1.4 : 1));
      // context.fillRect(px, py, tileSizeValue, tileSizeValue);

      // 1
      hues[1] = 1;
      saturates[1] = 1;
      lightnesses[1] = 1;
      alphas[1] = 1;
      if (showPollution && pixel.pollution) {
        const maxPollution = (pixel.pixelType === 'water' ? WATER_MAX_POLLUTION : 2) * 1.25;
        // renderPixel(px, py, tileSizeValue, 0, 0, 0, .15 + easeInCirc(Math.min(2.5, pixel.pollution.level) / maxPollution) * .8);
        alphas[1] = .15 + easeInCirc(Math.min(2.5, pixel.pollution.level) / maxPollution) * .8;

        // context.fillStyle = `rgba(0,0,0, ${.15 + easeInCirc(Math.min(2.5, pixel.pollution.level) / maxPollution) * .8})`;
        // context.fillRect(px, py, tileSizeValue, tileSizeValue);
      }

      // 2
      hues[2] = 1;
      saturates[2] = 1;
      lightnesses[2] = 1;
      alphas[2] = 1;
      if(pixel.layer2) {
        if(pixel.layer2.item === LayerItems.Tunnel) {
          hues[2] = 240;
          saturates[2] = 37;
          lightnesses[2] = 11;

          if(showTunnels) {
            // renderPixel(px, py, tileSizeValue, 240, 37, 11, .65);
            alphas[2] = .65;
          }
          else {
            alphas[2] = .12;
            // renderPixel(px, py, tileSizeValue, 240, 37, 11, .12);
          }
          // context.fillStyle = showTunnels ? `rgba(17,17,27,0.65)` : `rgba(17,17,27,0.12)`;
          // context.fillRect(px, py, tileSizeValue, tileSizeValue);
        }
      }

      // 3
      hues[3] = 1;
      saturates[3] = 1;
      lightnesses[3] = 1;
      alphas[3] = 1;
      if (pixel.layer1) {
        if (pixel.layer1.item === LayerItems.Pipe) {
          hues[3] = 35;
          saturates[3] = 78;
          lightnesses[3] = 90;

          if(showPipes) {
            // renderPixel(px, py, tileSizeValue, 35, 78, 98, .65);
            alphas[3] = .65;
          }
          else {
            // renderPixel(px, py, tileSizeValue, 35, 78, 98, .12);
            alphas[3] = .12;
          }
          // context.fillStyle = showPipes ? `rgba(249,168,56, .65)` : `rgba(249,168,56, .12)`;
          // context.fillRect(px, py, tileSizeValue, tileSizeValue);
        }

        // 4
        hues[4] = 1;
        saturates[4] = 1;
        lightnesses[4] = 1;
        alphas[4] = 1;
        const pollutionLevel = pixel.layer1.pollutionLevel;
        if (pollutionLevel !== undefined && pollutionLevel > 0) {
          hues[4] = 120;
          saturates[4] = 80;
          lightnesses[4] = 40;
          alphas[4] = .15 + .6 *(pollutionLevel / 10) + .25 * Math.round(pollutionLevel / 100);
          // renderPixel(px, py, tileSizeValue, 120, 80, 40, .15 + .6 *(pollutionLevel / 10) + .25 * Math.round(pollutionLevel / 100));

          // context.fillStyle = `rgba(20, 102, 20, ${.15 + .6 *(pollutionLevel / 10) + .25 * Math.round(pollutionLevel / 100)})`;
          // context.fillRect(px, py, tileSizeValue, tileSizeValue);
        }
      }

      renderPixel(px, py, tileSizeValue, hues, saturates, lightnesses, alphas);
    }

    lastNow = now;

    requestAnimationFrame(loop);
  }

  loop();

  function lighten([h, s, l, a], factor) {
    return [h, Math.min(s, s * (1 + ((factor - 1) / 2))), Math.min(100, l * factor), a];
  }

  function color(pixel, worldInfo) {
    const shadowFactor = viewFilter.heightMap.value ? (((pixel.height) / 10) * .2) + .8 : 1;
    return darken(getTileColor(pixel, worldInfo), shadowFactor);
  }

  function addPollution([h, s, l, a], pixel) {
    if (!pixel.pollution) return [h, s, l, a];
    return [
      h,
      Math.max(0, Math.min(100, s - 50 * pixel.pollution.level)),
      l,
      a
    ]
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

function easeInCirc(x) {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}

function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}
</script>
<template>
  <div class="canvasWrapper">
    <canvas ref="canvasRef" class="canvas"/>
    <div class="canvasOverlay"/>
  </div>
</template>
<style lang="scss" scoped>
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