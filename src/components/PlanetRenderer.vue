<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGameState, pixels} from "@/gameState";
import {WATER_MAX_POLLUTION, WorldHeight, WorldWidth} from "@/utils/constants";
import {toCssHslColor} from "@/utils/toCssColor";
import {useGameInputController} from "@/utils/useGameInputController";
import {useViewOffset} from "@/utils/useViewOffset";
import {useCursor} from "@/useCursor";
import {useViewFilter} from "@/utils/useViewFilter";
import {getTileColor} from "@/utils/tileColor";
import {useTileSize} from "@/utils/useTileSize";
import {useCanvas} from "@/utils/useCanvas";
import {LayerItems} from "@/utils/transformers";
import {RedPixels} from "@/engine/RedPixels.js";

const gameState = useGameState();

const running = ref(true);
const cursor = useCursor();
const canvasRef = useCanvas();
const gameInput = useGameInputController({target: canvasRef});
const viewOffset = useViewOffset();
const viewFilter = useViewFilter();
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

  const { startRender, generateVertices, renderPixels } = RedPixels({canvas});

  gameInput.start();

  const float32ByteSize = 4;
  const hslaSize = float32ByteSize * 4;
  const colorsPerPixel = 5;
  const pixelCount = pixels.length;
  const buffer = new ArrayBuffer(hslaSize * colorsPerPixel * pixelCount);
  const colorData = new Float32Array(buffer);

  generateVertices(tileSize.value, WorldWidth, WorldHeight, colorsPerPixel);

  let lastNow = Date.now();
  const loop = () => {
    if (!running.value) return;

    const viewOffsetX = viewOffset.get().value;

    const now = Date.now();
    const delta = (now - lastNow) / 1000;
    gameInput.update({now, delta});
    viewOffset.update({now, delta});

    const hoveringTile = cursor.hoveringTile.value;

    const humidity = gameState.info.humidity;

    startRender();

    const showPollution = viewFilter.pollutionView.value;
    const showPipes = cursor.holdingItem.value === 'pipe' || viewFilter.pipeView.value;
    const showTunnels = cursor.holdingItem.value === 'tunnel';

    const heightMapOn = viewFilter.heightMap.value;
    const variationTurnedOn = viewFilter.pixelVariation.value;

    let index = 0;
    for (const pixel of pixels) {

      const [h1, s1, l1, a1] = lighten(color(pixel, humidity, variationTurnedOn, heightMapOn), hoveringTile === pixel ? 1.4 : 1);
      colorData[index++] = h1;
      colorData[index++] = s1;
      colorData[index++] = l1;
      colorData[index++] = a1;

      // 1
      {
        let h = 0;
        let s = 0;
        let l = 0;
        let a = 0;

        if (showPollution && pixel.pollution) {
          const maxPollution = (pixel.pixelType === 'water' ? WATER_MAX_POLLUTION : 2) * 1.25;
          a = .15 + easeInCirc(Math.min(2.5, pixel.pollution.level) / maxPollution) * .8;
        }

        colorData[index++] = h;
        colorData[index++] = s;
        colorData[index++] = l;
        colorData[index++] = a;
      }

      // 2
      {
        let h = 0;
        let s = 0;
        let l = 0;
        let a = 0;

        if (pixel.layer2) {
          if (pixel.layer2.item === LayerItems.Tunnel) {
            h = 240;
            s = 37;
            l = 11;

            if (showTunnels) {
              a = .65;
            } else {
              a = .12;
            }
          }
        }

        colorData[index++] = h;
        colorData[index++] = s;
        colorData[index++] = l;
        colorData[index++] = a;
      }

      // 3
      {
        let h = 0;
        let s = 0;
        let l = 0;
        let a = 0;

        if (pixel.layer1 && pixel.layer1.item === LayerItems.Pipe) {
          h = 35;
          s = 80;
          l = 62;

          if (showPipes) {
            a = .8;
          } else {
            a = .12;
          }
        }

        colorData[index++] = h;
        colorData[index++] = s;
        colorData[index++] = l;
        colorData[index++] = a;
      }

      // 4
      {
        let h = 0;
        let s = 0;
        let l = 0;
        let a = 0;

        if(pixel.layer1) {
          const pollutionLevel = pixel.layer1.pollutionLevel;
          if (pollutionLevel !== undefined && pollutionLevel > 0) {
            h = 120;
            s = 80;
            l = 40;
            a = .15 + .6 * (pollutionLevel / 10) + .25 * Math.round(pollutionLevel / 100);
          }
        }

        colorData[index++] = h;
        colorData[index++] = s;
        colorData[index++] = l;
        colorData[index++] = a;
      }
    }

    const newX = viewOffsetX;
    const tileSizeValue = tileSize.value;

    renderPixels(colorData, newX, WorldWidth, tileSizeValue);

    lastNow = now;

    requestAnimationFrame(loop);
  }

  loop();

  function lighten([h, s, l, a], factor) {
    return [h, Math.min(s, s * (1 + ((factor - 1) / 2))), Math.min(100, l * factor), a];
  }

  function color(pixel, humidity, variationTurnedOn, heightMapOn) {
    const shadowFactor = heightMapOn ? (((pixel.height) / 10) * .2) + .8 : 1;
    return darken(getTileColor(pixel, humidity, variationTurnedOn, heightMapOn), shadowFactor);
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