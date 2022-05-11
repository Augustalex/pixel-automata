import {computed, ref} from "vue";

const currentView = ref('menu');

export function useView() {
    return {
        startGame,
        current: computed(() => currentView.value)
    };

    function startGame() {
        currentView.value = 'game';
    }
}