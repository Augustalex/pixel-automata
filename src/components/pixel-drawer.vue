<script setup>
import PixelIcon from "@/components/pixel-icon";
import {computed} from "vue";
import {useGameState} from "@/gameState";

const gameState = useGameState();

const tiles = computed(() => {
  console.log('reevaluate');
  const canBuildFarm = gameState.info.humidity > .15;
  const canBuildCity = gameState.pixels.some(p => p.pixelType === 'farm');
  const builtFirstCity = gameState.pixels.some(p => p.pixelType === 'city' || p.pixelType === 'zone-city');
  return [
    // {
    //   title: 'grass'
    // },
    {
      title: 'humidifier',
      displayTitle: 'Humidifier'
    },
    canBuildFarm && {
      title: 'farm',
      displayTitle: 'Farm'
    },
    canBuildCity && {
      title: 'road',
      displayTitle: 'Road'
    },
    canBuildCity && {
      title: 'zone-city',
      displayTitle: 'City'
    },
    builtFirstCity && {
      title: 'dig',
      displayTitle: 'Dig'
    },
    builtFirstCity && {
      title: 'raise',
      displayTitle: 'Raise'
    }
  ].filter(i => !!i);
});

</script>

<template>
  <div class="drawer-container">
    <div class="drawer">
      TOOLS
      <pixel-icon v-for="tile in tiles" :key="tile.title" :tile="tile" class="drawer-icon"/>
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
}
</style>