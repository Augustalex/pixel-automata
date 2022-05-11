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
  width: 6em;
  height: 6em;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .4em;
  font-family: "Comic Sans MS";
  color: white;
  background: v-bind('css.background')
}
</style>