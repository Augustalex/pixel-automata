import {useCursor} from "@/useCursor";
import {transform} from "@/utils/transformers";

export function useGridController() {
    const cursor = useCursor();

    const lastTileMouseDown = null;

    return {
        onTileClicked,
        onCancel
    };

    function onCancel(tile) {
        if (tile.pixelType === 'road') {
            transform(tile, tile.roadSurface);
        } else {
            cursor.setHoldingItem('');
        }
    }

    function onTileClicked(tile) {
        if (!!lastTileMouseDown && lastTileMouseDown === tile) return;

        if (cursor.holdingItem) {
            const item = cursor.holdingItem.value;
            if (item === 'raise') {
                tile.height = Math.min(10, tile.height + 1);
            } else if (item === 'dig') {
                tile.height = Math.max(1, tile.height - 1);
            } else if (tile.surface === 'smooth') {
                try {
                    transform(tile, item);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
}