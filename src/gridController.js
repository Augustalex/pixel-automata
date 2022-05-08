import {useCursor} from "@/useCursor";
import {fromGrassToCity, fromGrassToHumidifier, transform} from "@/utils/transformers";

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
                tile.height = Math.max(0, tile.height - 1);
            } else if (tile.surface === 'smooth') {
                if (item.startsWith('zone-')) {
                    tile.pixelType = 'zone';
                    tile.zoneType = item.split('-')[1];
                } else {
                    try {
                        transform(tile, item);
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