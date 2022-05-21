import {ref} from "vue";
import {TileSize, WorldWidth} from "@/utils/constants";
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";

const viewOffset = ref(0);

export function useViewOffset() {
    const rotateAction = useHorizontalRotateAction();

    return {
        get,
        set,
        worldLength,
        update
    };

    function get() {
        return viewOffset;
    }

    function set(value) {
        viewOffset.value = value;
    }

    function worldLength() {
        return WorldWidth * TileSize;
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
            viewOffset.value = (viewOffset.value + (10 * delta)) % worldLength();
        }
    }
}