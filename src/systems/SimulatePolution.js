import {PixelDataView} from "@/utils/PixelDataView";
import {useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";

export const FireThreshold = 4;

export function SimulatePollution() {
    const gameState = useGameState();
    const view = PixelDataView();

    let running = false;

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
                    totalHeat += 9;
                }
            } else {
                const pollution = pixel.pollution;

                if (reachedFireThreshold && pollution && Math.random() < .6) {
                    delete pixel.pollution;
                    pixel.onFire = {fuel: 10};
                    totalHeat += 9;

                    transform(pixel, 'sand');

                    const neighbours = view.getNeighbours(pixel, 3, p => !p.onFire && Math.random() < .8);

                    for (let neighbour of neighbours) {
                        neighbour.onFire = {fuel: Math.random() * 2};
                        transform(neighbour, 'sand');
                    }
                } else {

                    if (pixel.pixelType === 'city') {
                        if (!pollution) {
                            pixel.pollution = {level: 0};
                        } else {
                            pollution.level += delta;
                        }
                    } else if (pixel.pixelType === 'grass' || pixel.pixelType === 'water') {
                        if (pollution) {
                            pixel.pollution.level = Math.max(0, pollution.level - delta * .5);
                        }
                    } else if (pixel.pixelType === 'farm') {
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

        gameState.info.averageTemperature = totalHeat / count;
    }
}