import {computed, reactive} from "vue";
import {useMousePosition} from "@/useMousePosition";

const _cursorState = reactive({
    holdingItem: ''
});

export function useCursor() {
    const mousePosition = useMousePosition();

    return {
        position: computed(() => ({
            x: mousePosition.x,
            y: mousePosition.y,
        })),
        holdingItem: computed(() => _cursorState.holdingItem),
        setHoldingItem,
    };

    function setHoldingItem(newHoldingItem) {
        _cursorState.holdingItem = newHoldingItem;
    }
}