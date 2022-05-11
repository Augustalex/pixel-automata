<script setup>
import PixelIcon from "@/components/pixel-icon";

const tiles = [
  // {
  //   title: 'grass'
  // },
  {
    title: 'humidifier',
    displayTitle: 'Humidifier'
  },
  {
    title: 'farm',
    displayTitle: 'Farm'
  },
  {
    title: 'road',
    displayTitle: 'Road'
  },
  {
    title: 'zone-city',
    displayTitle: 'City'
  },
  {
    title: 'dig',
    displayTitle: 'Dig'
  },
  {
    title: 'raise',
    displayTitle: 'Raise'
  }
];

</script>

<template>
  <div class="drawer-container">
    <div class="drawer">
      <pixel-icon v-for="tile in tiles" :key="tile.title" :tile="tile" class="drawer-icon"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawer-container {
  z-index: 2;
  position: relative;
  overflow: hidden;
}

.drawer {
  opacity: .05;
  padding: 90px;
  margin: -90px;

  &:hover {
    opacity: 1;
  }

  transition: opacity .2s ease-in;
}

.drawer-icon {
  opacity: .6;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  transition: opacity .05s ease-out;
}
</style>