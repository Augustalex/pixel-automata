<script setup>
import {useCursor} from "@/useCursor";
import {computed} from "vue";
import {toCssHslColor} from "@/utils/toCssColor";
import {iconColor} from "@/utils/iconColor";

const cursor = useCursor();

const cursorCss = computed(() => ({
  left: `${cursor.position.value.x}px`,
  top: `${cursor.position.value.y}px`,
}));

const cursorItem = computed(() => ({
  background: cursor.holdingItem.value ? toCssHslColor(iconColor({title: cursor.holdingItem.value})) : 'transparent'
}));
</script>
<template>
  <div class="cursor-container">
    <div class="cursor"/>
    <div class="cursor-item"/>
  </div>
</template>
<!--<style lang="scss" scoped>-->
<!--.cursor {-->
<!--  position: absolute;-->
<!--  background-image: url('../assets/cursor.png');-->
<!--  background-size: contain;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  z-index: 2;-->

<!--  pointer-events: none;-->
<!--}-->

<!--.cursor-container {-->
<!--  position: fixed;-->
<!--  width: 20px;-->
<!--  height: 20px;-->
<!--  left: v-bind('cursorCss.left');-->
<!--  top: v-bind('cursorCss.top');-->
<!--  transform: translate(-50%, -50%) translate(5px, 10px);-->
<!--  z-index: 1;-->

<!--  pointer-events: none;-->
<!--}-->

<!--.cursor-item {-->
<!--  position: absolute;-->
<!--  background: v-bind('cursorItem.background');-->
<!--  width: 10px;-->
<!--  height: 10px;-->
<!--  z-index: 1;-->

<!--  transform: translate(-50%, -50%);-->
<!--  left: calc(50% - 6px);-->
<!--  top: calc(50% - 12px);-->

<!--  pointer-events: none;-->
<!--}-->
<!--</style>-->
<!--<style>-->
<!--* {-->
<!--  cursor: none;-->
<!--}-->
<!--</style>-->