<script setup>
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";
import {computed} from "vue";

const rotateAction = useHorizontalRotateAction();

const rotateCss = computed(() => ({
  color: rotateAction.autoRotate.value ? 'white' : 'rgb(160,160,160)'
}));

const rotateClass = computed(() => {
  const classes = ['iconRow-icon', 'iconRow-toggleRotate'];
  if (rotateAction.autoRotate.value) {
    classes.push('iconRow-buttonOn');
  }

  return classes;
})

function toggleRotate() {
  rotateAction.toggleAutoRotate();
}
</script>
<template>
  <div class="iconRow">
    <div class="iconRow-icon iconRow-buttonOn iconRow-menu">
      |||
    </div>
    <div :class="rotateClass" @click="toggleRotate">
      R
    </div>
    <div class="iconRow-icon iconRow-buttonOn iconRow-timeToggle">
      |>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.iconRow {
  position: fixed;
  z-index: 1;
  top: 1em;
  left: 1em;

  display: flex;
}

.iconRow {
  * {
    margin: 0 .5em;
    cursor: pointer;
    width: 2.6em;
    height: 2em;
    flex: 0 0 2em;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: rgba(180, 180, 180, .5);
    }
  }
}

.iconRow-toggleRotate {
  color: v-bind('rotateCss.color');
}

.iconRow-buttonOn {
  color: white;
}

.iconRow-icon:not(.iconRow-buttonOn) {
  color: rgb(200, 200, 200);
  background: rgba(120, 120, 120, .5);
}

</style>