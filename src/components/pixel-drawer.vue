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
  <div>
    <pixel-icon v-for="tile in tiles" :key="tile.title" :tile="tile"/>
  </div>
</template>

<style scoped>
</style>