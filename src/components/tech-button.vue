<script setup>
import {computed} from "vue";
import {toCssHslColor} from "@/utils/toCssColor";
import {useCursor} from "@/useCursor";
import {useTechTree} from "@/utils/useTechTree";

const cursor = useCursor();
const techTree = useTechTree();

const researchProgressOrNull = computed(() => {
  const research = techTree.ongoingResearch();
  if(!research) return null;

  const progress = research.researchProgress / research.researchTime;
  return Math.round(progress * 100);
});

const css = computed(() => {
  return ({
    background: toCssHslColor([230, 55, 65, 1]),
  });
});

function onClick() {
  techTree.toggle();
}

</script>
<template>
  <div class="icon icon-hoverEffect" @click="onClick">
    <div class="icon-background"/>
    <span v-if="!!researchProgressOrNull" class="icon-text">{{researchProgressOrNull}}%</span>
    <span v-else class="icon-text">TECH</span>
  </div>
</template>
<style lang="scss" scoped>
.icon {
  width: 8em;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .4em;
  color: white;
  margin: 12px 0;
  position: relative;

  opacity: .5;

  transition: opacity .1s ease-out;
}

.icon.icon-hoverEffect {
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
}

.icon-background {
  background: v-bind('css.background');
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.icon-text {
  z-index: 2;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 3px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>