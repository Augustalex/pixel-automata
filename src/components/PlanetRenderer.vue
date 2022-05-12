<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGameState} from "@/gameState";
import {TileSize, WorldHeight, WorldWidth} from "@/utils/constants";
import {useGridController} from "@/gridController";
import {useCities} from "@/utils/Cities";
import {getTileColor} from "@/utils/tileColor";
import {toCssHslColor} from "@/utils/toCssColor";

const gameState = useGameState();

const running = ref(true);

const canvasRef = ref(null);
const gridController = useGridController();
const cities = useCities();

const tileSize = TileSize;
const worldLength = WorldWidth * tileSize;

// const css = computed(() => ({
//   size: `${tileSize}px`,
//   left: `${(props.pixel.position.x * tileSize + props.offsetX) % worldLength}px`,
//   top: `${props.pixel.position.y * tileSize}px`,
//   border: `1px solid ${colorToCss(diffuse(color.value, .5))}`,
//   background: colorToCss(color.value)
// }));

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

let lastX = ref(0);
let lastY = ref(0);
let lastTile = ref(null);
let viewOffsetX = ref(0);

onMounted(() => {
  const canvas = canvasRef.value;
  canvas.width = WorldHeight * TileSize;
  canvas.height = WorldHeight * TileSize;

  let move = 0;
  let stopMove = 0;

  let keysDown = new Set();

  canvas.addEventListener('mousemove', (e) => {
    // if (e.buttons !== 1) return;
    // vx = round(x * size + offset) % worldHeight - TileSize
    // x = vx + TileSize + round(

    const preX = e.offsetX - viewOffsetX.value;
    const postX = preX < 0 ? worldLength + preX : preX;
    const newX = Math.ceil((postX) / TileSize);
    const offsetX = newX;
    const offsetY = Math.floor(e.offsetY / TileSize);

    if (offsetX !== lastX.value || offsetY !== lastY.value) {
      const tileAtPosition = gameState.pixels.find(p => {
        return p.position.x === offsetX && p.position.y === offsetY;
      });
      lastTile.value = tileAtPosition;
    }

    lastX.value = offsetX;
    lastY.value = offsetY;

    if (e.buttons === 1) {
      gridController.onTileClicked(lastTile.value);
    } else if (e.buttons === 2) {
      move = e.movementX > 0 ? 1 : -1;
      stopMove = Date.now() + 250;
    }
  });

  window.addEventListener('keydown', e => {
    keysDown.add(e.key);
  });
  window.addEventListener('keyup', e => {
    keysDown.delete(e.key);
  })

  canvas.addEventListener('mousedown', (e) => {
    if (e.buttons === 1 && lastTile.value) {
      gridController.onTileClicked(lastTile.value);
    }
  });

  let lastNow = Date.now();
  const loop = () => {
    if (!running.value) return;

    const now = Date.now();
    const delta = (now - lastNow) / 1000;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const pixel of gameState.pixels) {
      const {x, y} = pixel.position;
      console.log(gameState)
      context.fillStyle = colorToCss(color(pixel, gameState.info));
      const newX = Math.round(x * TileSize + viewOffsetX.value);
      context.fillRect(newX % worldLength - TileSize, y * TileSize, TileSize, TileSize);
    }

    if (['ArrowLeft', 'a', 'A'].some(k => keysDown.has(k))) {
      move = 1;
      stopMove = now + 250;
    } else if (['ArrowRight', 'd', 'Da'].some(k => keysDown.has(k))) {
      move = -1;
      stopMove = now + 250;
    }

    if (move !== 0) {
      if (now - stopMove > 0) {
        move = 0;
      } else {
        const offset = move * 250 * delta;
        const newOffset = (viewOffsetX.value + offset) % worldLength;
        viewOffsetX.value = newOffset < 0 ? worldLength + newOffset : newOffset;
      }
    } else {
      viewOffsetX.value = (viewOffsetX.value + (10 * delta)) % worldLength;
    }

    lastNow = now;

    requestAnimationFrame(loop);
  }

  loop();

  function color(pixel, worldInfo) {
    return darken(diffuse(getTileColor(pixel, worldInfo), 1), ((pixel.height) / 40) + .75);
  }

  const title = (pixel) => {
    const header = `${capitalize(pixel.pixelType)}`;

    if (pixel.pixelType === 'city') {
      const cityData = cities.value.get(pixel.cityId);
      if (!cityData) {
        return `Village`;
      } else {
        return `${header}\nLevel ${cityData.maxLevel}\nPopulation ${cityData.population}k`;
      }
    }
    return `${header} ${pixel.height} ${pixel.temperature || ''}`;
  };

  function capitalize(text) {
    return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
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