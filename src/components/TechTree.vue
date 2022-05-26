<script setup>
import {useTechTree} from "@/utils/useTechTree";
import {computed} from "vue";

const techTree = useTechTree();

const visible = computed(() => techTree.visible.value);

</script>
<template>
  <div v-if="visible" class="techTree">
    <div class="techTree-backBackground"/>
    <div class="techTree-header">
      TECH TREE
    </div>
    <div class="techTree-background">
      <div class="techTree-row techTree-environment">
        <div class="techTree-rowHeader">TERRA<span :style="{marginRight: '-.4em'}"/> TECH</div>
        <div class="tech">
          Humidifier
        </div>
        <div class="tech">
          Humidifier II
        </div>
        <div class="tech">
          Humidifier III
        </div>
      </div>
      <div class="techTree-row techTree-city">
        <div class="techTree-rowHeader">URBAN<span :style="{marginRight: '-.4em'}"/> TECH</div>
        <div class="tech">
          City
        </div>
        <div class="tech">
          City II
        </div>
        <div class="tech">
          City III
        </div>
      </div>
      <div class="techTree-row techTree-farming">
        <div class="techTree-rowHeader"><span :style="{fontSize: '.8em', letterSpacing: '-.1em',verticalAlign: 'top'}"><span :style="{letterSpacing: '-.18em'}">F</span>AR<span :style="{letterSpacing:'-.18em'}">MI</span>NG</span><span :style="{marginRight: '-.4em'}"/> TECH</div>
        <div class="tech">
          Farm
        </div>
        <div class="tech">
          Farm II
        </div>
        <div class="tech">
          Farm III
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.techTree {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 2;
}

.techTree-backBackground {
  background: hsl(0, 0, 20, .6);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}

.techTree-header {
  font-size: 6em;
  margin: .5em 0 0 0;
  z-index: 1;
}

.techTree-background {
  background: hsl(230, 10, 35, .95);
  width: 120em;
  height: 80em;
  margin-top: 2em;
  z-index: 1;
}

.techTree-row {
  display: flex;
  align-items: center;
  height: calc(100% / 3);
  padding: 4em 4em;
  box-sizing: border-box;
  position: relative;
}

.techTree-rowHeader {
  position: absolute;
  top: -.1em;
  left: 0;
  font-size: 26em;
  letter-spacing: -.1em;
  z-index: 0;
}

.tech {
  margin-right: 4em;

  width: 16em;
  height: 16em;
  background: hsl(0, 0, 10, .99);
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  z-index: 1;
}

.techTree-environment {
  background: hsl(136, 35, 25);
}

.techTree-city {
  background: hsl(244, 8, 25);
}

.techTree-farming {
  background: hsl(60, 35, 25);
}
</style>