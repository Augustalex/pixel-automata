import {ref} from "vue";
import {useGlobalSound} from "@/utils/useGlobalSound";

const notifications = ref({});
const listeners = ref([]);
const lastPlayed = ref(0);
const notificationQueue = ref([]);
const loopStarted = ref(false)

const textsByKey = {
    waterOnMars: 'Water flowing on mars for the first time in billions of years!',
    marsianMushrooms: 'New mushroom business is shrooming on the surface of Mars.',
    farmable: 'Native Marsian plants soon a reality near water, says a popular interplanetary influencer.',
    settlement: '100 billionaires and 1 famous actor are the first people to settle permanently on Mars.',
    starving: 'People are upset over the lack of food. But there is still plenty of cake.',
    pollutionRising: 'Rapid expansion of air-conditioned luxury habitats sees alarming increase in global pollution levels.',
    warningPollution: 'Scientists warns of the combustible nature of some pollutants filling the air.',
    catastrophicPollution: 'Young people - not even old enough to drink - fill the streets to protest against the catastrophic levels of pollution.',
    hellToCome: 'Cultists preach "hell to come" as many predict the polluted atmosphere will catch fire in a not too distant future.',
    hellFire: 'All communication with Mars lost as planet turns into a fire hell scape.'
};

export function useNotifications() {
    const globalSound = useGlobalSound();

    if (!loopStarted.value) {
        loopStarted.value = true;
        queueLoop();
    }

    return {
        waterOnMars,
        farmable,
        marsianMushrooms,
        settlement,
        starving,
        pollutionRising,
        warningPollution,
        catastrophicPollution,
        hellToCome,
        hellFire,
        onNotification,
        removeNotificationListener,
        textByKey,
        getNotifications: () => notifications.value
    };

    function queueLoop() {
        const loop = () => {
            const queue = notificationQueue.value;

            if (queue.length > 0) {
                const next = queue.shift();
                notificationTemplate(next);

                notificationQueue.value = queue;
            }

            setTimeout(loop, 5000);
        }
    }

    function textByKey(key) {
        return textsByKey[key];
    }

    function onNotification(callback) {
        listeners.value = [...listeners.value, callback];
    }

    function removeNotificationListener(callback) {
        listeners.value = listeners.value.filter(l => l !== callback);
    }

    function waterOnMars() {
        notificationTemplate('waterOnMars');
    }

    function farmable() {
        notificationTemplate('farmable')
    }

    function settlement() {
        notificationTemplate('settlement');
    }

    function marsianMushrooms() {
        notificationTemplate('marsianMushrooms');
    }

    function starving() {
        notificationTemplate('starving');
    }

    function pollutionRising() {
        notificationTemplate('pollutionRising');
    }

    function warningPollution() {
        notificationTemplate('warningPollution');
    }

    function catastrophicPollution() {
        notificationTemplate('catastrophicPollution');
    }

    function hellToCome() {
        notificationTemplate('hellToCome');
    }

    function hellFire() {
        notificationTemplate('hellFire');
    }

    function notificationTemplate(key) {
        const timeSinceLastPlayedNotification = Date.now() - lastPlayed.value;
        if (timeSinceLastPlayedNotification > 10 * 1000) {
            lastPlayed.value = Date.now();
            if (notifications.value[key]) return;

            globalSound.play('notification.mp3');
            notifications.value = {...notifications.value, [key]: Date.now()};
            listeners.value.forEach(l => l(notifications.value));
        } else {
            const queue = notificationQueue.value;
            queue.push(key);
            notificationQueue.value = queue;
        }
    }
}