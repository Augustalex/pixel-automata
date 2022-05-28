import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";
import {isFarm} from "@/utils/farmUtils";

export const FireThreshold = 4;

export function SimulatePollution() {
    const gameState = useGameState();
    const view = PixelDataView();
    const notifications = useNotifications();

    let running = false;

    let pollutionWarningLevel = 0;


    return {
        run,
        running: () => running,
        alwaysRun: true
    };

    function run({pixels, delta}) {
        let totalHeat = 0;
        let count = 0;

        const reachedFireThreshold = gameState.info.averageTemperature > FireThreshold;
        for (let pixel of pixels) {
            if (pixel.onFire) {
                pixel.onFire.fuel -= delta;
                if (pixel.onFire.fuel <= 0) {
                    delete pixel.onFire;
                } else {
                    totalHeat += 99;
                }
            } else {
                const pollution = pixel.pollution;

                const randomValue = Math.random();
                if (reachedFireThreshold) {
                    if ((pixel.pixelType !== 'sand' || randomValue < .01) && randomValue < .2 || (pollution && randomValue < .9)) {
                        pixel.onFire = {fuel: pollution ? 5 : Math.random()};
                        delete pixel.pollution;
                        totalHeat += 99;

                        transform(pixel, 'sand');

                        const neighbours = view.getNeighbours(pixel, 5, p => p.pixelType !== 'sand' && !p.onFire && Math.random() < .8);

                        for (let neighbour of neighbours) {
                            neighbour.onFire = {fuel: Math.random()};
                            delete neighbour.pollution;
                            transform(neighbour, 'sand');
                        }
                    }
                } else {

                    if (pixel.pixelType === 'city') {
                        if (!pollution) {
                            pixel.pollution = {level: 0};
                        } else {
                            pollution.level += delta * 1.5;
                        }
                    } else if (pixel.pixelType === 'grass' || pixel.pixelType === 'water') {
                        if (pollution) {
                            pixel.pollution.level = Math.max(0, pollution.level - delta * .5);
                        }
                    } else if (isFarm(pixel)) {
                        if (pollution && pollution.level > 2) {
                            transform(pixel, 'sand');
                        }
                    }

                    if (pollution) {
                        const level = pollution.level;
                        totalHeat += level;

                        if (level > 2) {
                            if (Math.random() < .3) {
                                let total = level;
                                const neighbours = view.getNeighbours(pixel, 5, p => (!p.pollution || p.pollution.level < 2) && Math.random() < .3);

                                for (let neighbour of neighbours) {
                                    if (!neighbour.pollution) {
                                        neighbour.pollution = {level: 0};
                                    }

                                    const toTake = .1;
                                    const canTake = Math.min(total, toTake);

                                    neighbour.pollution.level += canTake;
                                    total -= canTake;
                                }

                                pollution.level = total;
                            }
                        }
                    }
                }
            }

            totalHeat += 1;
            count += 1;
        }

        const averageTemperature = totalHeat / count;
        gameState.info.averageTemperature = averageTemperature;
        if (pollutionWarningLevel === 0) {
            if (averageTemperature > 1.25) {
                pollutionWarningLevel = 1;
                notifications.pollutionRising();
            }
        } else if (pollutionWarningLevel === 1) {
            if (averageTemperature > 1.5) {
                pollutionWarningLevel = 2;
                notifications.warningPollution();
            }
        } else if (pollutionWarningLevel === 2) {
            if (averageTemperature > 2) {
                pollutionWarningLevel = 3;
                notifications.catastrophicPollution();
            }
        } else if (pollutionWarningLevel === 3) {
            if (averageTemperature > 3) {
                pollutionWarningLevel = 4;
                notifications.hellToCome();
            }
        } else if (pollutionWarningLevel === 4) {
            if (reachedFireThreshold) {
                pollutionWarningLevel = 5;
                notifications.hellFire();
            }
        }
    }
}