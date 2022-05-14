<script setup>
import {useView} from "@/utils/useView";

const view = useView();

import MainMenu from "@/components/MainMenu";
import PlayGame from "@/components/PlayGame";
import {onBeforeUnmount, onMounted, ref} from "vue";

const audio = ref(null);

onMounted(() => {
  window.addEventListener('contextmenu', e => {
    e.preventDefault();
  })
  window.addEventListener('click', playAudioIfPaused);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', playAudioIfPaused);
});

function playAudioIfPaused() {
  const element = audio.value;
  if (element && element.paused) {
    element.play();
  }
}

</script>

<template>
  <audio ref="audio" src="background.mp3" volume="0.2" loop preload/>
  <main-menu v-if="view.current.value === 'menu'"/>
  <play-game v-if="view.current.value === 'game'"/>
</template>
<style>

#app {
  font-size: 80%;
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: VCR;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: white;*/
  color: hsl(11deg 55% 90%)
}

html, body {
  margin: 0;
  padding: 0;
  /*background: #191e24;*/
  background: hsl(11deg 55% 14%);
  /*background: hsl(0, 0, 14%);*/
}
</style>
