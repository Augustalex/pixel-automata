import {ref} from "vue";
import {useGlobalSound} from "@/utils/useGlobalSound";

const notifications = ref({});
const listeners = ref([]);

const textsByKey = {
    mars: 'Water flowing on mars for the first time in billions of years!'
};

export function useNotifications() {
    const globalSound = useGlobalSound();

    return {
        waterOnMars,
        onNotification,
        removeNotificationListener,
        textByKey
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
}