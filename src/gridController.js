import {useCursor} from "@/useCursor";
import {fromGrassToCity, fromGrassToHumidifier, transform} from "@/utils/transformers";

export function useGridController() {
    const cursor = useCursor();

    return {
        onTileClicked,
        onCancel
    };

    function onCancel() {
        cursor.setHoldingItem('');
    }

    function onTileClicked(tile) {
        if (cursor.holdingItem) {
            if (tile.surface === 'smooth') {
                if (cursor.holdingItem.value.startsWith('zone-')) {
                    tile.pixelType = 'zone';
                    tile.zoneType = cursor.holdingItem.value.split('-')[1];
                } else {
                    try {
                        transform(tile, cursor.holdingItem.value);
                    } catch (err) {
                        console.error(err);
                    }
                }
                // if (cursor.holdingItem.value === 'farm') {
                //     tile.pixelType = 'farm';
                //     tile.water = 0;
                //     tile.age = undefined;
                //     tile.variation = 0;
                //
                //     cursor.setHoldingItem('');
                // } else if (cursor.holdingItem.value === 'grass') {
                //     tile.variation = 0;
                //
                //     cursor.setHoldingItem('');
                // } else if (cursor.holdingItem.value === 'city') {
                //     fromGrassToCity(tile);
                //
                //     cursor.setHoldingItem('');
                // } else if (cursor.holdingItem.value === 'humidifier') {
                //     fromGrassToHumidifier(tile);
                //
                // }
            }
        }
    }
}