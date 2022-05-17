<script setup>

import {computed, onMounted, ref, watch} from "vue";
import {useNotifications} from "@/utils/useNotifications";
import {useGlobalGameClock} from "@/gameState";

const notifications = useNotifications();
const gameClock = useGlobalGameClock();

const currentNotification = ref(null);

// watch(() => gameClock.value, (current, old) => {
//   if (!currentNotification.value) return;
//   if (current - currentNotification.value.sent > 60 * 1000) {
//     currentNotification.value = null;
//   }
// });
onMounted(() => {
  notifications.onNotification(onNotificationSent)
})

function onNotificationSent(allNotifications) {
  const earliestNotificationKey = Object.keys(allNotifications).sort((ka, kb) => allNotifications[ka] - allNotifications[kb])[0];
  console.log(earliestNotificationKey, allNotifications);
  currentNotification.value = {text: notifications.textByKey(earliestNotificationKey), sent: Date.now()};
}

const messages = ref([]);
</script>
<template>
  <div class="infoBar">
    <marquee v-if="currentNotification" loop="1">{{ currentNotification.text }}</marquee>
  </div>
</template>
<style lang="scss" scoped>
.infoBar {
  width: 100%;
  position: fixed;
  z-index: 3;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1em;
  font-size: 3em;
  background: rgba(0, 0, 0, .5);

  text-transform: uppercase;
}
</style>