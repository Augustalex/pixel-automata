<script setup>
import {computed, ref} from "vue";

const props = defineProps({letters: String});

const delay = ref(`${Math.random() * 3}s`);

const output = computed(() => {
  const r = [];
  for (let i = 0; i < 5 - (props.letters || []).length; i++) {
    r.push('/');
  }

  return r.join('');
});
</script>
<template>
  <span class="row" @mouseover="hover">
    {{ output }}<span class="red-letter">{{ letters }}</span>
  </span>
</template>
<style lang="scss" scoped>
.row {
  cursor: default;
  user-select: none;
  display: block;
  font-family: VCR;
  background: none;
  border: none;
  font-size: 3.2em;
  margin: .1em .2em;
  //color: rgba(245, 163, 147, 0.9);
  color: hsla(0, 0, 147, 0.9);
  padding: 0;

  animation-name: example;
  animation-delay: v-bind(delay);
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-direction: normal;

  &:hover {
    //color: white;
    //color: black;

    //background: rgba(245, 163, 147, 0.9);
    //background: hsla(0, 0, 147, 0.9);
  }
}

@keyframes example {
  0% {
    transform: translateX(0px);
  }

  25% {
    transform: translateX(1px);
  }

  50% {
    transform: translateX(0px);
  }

  75% {
    transform: translateX(-2px);
  }

  100% {
    transform: translateX(0px);
  }
}

.red-letter {
  color: hsl(0deg 55% 55%);

  &:hover {
    color: hsl(0deg 55% 55%);
  }
}
</style>
