<script setup>
import {computed, ref} from "vue";
import {toCssHslColor} from "@/utils/toCssColor";
import {iconColor} from "@/utils/iconColor";
import {useCursor} from "@/useCursor";
import {useGlobalGameClock} from "@/gameState";

const props = defineProps({tile: Object});
const cursor = useCursor();
const gameClock = useGlobalGameClock();

const progress = ref(1);

const cooldown = computed(() => Math.max(0, Math.min(1, (props.tile.cooldownUntil - gameClock.value) / props.tile.cooldownTime)));

const css = computed(() => {
  return ({
    background: toCssHslColor(iconColor(props.tile)),
    right: `${100 - Math.round((1 - cooldown.value) * 100)}%`,
    opacity: cursor.holdingItem.value === props.tile.title ? 1 : .2,
  });
});

function onClick() {
  cursor.setHoldingItem(props.tile.title);
}

</script>
<template>
  <div class="icon icon-hoverEffect" @click="onClick">
    <div class="icon-background"/>
    <span class="icon-text">{{ props.tile.displayTitle }}</span>
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

  opacity: v-bind('css.opacity');

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