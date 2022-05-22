import {onMounted, ref} from "vue";
import {useTileSize} from "@/utils/useTileSize";
import {WorldHeight} from "@/utils/constants";

export function useCanvas() {
    const {tileSize, onChange} = useTileSize();
    const _canvas = ref(null);

    onChange(updateSize);

    onMounted(() => {
        updateSize(tileSize.value);
    });

    return _canvas;

    function updateSize(newTileSize) {
        const canvas = _canvas.value;
        if (!canvas) return;

        canvas.width = WorldHeight * newTileSize;
        canvas.height = WorldHeight * newTileSize;
    }
}