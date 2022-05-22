<script setup>

import {onMounted, ref, watch} from "vue";
import {useNotifications} from "@/utils/useNotifications";
import MarqueeBar from "@/components/MarqueeBar";
import {useGlobalGameClock} from "@/gameState";

const notifications = useNotifications();
const gameClock = useGlobalGameClock();

const messages = ref([]);
const currentNotification = ref(null);
//
// const css = computed(() => {
//   if (!currentNotification.value) return {paddingRight: 0};
//   const timePassed = (gameClock.value - currentNotification.value.sent);
//   return {
//     paddingRight: -(currentNotification.value.text.length * 20) + timePassed / 10
//   }
// });

watch(() => gameClock.value, (current, old) => {
  if (messages.value.length === 0) return;
  messages.value = messages.value.filter(m => {
    return current - m.sent <= 5 * 60 * 1000;
  });
});

onMounted(() => {
  notifications.onNotification(onNotificationSent);
});

function onNotificationSent(allNotifications) {
  const earliestNotificationKey = Object.keys(allNotifications).sort((ka, kb) => allNotifications[kb] - allNotifications[ka])[0];
  messages.value.unshift({text: notifications.textByKey(earliestNotificationKey), sent: gameClock.value});
}

</script>
<template>
  <div v-if="messages.length > 0" class="infoBar">
    <marquee-bar v-for="message in messages.filter((k, i) => i === 0)" :key="message.sent">
      <span>{{
          message.text
        }}</span>
    </marquee-bar>
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