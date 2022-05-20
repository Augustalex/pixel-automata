import {computed, reactive, ref} from "vue";
import {useMousePosition} from "@/useMousePosition";

const _cursorState = reactive({
    holdingItem: '',
});

const hoveringTile = ref(null);

export function useCursor() {
    const mousePosition = useMousePosition();

    return {
        position: computed(() => ({
            x: mousePosition.x,
            y: mousePosition.y,
        })),
        holdingItem: computed(() => _cursorState.holdingItem),
        hoveringTile: hoveringTile,
        setHoldingItem,
        setHoveringTile
    };

    function setHoldingItem(newHoldingItem) {
        _cursorState.holdingItem = newHoldingItem;
    }

    function setHoveringTile(tile) {
        hoveringTile.value = tile;
    }
}