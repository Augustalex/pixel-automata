<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGameState} from "@/gameState";
import {WorldHeight, WorldWidth} from "@/utils/constants";
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
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    const showPollution = viewFilter.pollutionView.value;
    const showPipes = cursor.holdingItem.value === 'pipe' || viewFilter.pipeView.value;

    for (const pixel of gameState.pixels) {
      const {x, y} = pixel.position;

      const newX = Math.round(x * tileSize.value + viewOffsetX);

      const py = y * tileSize.value;
      const px = newX % viewOffset.worldLength() - tileSize.value;

      context.fillStyle = colorToCss(lighten(color(pixel, gameState.info), hoveringTile === pixel ? 1.4 : 1));
      context.fillRect(px, py, tileSize.value, tileSize.value);

      if (showPollution && pixel.pollution) {
        context.fillStyle = `rgba(0,0,0, ${.15 + easeInCirc(Math.min(2.5, pixel.pollution.level) / 2.5) * .8})`;
        context.fillRect(px, py, tileSize.value, tileSize.value);
      }

      if (pixel.layer1) {
        if (pixel.layer1.item === LayerItems.Pipe) {
          context.fillStyle = showPipes ? `rgba(249,168,56, .65)` : `rgba(249,168,56, .12)`;
          context.fillRect(px, py, tileSize.value, tileSize.value);
        }

        const pollutionLevel = pixel.layer1.pollutionLevel;
        if (pollutionLevel !== undefined && pollutionLevel > 0) {
          if(pixel.pixelType === 'water') console.log('water', pollutionLevel);
          context.fillStyle = `rgba(20, 102, 20, ${.15 + .6 *(pollutionLevel / 10) + .25 * Math.round(pollutionLevel / 100)})`;
          context.fillRect(px, py, tileSize.value, tileSize.value);
        }
      }
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