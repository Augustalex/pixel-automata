<script setup>
import {computed} from "vue";
import {toCssHslColor} from "@/utils/toCssColor";
import {iconColor} from "@/utils/iconColor";
import {useCursor} from "@/useCursor";

const props = defineProps({tile: Object});
const cursor = useCursor();

const css = computed(() => ({
  background: toCssHslColor(iconColor(props.tile))
}));

function onClick() {
  cursor.setHoldingItem(props.tile.title);
}

</script>
<template>
  <div class="icon" @click="onClick">
    {{ props.tile.displayTitle }}
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
  background: v-bind('css.background');
  transform: scale(1);
  transition: transform 1s ease-out;
  margin: 12px 0;
}
</style>