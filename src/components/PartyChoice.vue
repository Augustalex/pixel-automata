<script setup>

import {ref} from "vue";

const hide = ref(false);
const selected = ref('');
const killTimer = ref(null);

function select(party) {
  if(selected.value) return;

  selected.value = party;

  killTimer.value = setTimeout(() => {
    hide.value = true;
  }, 3000);
}

function createClass(party) {
  const classes = ['card'];

  if(hide.value || (selected.value && selected.value !== party)) {
    classes.push('fadeOutBottom')
  }
  else {
    classes.push('fadeInBottom')
  }

  return classes;
}

</script>
<template>
  <div :class="['card-overlay', {'card-overlay--hidden': hide}]">
    <div :class="createClass('martians')" @click="select('martians')">
      <img class="card-background" src="/big_domes.png"/>
      <div class="card-title">
        <span v-for="n in 3" :key="n" :class="`card-title-${n}`">
          MARTIANS
        </span>
      </div>
      <span class="card-description">
        Fast expansion & effective industry
      </span>
    </div>
    <div :class="createClass('unionists')" @click="select('unionists')">
      <img class="card-background" src="/greens_wind_turbine.png"/>
      <div class="card-title">
        <span v-for="n in 3" :key="n" :class="`card-title-${n}`">
          UNIONISTS
        </span>
      </div>
      <span class="card-description">
        Efficient housing & green industry
      </span>
    </div>
  </div>
</template>
<style scoped>
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.card-overlay--hidden {
  pointer-events: none;
}

.card {
  width: 30vw;
  height: 30vw;
  background: rgba(20, 20, 20, .7);
  border: 3px solid rgba(255, 100, 100, .2);
  border-radius: 50%;
  margin: 0 -1vw;
  overflow: hidden;

  position: relative;
  /*top: 50%;*/
  /*left: 50%;*/
  transform: translateY(0);
}

.card:hover {
  z-index:1;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 102%;
}

.card-title {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 5em;
  transform: translate(-50%, -150%);
  pointer-events: none;

  transition: transform 0s ease-in-out;
}

.card:hover .card-title {
  /*transform: translate(-50%, -150%);*/
}

.card-description {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  font-size: 3.5em;
  pointer-events: none;
  transform: translate(-50%, 0%);
  opacity: 0;
  color: white;

  transition: opacity .1s ease-in-out;
}

.card:hover .card-description {
  opacity: 1;
  transform: translate(-50%, 0%);
}

.card-title-1, .card-title-2, .card-title-3 {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 2;
  font-size: inherit;
}

.card-title-1 {
  color: rgba(255,220,220, .9);
}

.card-title-2 {
  top: 1px;
  left: 1px;
  color: rgba(0,0,0, 1);
  z-index: 1;
}

.card-title-3 {
  position: relative;
  top: -1px;
  left: -1px;
  color: rgba(255, 20, 20, .8);
  z-index: 3;
}

.card-background:hover {
  filter: brightness(65%) contrast(1.3) saturate(1.1);
  cursor: pointer;
}

.fadeInBottom {
  animation-duration: 2s;
  animation-delay: 2s;
  animation-fill-mode: both;
  animation-name: fadeInBottom;
}

.fadeOutBottom {
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-name: fadeOutBottom;
}

@keyframes fadeInBottom {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1
  }
}
@keyframes fadeOutBottom {
  from {
    opacity: 1
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>