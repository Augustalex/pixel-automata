import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {getTransformer} from "@/utils/transformers";

export function SimulateHumidifiers() {
    const gameState = useGameState();
    const view = PixelDataView();

    let running = false;
    let lastRunTime = Date.now();

    return {
        run,
        running: () => running,
        alwaysRun: true
    };

    function run({now, pixels}) {
        const delta = (now - lastRunTime) / 1000;

        let hasAnyHumidifier = false;
        let humidity = 0;
        for (let pixel of pixels) {
            if (pixel.pixelType === 'humidifier') {
                hasAnyHumidifier = true;

                if (pixel.radius > 7) {
                    getTransformer(pixel, 'grass')?.(pixel);
                } else {
                    pixel.readyMeter += delta;
                    if (pixel.readyMeter >= 2) {
                        pixel.radius += 2;
                        pixel.readyMeter = 0;
                        const sands = view.getNeighboursCircular(pixel, pixel.radius, p => p.pixelType === 'sand');
                        for (let sand of sands) {
                            getTransformer(sand, 'grass')?.(sand);
                        }
                    }
                }
            } else if (pixel.pixelType === 'grass') {
                humidity += 1;
            }
        }

        const finalHumidity = Math.max(0, humidity);
        gameState.info.humidity = hasAnyHumidifier ? .05 : ((finalHumidity / pixels.length) * 1.1);
    }
}