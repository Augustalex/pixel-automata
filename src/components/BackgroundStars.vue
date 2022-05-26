<script setup>


import {onBeforeUnmount, onMounted, ref} from "vue";

const layers = ref([{
  stars: generateStars(),
  style: {
    left: Math.round(Math.random() * 100),
    top: Math.round(Math.random() * 100)
  },
  direction: 1,
}, {
  stars: generateStars(),
  style: {
    left: Math.round(Math.random() * 100) + 100,
    top: Math.round(Math.random() * 100) + 100
  },
  direction: -1
}, {
  stars: generateStars(),
  style: {
    left: Math.round(Math.random() * 100) + 200,
    top: Math.round(Math.random() * 100) + 200
  },
  direction: 1
}]);
const viewLayers = ref([]);

const interval = ref(null);
const run = ref(0);
onMounted(() => {
  let lastNow = Date.now();
  interval.value = setInterval(() => {
    const newLayers = layers.value; // NOTE: Mutates original data - only made a variable and assigned later for semantics and for allowing Vue to know something was changed

    const now = Date.now();
    const delta = (now - lastNow) / 1000;
    for (let i = 0; i < newLayers.length; i++) {
      const layer = layers.value[i];
      const direction = layer.style.left < 0 || layer.style.left > 4000 ? -layer.direction : layer.direction;
      const diff = direction * 1 * delta;
      layer.style.left += diff;
      // layer.style.top += diff;
    }

    viewLayers.value = run.value % 0 === 0 ? [] : newLayers;
    run.value += 1;
    lastNow = now;
  }, 60);
})

onBeforeUnmount(() => {
  clearInterval(interval.value);
})

function generateStars() {
  const stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      left: `${Math.round(Math.random() * 1000)/ 10}%`,
      top: `${Math.round(Math.random() * 1000) /10}%`,
      height: `${Math.round(Math.random() * .1) + .2}em`,
      width: `${Math.round(Math.random() * .1) + .2}em`,
      transform: `rotate(${Math.round(Math.random() * 360)}deg)`,
      background: `hsl(${Math.round(Math.random() * 120) + 60}deg, ${Math.round(Math.random() * 50) + 10}%,  ${Math.round(Math.random() * 50) + 50}%)`
    })
  }

  return stars;
}
</script>
<template>
  <div class="window">
    <div class="layer" v-for="(layer, index) in viewLayers" :key="index"
         :style="{left: `${layer.style.left}px`, top: `${layer.style.top}px`, transform: `scale(.5 + .${index})`}">
      <div class="star" v-for="(star,index) in layer.stars" :key="index"
           :style="star"/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.window {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: 0;
  pointer-events: none;
}

.layer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
}

.star {
  position: absolute;
}
</style>