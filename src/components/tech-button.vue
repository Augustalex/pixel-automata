<script setup>
import {computed, ref} from "vue";
import {toCssHslColor} from "@/utils/toCssColor";
import {iconColor} from "@/utils/iconColor";
import {useCursor} from "@/useCursor";
import {useGlobalGameClock} from "@/gameState";
import {useTechTree} from "@/utils/useTechTree";

const cursor = useCursor();
const gameClock = useGlobalGameClock();
const techTree = useTechTree();

const progress = ref(1);

const cooldown = computed(() => Math.max(0, Math.min(1, 0)));

const css = computed(() => {
  return ({
    background: toCssHslColor([230, 55, 65, 1]),
    right: `${100 - Math.round((1 - cooldown.value) * 100)}%`,
  });
});

function onClick() {
  techTree.toggle();
}

</script>
<template>
  <div class="icon icon-hoverEffect" @click="onClick">
    <div class="icon-background"/>
    <span class="icon-text">TECH</span>
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
  right: v-bind('css.right');
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