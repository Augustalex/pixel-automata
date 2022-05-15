import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";

export function SimulateWaterSpread() {
    const gameState = useGameState();
    const view = PixelDataView();

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
            transform(toMakeWaterElement, 'water');
        }
    }
}