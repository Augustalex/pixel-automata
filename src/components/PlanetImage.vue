<script setup>
import {useView} from "@/utils/useView";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useMousePosition} from "@/useMousePosition";

const view = useView();
const mousePosition = useMousePosition();

const offsetX = ref(250);
const offsetY = ref(50);
const running = ref(false);

const planetCss = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px)`
}))

const backgroundCss = computed(() => ({
  transform: `translate(${(mousePosition.x - window.innerWidth / 2) * .004}px, ${(mousePosition.y - window.innerHeight / 2) * .001}px) scale(1.01)`
}));

onMounted(() => {
  running.value = true;

  let lastTime = Date.now();
  const loop = () => {
    if (!running.value) return;
    const now = Date.now();
    const delta = (now - lastTime) / 1000;

    offsetX.value -= delta * 4;
    offsetY.value -= delta * (4 - (offsetY.value / 100));

    lastTime = now;
    requestAnimationFrame(loop);
  }
  loop();
});

onBeforeUnmount(() => {
  running.value = false;
})

</script>
<template>
  <div class="background-container">
    <img alt="earth" class="background-a" src="/background_a_pixel.png"/>
    <div alt="mars behind sky" class="mars-1" src="/mars_pixel.png"/>
    <img alt="sky filter on top of mars" class="skymask" src="/skymask_pixel.png"/>
    <div alt="slight mars color fill in" class="mars-2" src="/mars_pixel.png" @click="$emit('click')"/>
  </div>
</template>
<style lang="scss" scoped>
.background-container {
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100vh;
  width: 100vh;
  box-sizing: border-box;
  overflow: hidden;

  & > img {
    position: absolute;
    top: 0;
    left: 0;
  }

  //border: 24px solid rgba(245, 163, 147, 0.9);
  border: 24px solid hsla(0, 0%, 100%, .9);
}

.background-a {
  width: 100%;
  height: 100%;

  transform: v-bind('backgroundCss.transform')
}

.skymask {
  width: 100%;
  height: 100%;
}

div.mars-1 {
  position: absolute;
  left: 70%;
  top: 20%;
  width: 8px;
  height: 8px;
  background: red;

  transform: v-bind('planetCss.transform');
}

div.mars-2 {
  position: absolute;
  left: 70%;
  top: 20%;

  opacity: .2;
  width: 8px;
  height: 8px;
  background: red;

  transform: v-bind('planetCss.transform');
}
</style>