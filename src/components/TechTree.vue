<script setup>
import {useTechTree} from "@/utils/useTechTree";
import {computed} from "vue";
import TechResearchBar from "@/components/TechResearchBar";

const techTree = useTechTree();

const visible = computed(() => techTree.visible.value);
const terraTech = computed(() => techTree.terraTech.value);
const Branches = computed(() => techTree.Branches);

function clickTech(branchName, tech) {
  if (!tech.researched && !tech.researching) {
    const branch = techTree.getBranch(branchName).value;
    const techIndex = branch.findIndex(item => item.title === tech.title);
    if (techIndex === 0) {
      techTree.research(branchName, tech.title);
    } else {
      const previousTech = branch[techIndex - 1];
      if (previousTech.researched) {
        techTree.research(branchName, tech.title);
      }
    }
  }
}

</script>
<template>
  <div v-if="visible" class="techTree">
    <div class="techTree-backBackground" @click="techTree.toggle"/>
    <div class="techTree-header">
      TECH TREE
    </div>
    <div class="techTree-background">
      <div class="techTree-row techTree-environment">
        <div v-for="tech in terraTech" :key="tech.title" :class="['tech', tech.researched && 'tech--done', tech.researching && 'tech--researching']"
             @click="clickTech(Branches.Terra, tech)">
          <tech-research-bar v-if="tech.researching" :tech="tech"/>
          <span class="tech-text">
            {{ tech.title }}
          </span>
        </div>
        <div class="techTree-rowHeader">TERRA<span :style="{marginRight: '-.4em'}"/> TECH</div>
      </div>
      <div class="techTree-row techTree-city">
        <div class="tech">
          <span class="tech-text">
          Humidifier
          </span>
        </div>
        <div class="tech">
          <span class="tech-text">
          Humidifier
          </span>
        </div>
        <div class="tech">
          <span class="tech-text">
          Humidifier
          </span>
        </div>
        <div class="techTree-rowHeader">URBAN<span :style="{marginRight: '-.4em'}"/> TECH</div>
      </div>
      <div class="techTree-row techTree-farming">
        <div class="tech">
          <span class="tech-text">
          Humidifier
          </span>
        </div>
        <div class="tech">
          <span class="tech-text">
          Humidifier
          </span>
        </div>
        <div class="tech">
          <span class="tech-text">
          Humidifier
          </span>
        </div>
        <div class="techTree-rowHeader"><span
            :style="{fontSize: '.8em', letterSpacing: '-.1em',verticalAlign: 'bottom'}"><span
            :style="{letterSpacing: '-.18em'}">F</span>AR<span :style="{letterSpacing:'-.18em'}">MI</span>NG</span><span
            :style="{marginRight: '-.4em'}"/> TECH
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
  background: hsl(0, 0, 12, .9);
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
  bottom: -.1em;
  right: .1em;
  font-size: 5em;
  letter-spacing: -.1em;
  z-index: 0;

  color: hsl(0, 0, 0, .25)
}

.tech {
  margin-right: 4em;

  width: 16em;
  height: 16em;
  background: hsl(0, 0, 10, .25);
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  letter-spacing: .15em;

  box-sizing: border-box;

  position: relative;
}

.tech--done + .tech:not(.tech--researching, .tech--done), .tech:first-child {
  background: hsl(0, 0, 10, .5);

  &:hover {
    background: hsl(120, 55, 65, .5);
    cursor: pointer;
  }
}

.tech.tech--done {
  background: hsl(120, 100, 60, .25);
  //background: hsl(0, 0, 10, .9);
  border: 1em solid hsl(120, 100, 60, .5);
}

.tech-text {
  font-size: 2em;

}

.techTree-environment {
  background: hsl(136, 35, 35);
}

.techTree-city {
  background: hsl(244, 8, 35);
}

.techTree-farming {
  background: hsl(60, 35, 35);
}
</style>