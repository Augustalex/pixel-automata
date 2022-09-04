<script setup>
import {useCursor} from "@/useCursor";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGameState} from "@/gameState";
import {LayerItems} from "@/utils/transformers";

const cursor = useCursor();
const gameState = useGameState();

const show = ref(false);

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

onMounted(() => {
  window.addEventListener('contextmenu', onRightClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('contextmenu', onRightClick);
});

function onRightClick() {
  show.value = !show.value;
}

const text = computed(() => {
  const tile = cursor.hoveringTile.value;
  if (!tile) return '';

  const t = [];
  const worldInfo = gameState.info;

  let title = '';
  if (tile.pixelType === 'sand') {
    const isIce = worldInfo.humidity > .1 && tile.height >= 9;
    if (isIce) {
      title = 'Ice';
    } else {
      title = 'Sand';
    }
  } else if (tile.pixelType === 'grass') {
    if (tile.height > 9) {
      title = 'Ice';
    } else {
      title = 'Grass';
    }
  } else if (tile.pixelType === 'water') {
    title = 'Water';
  } else if (tile.pixelType.startsWith('zone')) {
    title = 'City zoning';
  } else if (tile.pixelType === 'city') {
    if (tile.cityLevel === 0) {
      title = 'Housing Pods';
    } else {
      title = 'City Dome';
    }
  } else if (tile.pixelType === 'farm') {
    title = 'Farm';
  } else if (tile.pixelType === 'road') {
    title = 'Road';
  }

  if (title) {
    t.push(`<b>${title}</b>`);

    t.push('Elevation: ' + tile.height);

    if (tile.pollution) {
      t.push('Pollution: ' + (Math.round(tile.pollution.level * 10) / 10));
    }

    if (tile.layer1) {
      if (tile.layer1.item === LayerItems.Pipe) {
        t.push('<br><b>Pipes</b><br>Waste: ' + (Math.round(tile.layer1.pollutionLevel * 10) / 10));
      }
    }
    if (tile.layer2) {
      if (tile.layer2.item === LayerItems.Tunnel) {
        t.push('<br><b>Tunnel</b>');
      }
    }
  }


  return t.join('<br>');
});

</script>
<template>
  <div v-if="show && text" class="pixel-info" v-html="text"/>
</template>
<style scoped>
.pixel-info {
  pointer-events: none;
  position: absolute;
  top: v-bind('position.y');
  left: v-bind('position.x');
  background: rgba(0, 0, 0, .4);
  font-family: sans-serif;
  color: white;
  padding: 4px;
  font-size: 1.2em;
  margin: 6px 0 0 10px;

  text-align: left;
}
</style>