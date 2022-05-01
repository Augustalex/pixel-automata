import {useCursor} from "@/useCursor";
import {fromGrassToCity} from "@/utils/transformers";

export function useGridController() {
    const cursor = useCursor();

    return {
        onTileClicked
    }

    function onTileClicked(tile) {
        if (cursor.holdingItem) {
            if (cursor.holdingItem.value === 'farm' && tile.pixelType === 'grass') {
                tile.pixelType = 'farm';
                tile.water = 0;
                tile.age = undefined;
                tile.variation = 0;

                cursor.setHoldingItem('');
            } else if (cursor.holdingItem.value === 'grass' && tile.pixelType === 'grass') {
                tile.variation = 0;

                cursor.setHoldingItem('');
            } else if (cursor.holdingItem.value === 'city' && tile.pixelType === 'grass') {
                fromGrassToCity(tile);

                cursor.setHoldingItem('');
            }
        }
    }
}