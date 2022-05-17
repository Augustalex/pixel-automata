import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {getTransformer} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";

export function SimulateWaterSpread() {
    const gameState = useGameState();
    const view = PixelDataView();
    const notifications = useNotifications()

    let hasWater = false;
    let running = false;

    return {
        run,
        running: () => running,
        alwaysRun: true
    };

    function run({pixels}) {

        const toMakeWater = [];
        const waterLevel = Math.round(gameState.info.humidity * 10) - 1;
        for (let pixel of pixels) {
            if (pixel.pixelType !== 'water') {
                if (pixel.height <= waterLevel) {
                    const nearbyWater = view.getNeighbours(pixel, 3, p => p.pixelType === 'water');
                    if (pixel.height === 0 || nearbyWater.length > 0) {
                        toMakeWater.push(pixel);
                    }
                }
            }
        }

        for (let toMakeWaterElement of toMakeWater) {
            const transformer = getTransformer(toMakeWaterElement, 'water');
            if (transformer) {
                transformer(toMakeWaterElement);
                if (!hasWater) {
                    hasWater = true;
                    notifications.waterOnMars();
                }
            }
        }
    }
}