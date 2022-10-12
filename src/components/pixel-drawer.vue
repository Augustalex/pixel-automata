<script setup>
import PixelIcon from "@/components/pixel-icon";
import {computed} from "vue";
import {useGameState} from "@/gameState";
import {useDrawerState} from "@/utils/useDrawerState";
import TechButton from "@/components/tech-button";
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";

const gameState = useGameState();
const drawerState = useDrawerState();
const rotateAction = useHorizontalRotateAction();

const tools = computed(() => drawerState.tools.value);

function toggleRotate() {
  rotateAction.toggleAutoRotate();
}
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
      <button :class="['quick-setting', 'icon-hoverEffect', {'quick-setting--on': rotateAction.autoRotate.value}]" @click="toggleRotate">
        ROTATE {{ rotateAction.autoRotate.value ? 'ON' : 'OFF' }}
      </button>
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

button.quick-setting {
  font-size: inherit;
  width: 8em;
  height: 3em;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  background: transparent;
  color: rgba(255,255,255,.5);
  cursor: pointer;
  border: 0;
  outline: 0;
  font-family: "VCR";
  text-align: center;

  &:hover {
    background: hsl(0, 0, 26);
    color: rgba(255,255,255,1);
  }
}

button.quick-setting--on:hover {
    background: hsl(0, 0, 40);
    color: rgba(255,255,255,1);
}
</style>