<script setup>
import PixelIcon from "@/components/pixel-icon";
import {computed} from "vue";
import {useGameState} from "@/gameState";
import {useDrawerState} from "@/utils/useDrawerState";
import TechButton from "@/components/tech-button";

const gameState = useGameState();
const drawerState = useDrawerState();

const tools = computed(() => drawerState.tools.value)
</script>

<template>
  <div class="drawer-container">
    <div class="drawer">
      <span class="drawer-title">TOOLS</span>
      <tech-button />
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
  padding: 90px;
  margin: -90px;

}

.drawer-icon {
  user-select: none;
}
</style>