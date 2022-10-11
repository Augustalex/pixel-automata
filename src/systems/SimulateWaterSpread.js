import {PixelDataView} from "@/utils/pixelDataView/PixelDataView";
import {useGameState} from "@/gameState";
import {getTransformer} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";

export function SimulateWaterSpread() {
    const gameState = useGameState();
    const view = PixelDataView();
    const notifications = useNotifications()

    let hasWater = false;
    let running = false;

    const systemRunDelay = .25;
    let systemDelta = 0;

    return {
        run,
        running: () => running,
        alwaysRun: true
    };

    function run({pixels, delta}) {
        systemDelta += delta;
        if (systemDelta < systemRunDelay) return;
        systemDelta = 0;

        const toMakeWater = [];
        const waterLevel = calculateSeaLevel(gameState.info.humidity);
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

export function calculateSeaLevel(humidity) {
    return Math.round(easeOutExpo(humidity) * 6 - 1);
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}