import {ref} from "vue";

const _techTreeVisible = ref(false);

export function useTechTree() {
    return {
        visible: _techTreeVisible,
        toggle,
        show,
        hide
    };

    function toggle() {
        if (_techTreeVisible.value) {
            hide();
        } else {
            show();
        }
    }

    function show() {
        _techTreeVisible.value = true;
    }

    function hide() {
        _techTreeVisible.value = false;
    }
}