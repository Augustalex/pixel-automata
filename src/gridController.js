import {useCursor} from "@/useCursor";
import {getTransformer, LayerItems, transform} from "@/utils/transformers";
import {useGameState, useGlobalGameClock} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";
import {useDrawerState} from "@/utils/useDrawerState";

export function useGridController() {
    const cursor = useCursor();
    const gameState = useGameState();
    const view = PixelDataView();
    const drawerState = useDrawerState();
    const gameClock = useGlobalGameClock();

    const lastTileMouseDown = null;

    return {
        onTileHover,
        onTileClicked,
        onCancel
    };

    function onTileHover(tile) {
        cursor.setHoveringTile(tile);
    }

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
            useItemOnTile(tile);
        }
    }

    function useItemOnTile(tile) {
        const item = cursor.holdingItem.value;
        const tileDrawerInfo = drawerState.tools.value.find(t => t.title === item);
        const now = gameClock.value;
        const cooldown = Math.max(0, Math.min(1, (tileDrawerInfo.cooldownUntil - now) / tileDrawerInfo.cooldownTime));
        if (cooldown > 0) return;

        if (item === 'pipe') {
            tile.layer1 = {
                item: LayerItems.Pipe,
                pollutionLevel: 0
            };
        } else if (item === 'raise') {
            tile.height = Math.min(10, tile.height + 1);

            const waterLevel = Math.round(gameState.info.humidity * 10) - 1;

            if (tile.height > waterLevel) {
                const nearbyGrass = view.getNeighbours(tile, 3, p => p.pixelType === 'grass');
                transform(tile, nearbyGrass.length > 0 ? 'grass' : 'sand');
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