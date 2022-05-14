<script setup>
import {useView} from "@/utils/useView";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

const view = useView();

const offsetX = ref(300);
const offsetY = ref(100);
const running = ref(false);

const planetCss = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px)`
}))

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
    <img alt="mars behind sky" class="mars-1" src="/mars_pixel.png"/>
    <img alt="sky filter on top of mars" class="skymask" src="/skymask_pixel.png"/>
    <img alt="slight mars color fill in" class="mars-2" src="/mars_pixel.png"/>
  </div>

  <div class="menu-leftPosition">
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
    <button class="button">*****</button>
  </div>
  <div class="menu-position">
    <button class="button" @click="view.startGame">
      START
    </button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
    <button class="button">/////</button>
  </div>
</template>
<style lang="scss" scoped>

.background-container {
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*width: 762px;*/
  /*height: 762px;*/
  border: 24px solid rgba(245, 163, 147, 0.9);
  height: 100vh;
  width: 100vh;
  box-sizing: border-box;

  & > img {
    position: absolute;
    top: 0;
    left: 0;
  }

  overflow: hidden;
}

.background-a {
  width: 100%;
  height: 100%;
}

.skymask {
  width: 100%;
  height: 100%;
}

.mars-1 {
  width: 100%;
  height: 100%;

  transform: v-bind('planetCss.transform');
}

.mars-2 {
  opacity: .12;
  width: 100%;
  height: 100%;

  transform: v-bind('planetCss.transform');
}

.menu-leftPosition {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  top: 50%;
  left: calc(50% - 50vh);
  transform: translate(-100%, -50%);
  /*width: 762px;*/
  /*height: 762px;*/
  /*border: 24px solid rgba(245, 163, 147, 0.9);*/
  height: 100%;
  box-sizing: border-box;
}

.menu-position {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  top: 50%;
  right: calc(50% - 50vh);
  transform: translate(100%, -50%);
  /*width: 762px;*/
  /*height: 762px;*/
  height: 100%;
  box-sizing: border-box;
}

.button {
  font-family: VCR;
  color: rgba(245, 163, 147, 0.9);
  //color: hsla(0, 0, 147, 0.9);
  background: none;
  border: none;
  font-size: 42px;

  &:hover {
    color: white;
    //color: black;
    //background: hsla(0, 0, 147, 0.9);
    background: rgba(245, 163, 147, 0.9);
  }
}
</style>