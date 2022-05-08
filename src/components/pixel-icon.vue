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
  </div>
</template>
<style lang="scss" scoped>
.icon {
  width: 42px;
  height: 42px;
  background: v-bind('css.background')
}
</style>