import {ref} from "vue";

const autoRotate = ref(true);
const move = ref(0);
const stopMove = ref(0);

export function useHorizontalRotateAction() {

    return {
        autoRotate,
        move,
        stopMove,
        rotate,
        toggleAutoRotate,
    };

    function rotate(direction, rotateUntil) {
        move.value = direction;
        stopMove.value = rotateUntil;
    }

    function toggleAutoRotate() {
        autoRotate.value = !autoRotate.value;
    }
}