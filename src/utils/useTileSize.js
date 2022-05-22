import {ref} from "vue";
import {useGameState} from "@/gameState";

const _tileSize = ref(calculateTileSize());
const _listeningToResize = ref(false);
const listeners = ref([]);

export function useTileSize() {
    const gameState = useGameState();

    if (!_listeningToResize.value) {
        _listeningToResize.value = true;

        window.addEventListener('resize', e => {
            _tileSize.value = calculateTileSize();
            listeners.value.forEach(l => l(_tileSize.value));

            gameState.worldData.tileSize = _tileSize.value;
        });
    }

    return {
        tileSize: _tileSize,
        onChange,
        removeListener
    };

    function onChange(listener) {
        listeners.value.push(listener);
    }

    function removeListener(listener) {
        listeners.value = listeners.value.filter(l => l !== listener);
    }
}

function calculateTileSize() {
    const standard = 1440;
    const scale = window.innerHeight / standard;

    return Math.round(22 * scale);
}