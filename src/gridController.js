import {useCursor} from "@/useCursor";
import {transform} from "@/utils/transformers";
import {useGameState} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";

export function useGridController() {
    const cursor = useCursor();
    const gameState = useGameState();
    const view = PixelDataView();

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

                const waterLevel = Math.round(gameState.info.humidity * 10) - 1;

                if (tile.height > waterLevel) {
                    const nearbyGrass = view.getNeighbours(tile, 3, p => p.pixelType === 'grass');
                    transform(tile, nearbyGrass.length > 0 ? 'grass' : 'sand')
                }
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