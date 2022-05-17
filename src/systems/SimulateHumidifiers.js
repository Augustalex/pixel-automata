import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";

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

        let humidity = 0;
        for (let pixel of pixels) {
            if (pixel.pixelType === 'humidifier') {
                if (pixel.radius > 7) {
                    transform(pixel, 'grass')
                } else {
                    pixel.readyMeter += delta;
                    if (pixel.readyMeter >= 2) {
                        pixel.radius += 2;
                        pixel.readyMeter = 0;
                        const sands = view.getNeighboursCircular(pixel, pixel.radius, p => p.pixelType === 'sand');
                        for (let sand of sands) {
                            transform(sand, 'grass');
                        }
                    }
                }
            } else if (pixel.pixelType === 'grass') {
                humidity += 1;
            }
        }

        const finalHumidity = Math.max(0, humidity);
        gameState.info.humidity = (finalHumidity / pixels.length) * 1.1;
    }
}