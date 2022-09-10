import {PixelDataView} from "@/utils/pixelDataView/PixelDataView";
import {useGameState} from "@/gameState";
import {transform} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";
import {isFarm} from "@/utils/farmUtils";
import {WATER_MAX_POLLUTION} from "@/utils/constants";

export const FireThreshold = 4;

const createDependencies = () => ({
    useNotifications,
    useGameState,
    PixelDataView
});

export function SimulatePollution(
    // {
    //     useNotifications,
    //     useGameState,
    //     PixelDataView,
    // } = DEPENDENCIES,
    dependencies,
    {
        deterministic
    } = {deterministic: false}
) {
    const {
        useNotifications,
        useGameState,
        PixelDataView,
    } = dependencies || createDependencies();
    const gameState = useGameState();
    const view = PixelDataView();
    const notifications = useNotifications();

    let running = false;

    let pollutionWarningLevel = 0;

    // reset on each run
    let totalHeat = 0;
    let count = 0;
    let delta = 0;

    return {
        run, running: () => running, alwaysRun: true
    };

    function run({pixels, delta: _delta}) {
        totalHeat = 0;
        count = 0;
        delta = _delta;

        const reachedFireThreshold = gameState.info.averageTemperature > FireThreshold;
        for (let pixel of pixels) {
            if (pixel.onFire) {
                onFire(pixel, delta);
            } else {
                if (reachedFireThreshold) {
                    startFire(pixel);
                } else {
                    if (pixel.pixelType === 'city') {
                        increasePollution(pixel, delta);
                    } else if (pixel.pixelType === 'grass') {
                        decreasePollution(pixel, delta);
                    } else if (isFarm(pixel)) {
                        checkFarmPollution(pixel);
                    }

                    if (pixel.pollution) {
                        const isWater = pixel.pixelType === 'water';
                        const level = pixel.pollution.level;
                        const heatModifier = isWater ? .01 : 1;
                        totalHeat += level * heatModifier;

                        spreadPollution(pixel);
                    }
                }
            }

            totalHeat += 1;
            count += 1;
        }

        const averageTemperature = totalHeat / count;
        gameState.info.averageTemperature = averageTemperature;

        checkForNewNotifications(averageTemperature, reachedFireThreshold);
    }

    function increasePollution(pixel, delta) {
        if (!pixel.pollution) {
            pixel.pollution = {level: 0};
        }

        pixel.pollution.level += delta * .5;
    }

    function decreasePollution(pixel, delta) {
        if (pixel.pollution) {
            pixel.pollution.level = Math.max(0, pixel.pollution.level - delta * .5);
        }
    }

    function checkFarmPollution(pixel) {
        if (pixel.pollution && pixel.pollution.level > 2) {
            transform(pixel, 'sand');
        }
    }

    function spreadPollution(pixel) {
        const isWater = pixel.pixelType === 'water';
        const level = pixel.pollution.level;

        const maxLevel = isWater ? WATER_MAX_POLLUTION : 2;
        if (level > maxLevel / 2) {
            if (deterministic || Math.random() < .3) {
                const neighbours = view.getNeighbours(pixel, 3, p => {
                    return (!isWater || p.pixelType === 'water')
                        && !p.layer1
                        && (!p.pollution || p.pollution.level < maxLevel)
                        && (deterministic || Math.random() < .3);
                });

                for (let neighbour of neighbours) {
                    if (!neighbour.pollution) neighbour.pollution = {level: 0};

                    const neighbourPollutionLevel = neighbour.pollution.level;
                    if (neighbourPollutionLevel > maxLevel) continue;
                    if (neighbourPollutionLevel > pixel.pollution.level) continue;

                    const toTake = Math.min(maxLevel * delta, pixel.pollution.level);
                    if (toTake > .01) {
                        pixel.pollution.level -= toTake;
                        neighbour.pollution.level += toTake;
                    }
                }
            }
        }
    }

    function checkForNewNotifications(averageTemperature, reachedFireThreshold) {
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

    function onFire(pixel, delta) {
        pixel.onFire.fuel -= delta;
        if (pixel.onFire.fuel <= 0) {
            delete pixel.onFire;
        } else {
            totalHeat += 99;
        }
    }

    function startFire(pixel) {
        const randomValue = Math.random();
        if ((pixel.pixelType !== 'sand' || randomValue < .01) && randomValue < .2 || (pixel.pollution && randomValue < .9)) {
            pixel.onFire = {fuel: pixel.pollution ? 5 : Math.random()};
            delete pixel.pollution;
            totalHeat += 99;

            delete pixel.layer1;
            transform(pixel, 'sand');

            const neighbours = view.getNeighbours(pixel, 5, p => p.pixelType !== 'sand' && !p.onFire && Math.random() < .8);

            for (let neighbour of neighbours) {
                neighbour.onFire = {fuel: Math.random()};
                delete neighbour.pollution;
                delete neighbour.layer1;
                transform(neighbour, 'sand');
            }
        }
    }
}