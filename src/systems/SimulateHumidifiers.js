import {PixelDataView} from "@/utils/PixelDataView";
import {useGameClock, useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";

export function SimulateHumidifiers() {
    const gameState = useGameState();

    let running = false;
    let lastRunTime = Date.now();

    return {
        run,
        running: () => running
    };

    function run({now, pixels}) {
        const delta = (now - lastRunTime) / 1000;
        const view = PixelDataView(pixels);

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
            } else if (pixel.pixelType === 'sand') {
                // humidity -= 1;
            }
        }

        const finalHumidity = Math.max(0, humidity);
        gameState.info.humidity = (finalHumidity / pixels.length);

        const toMakeWater = [];
        const waterLevel = Math.round(gameState.info.humidity * 10) - 1;
        for (let pixel of pixels) {
            if (pixel.height <= waterLevel && pixel.pixelType !== 'water' && pixel.pixelType !== 'space') {
                const nearbyWater = view.getNeighbours(pixel, 3, p => p.pixelType === 'water');
                if (pixel.height === 0 || nearbyWater.length > 0) {
                    toMakeWater.push(pixel);
                }
            }
        }

        for (let toMakeWaterElement of toMakeWater) {
            transform(toMakeWaterElement, 'water');
        }
    }
}