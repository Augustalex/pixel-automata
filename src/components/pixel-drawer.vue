<script setup>
import PixelIcon from "@/components/pixel-icon";
import {computed} from "vue";
import {useGameState} from "@/gameState";
import {useDrawerState} from "@/utils/useDrawerState";

const gameState = useGameState();
const drawerState = useDrawerState();

const tools = computed(() => drawerState.tools.value)
</script>

<template>
  <div class="drawer-container">
    <div class="drawer">
      <span class="drawer-title">TOOLS</span>
      <pixel-icon
          v-for="tile in tools"
          :key="tile.title"
          :tile="tile"
          class="drawer-icon"
          @dragstart.prevent
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drawer-container {
  z-index: 2;
  position: relative;
  overflow: hidden;

  font-size: 1.5em;
}

.drawer-title {
  margin-bottom: .5em;
  display: inline-block;
  user-select: none;
}

.drawer {
  opacity: .4;
  padding: 90px;
  margin: -90px;

  &:hover {
    opacity: 1;
  }

  transition: opacity .2s ease-in;
}

.drawer-icon {
  border: 3px solid white;
  opacity: .6;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  transition: opacity .05s ease-out;
  user-select: none;
}
</style>