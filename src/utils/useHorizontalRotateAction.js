import {ref} from "vue";

const move = ref(0);
const stopMove = ref(0);

export function useHorizontalRotateAction() {

    return {
        move,
        stopMove,
        rotate
    };

    function rotate(direction, rotateUntil) {
        move.value = direction;
        stopMove.value = rotateUntil;
    }
}