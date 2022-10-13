<script setup>
import {useCursor} from "@/useCursor";
import {computed, onMounted, ref, watch} from "vue";
import {useGameState, useGlobalGameClock} from "@/gameState";
import {useDrawerState} from "@/utils/useDrawerState";
import {toCssHslColor} from "@/utils/toCssColor";
import {iconColor} from "@/utils/iconColor";

const cursor = useCursor();
const gameState = useGameState();
const drawerState = useDrawerState();
const gameClock = useGlobalGameClock();

const canvas = ref(null);

const position = computed(() => {
  const tile = cursor.hoveringTile.value;
  if (tile) {
    return {
      x: `${cursor.position.value.x}px`,
      y: `${cursor.position.value.y}px`
    }
  }

  return {
    x: `-1000px`,
    y: `-1000px`
  }
});

const startTime = ref(0);

const toolColor = computed(() => {
  const itemTitle = cursor.holdingItem.value;
  if(!itemTitle) return 'white';

  return toCssHslColor(iconColor({title: itemTitle}));
});

const progress = computed(() => {
  if(!cursor.holdingItem.value) return -1;
  const currentToolInfo = drawerState.toolInfo(cursor.holdingItem.value);
  if(!currentToolInfo) return -1;
  if(currentToolInfo.cooldownTime < .5) return -1;

  const timeSpent = (currentToolInfo.cooldownTime - (currentToolInfo.cooldownUntil - gameClock.value));
  if(timeSpent > currentToolInfo.cooldownTime + .5) return -1;

  return Math.min(1, timeSpent / currentToolInfo.cooldownTime);
});

const text = computed(() => {
  const progressValue = progress.value;
  if(progressValue < 0) return '';

  return `${Math.round(progressValue * 100)}%`;
});

watch(() => text.value, (current,old) => {
  if(!!current && startTime.value === 0) {
    startTime.value = Date.now();
  }
  else if(!current) {
    startTime.value = 0;
  }
});

onMounted(() => {
  const canvasValue = canvas.value;
  canvasValue.width = 120;
  canvasValue.height = 120;

  const loop = () => {
    const context = canvasValue.getContext('2d');
    context.clearRect(0,0,canvasValue.width, canvasValue.height);

    if(startTime.value > 0) {
      const centerX = canvasValue.width / 2;
      const centerY = canvasValue.height / 2;
      const radius = canvasValue.width * .4;
      const startAngle = Math.PI + Math.PI * .5;
      const endAngle = startAngle + (Math.PI * 2) * progress.value;

      context.beginPath();
      context.arc(centerX, centerY, radius, startAngle, endAngle, false);
      context.lineWidth = 20;
      context.strokeStyle = toolColor.value;
      context.stroke();
    }

    requestAnimationFrame(loop);
  };
  loop();
});

</script>
<template>
  <div class="pixel-info">
    <canvas ref="canvas" id="pixel-info-canvas"></canvas>
  </div>
</template>
<style scoped>
.pixel-info {
  pointer-events: none;
  position: absolute;
  top: v-bind('position.y');
  left: v-bind('position.x');
  width: 0;
  height: 0;
}

#pixel-info-canvas {
  width: 34px;
  height: 34px;

  transform: translate(-50%, -50%);
  position: absolute;
  top: calc(50% + 8px);
  left: calc(50% + 3px);
}
</style>