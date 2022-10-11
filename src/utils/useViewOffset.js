import {ref} from "vue";
import {WorldWidth} from "@/utils/constants";
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";
import {useTileSize} from "@/utils/useTileSize";
import {useMousePosition} from "@/useMousePosition";
import {useCanvas} from "@/utils/useCanvas";

const viewOffset = ref(0);

export function useViewOffset() {
    const rotateAction = useHorizontalRotateAction();
    const {tileSize} = useTileSize();
    const mousePosition = useMousePosition();
    const canvas = useCanvas();

    return {
        get,
        set,
        update
    };

    function get() {
        return viewOffset;
    }

    function set(value) {
        viewOffset.value = value;
    }

    function worldLength() { // Note: Must be used by polling or through a Vue computed function
        return WorldWidth * tileSize.value;
    }

    function update({delta, now}) {
        const move = rotateAction.move.value;
        const stopMove = rotateAction.stopMove.value;

        if (move !== 0) {
            if (now - stopMove > 0) {
                rotateAction.move.value = 0;
            } else {
                const offset = move * 250 * delta;
                const newOffset = (viewOffset.value + offset) % worldLength();
                viewOffset.value = (newOffset < 0 ? worldLength() + newOffset : newOffset);
            }
        } else if (rotateAction.autoRotate.value) {
            viewOffset.value = (viewOffset.value + 16 * delta) % worldLength();
        }
    }
}