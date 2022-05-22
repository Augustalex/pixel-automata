<script setup>

</script>
<template>
  <div class="marquee">
    <div class="marquee__inner" aria-hidden="true">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.marquee {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
  --offset: 100vw;
  --move-initial: calc(-25% + var(--offset));
  --move-final: calc(-50% + var(--offset));
}

.marquee__inner {
  height: 100%;
  display: flex;
  transform: translate(var(--move-initial), 0);
  animation: marquee 30s linear normal forwards;
  animation-play-state: running;
}

.marquee span {
  font-size: 10vw;
  padding: 0 2vw;
}

@keyframes marquee {
  0% {
    transform: translate(100vw, 0);
  }

  100% {
    transform: translate(-100vw, 0);
  }
}
</style>