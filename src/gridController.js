import {useCursor} from "@/useCursor";
import {getTransformer} from "@/utils/transformers";
import {useGameState} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";
import {useDrawerState} from "@/utils/useDrawerState";

export function useGridController() {
    const cursor = useCursor();
    const gameState = useGameState();
    const view = PixelDataView();
    const drawerState = useDrawerState();

    const lastTileMouseDown = null;

    return {
        onTileClicked,
        onCancel
    };

    function onCancel(tile) {
        if (tile.pixelType === 'road') {
            getTransformer(tile, tile.roadSurface)?.(tile);
        } else {
            cursor.setHoldingItem('');
        }
    }

    function onTileClicked(tile) {
        if (!!lastTileMouseDown && lastTileMouseDown === tile) return;

        if (cursor.holdingItem) {
            useItemOnTile(tile);
        }
    }

    function useItemOnTile(tile) {
        const item = cursor.holdingItem.value;
        const tileDrawerInfo = drawerState.tools.value.find(t => t.title === item);
        const now = Date.now();
        const cooldown = Math.max(0, Math.min(1, (tileDrawerInfo.cooldownUntil - now) / tileDrawerInfo.cooldownTime));
        if (cooldown > 0) return;

        if (item === 'raise') {
            tile.height = Math.min(10, tile.height + 1);

            const waterLevel = Math.round(gameState.info.humidity * 10) - 1;

            if (tile.height > waterLevel) {
                const nearbyGrass = view.getNeighbours(tile, 3, p => p.pixelType === 'grass');
                getTransformer(tile, nearbyGrass.length > 0 ? 'grass' : 'sand')?.(tile);
            }

            drawerState.toolUsed(item);
        } else if (item === 'dig') {
            tile.height = Math.max(1, tile.height - 1);
            drawerState.toolUsed(item);
        } else if (tile.surface === 'smooth') {
            try {
                const transformer = getTransformer(tile, item);
                if (transformer) {
                    transformer(tile);
                    drawerState.toolUsed(item);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
}