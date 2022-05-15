import {reactive, ref} from "vue";

const _init = ref(false);
const _mousePosition = reactive({x: 0, y: 0});

export const useMousePosition = () => {
    if (!_init.value) {
        _init.value = true;
        window.addEventListener('mousemove', e => {
            _mousePosition.x = e.clientX;
            _mousePosition.y = e.clientY;
        });
    }

    return _mousePosition;
}