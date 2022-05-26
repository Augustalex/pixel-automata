<script setup>
import {computed} from "vue";

const props = defineProps({tech: Object});

const progress = computed(() => {
  const tech = props.tech;
  console.log('NEW PROGRESS', tech.researchProgress);
  return tech.researchProgress / tech.researchTime;
});

const styles = computed(() => {
  const progressValue = progress.value;
  const heightScale = progressValue * 100;
  const yOffset = (50 - (heightScale / 2));
  console.log(yOffset, heightScale);

  return {
    transform: `translate(0, ${yOffset}%) scale(100%, ${heightScale}%)`
  };
});

</script>
<template>
  <div class="tech-researchBar"
       :style="styles"/>
</template>
<style lang="scss" scoped>
.tech-researchBar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: hsl(120, 100, 70, .5);
}
</style>