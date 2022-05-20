import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";
import {FarmHumidityThreshold} from "@/utils/useDrawerState";
import {useNotifications} from "@/utils/useNotifications";

export function SimulateHumidifiers() {
    const gameState = useGameState();
    const view = PixelDataView();
    const notifications = useNotifications();

    let hasAnnouncedFarmableMars = false;
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
                    transform(pixel, 'grass');
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

        gameState.info.humidity = Math.max(hasAnyHumidifier ? .05 : 0, ((humidity / pixels.length) * 1.1));

        if (gameState.info.humidity > FarmHumidityThreshold && !hasAnnouncedFarmableMars) {
            hasAnnouncedFarmableMars = true;
            notifications.farmable();
        }
    }
}