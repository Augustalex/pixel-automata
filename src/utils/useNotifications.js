import {ref} from "vue";
import {useGlobalSound} from "@/utils/useGlobalSound";

const notifications = ref({});
const listeners = ref([]);

const textsByKey = {
    mars: 'Water flowing on mars for the first time in billions of years!',
    mushrooms: 'New mushroom business is shrooming on the surface of Mars.',
    farmable: 'Native Marsian plants soon a reality near water, says a popular interplanetary influencer.',
    settlement: '100 billionaires and 1 famous actor are the first people to settle permanently on Mars.',
    starving: 'People are upset over the lack of food. But there is still plenty of cake.'
};

export function useNotifications() {
    const globalSound = useGlobalSound();

    return {
        waterOnMars,
        farmable,
        marsianMushrooms,
        settlement,
        starving,
        onNotification,
        removeNotificationListener,
        textByKey,
        getNotifications: () => notifications.value
    };

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
        if (notifications.value['mars']) return;

        globalSound.play('/notification.mp3');
        notifications.value = {...notifications.value, 'mars': Date.now()};
        listeners.value.forEach(l => l(notifications.value));
    }

    function farmable() {
        if (notifications.value['farmable']) return;

        globalSound.play('/notification.mp3');
        notifications.value = {...notifications.value, 'farmable': Date.now()};
        listeners.value.forEach(l => l(notifications.value));
    }

    function settlement() {
        if (notifications.value['settlement']) return;

        globalSound.play('/notification.mp3');
        notifications.value = {...notifications.value, 'settlement': Date.now()};
        listeners.value.forEach(l => l(notifications.value));
    }

    function marsianMushrooms() {
        if (notifications.value['mushrooms']) return;

        globalSound.play('/notification.mp3');
        notifications.value = {...notifications.value, 'mushrooms': Date.now()};
        listeners.value.forEach(l => l(notifications.value));
    }

    function starving() {
        if (notifications.value['starving']) return;

        globalSound.play('/notification.mp3');
        notifications.value = {...notifications.value, 'starving': Date.now()};
        listeners.value.forEach(l => l(notifications.value));
    }
}