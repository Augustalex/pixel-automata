<script setup>
import PixelIcon from "@/components/pixel-icon";

const tiles = [
  {
    title: 'grass'
  },
  {
    title: 'farm'
  },
  {
    title: 'zone-city'
  },
  {
    title: 'humidifier'
  },
  {
    title: 'road'
  },
  {
    title: 'dig'
  },
  {
    title: 'raise'
  }
];

</script>

<template>
  <div class="drawer">
    <pixel-icon v-for="tile in tiles" :key="tile.title" :tile="tile"/>
  </div>
</template>

<style scoped>
.drawer {
  margin-right: 45px;
  z-index: 2;
  position: relative;
}
</style>