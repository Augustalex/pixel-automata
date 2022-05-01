import {reactive} from "vue";

const _mousePosition = reactive({x: 0, y: 0});

export const useMousePosition = () => _mousePosition;