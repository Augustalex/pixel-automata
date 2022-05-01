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
    title: 'city'
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