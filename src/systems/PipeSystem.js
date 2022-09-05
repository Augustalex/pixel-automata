import {PixelDataView} from "@/utils/pixelDataView/PixelDataView";
import {LayerItems} from "@/utils/transformers";
import {WATER_MAX_POLLUTION} from "@/utils/constants";

const DEFAULT_CONFIG = {
    DRAW_RATE: .1,
    WATER_MAX_POLLUTION: WATER_MAX_POLLUTION
};

export function PipeSystem({
                               DRAW_RATE,
                               WATER_MAX_POLLUTION
                           } = DEFAULT_CONFIG) {
    const view = PixelDataView();

    const running = false;

    return {
        run,
        running: () => running,
        alwaysRun: true
    };

    function run({delta, pixels}) {
        const toPollute = [];

        const MAX_PIPE_CAPACITY = 10;

        for (let pixel of pixels) {
            if (pixel.layer1) {
                if (pixel.layer1.item === LayerItems.Pipe) {
                    // const pollutionLevel = pixel.layer1.pollutionLevel;
                    const leftToFill = Math.max(0, MAX_PIPE_CAPACITY - pixel.layer1.pollutionLevel);
                    // If there is pollution on top of the tile and around it, absorb it into the pipes, if room left over this tick
                    if (leftToFill > 0) {
                        const tilesToDrawFrom = view.getNeighbours(pixel, 6, p => {
                            return (
                                !p.layer1
                                && p.pixelType !== 'water'
                                && p.pollution
                            );
                        });
                        for (let pollutedTile of tilesToDrawFrom) {
                            const toTake = Math.min(pollutedTile.pollution.level, DRAW_RATE * delta);
                            pixel.layer1.pollutionLevel += toTake;

                            pollutedTile.pollution.level = Math.max(0, pollutedTile.pollution.level - toTake);
                        }

                        if (pixel.pollution && leftToFill > 0) {
                            const toAdd = pixel.pollution.level;
                            pixel.layer1.pollutionLevel += toAdd;
                            delete pixel.pollution;
                        }
                    }

                    // Spread from pipe to nearby water
                    if (pixel.pixelType === 'water') {
                        const pollutionLevel = pixel.layer1.pollutionLevel;
                        const tilesToPollute = view.getNeighbours(pixel, 3, p => {
                            return (
                                !p.layer1
                                && p.pixelType === 'water'
                                && (
                                    !p.pollution
                                    || (p.pollution.level < WATER_MAX_POLLUTION)
                                )
                            );
                        });
                        const total = tilesToPollute.reduce((acc, v) => !v.pollution ? acc : acc + v.pollution.level, 0) + pollutionLevel;
                        const dividend = total / (tilesToPollute.length + 1);

                        for (let pollutedTile of tilesToPollute) {
                            if (!pollutedTile.pollution) pollutedTile.pollution = {level: 0};
                            pollutedTile.pollution.level = dividend;
                        }
                        pixel.layer1.pollutionLevel = dividend;
                    }

                    //Spread to nearby pipes
                    const pollutionLevel = pixel.layer1.pollutionLevel
                    const pollutedTiles = view.getNeighbours(pixel, 3, p => (p.layer1 && p.layer1.item === LayerItems.Pipe));
                    const tilesToPollute = pollutedTiles.filter(p => p.layer1.pollutionLevel < MAX_PIPE_CAPACITY && p.layer1.pollutionLevel < pollutionLevel);
                    if (tilesToPollute.length > 0) {
                        const sortedTilesToPollute = tilesToPollute.sort((a, b) => a.layer1.pollutionLevel - b.layer1.pollutionLevel);
                        for (let tile of sortedTilesToPollute) {
                            if (tile.layer1.pollutionLevel > MAX_PIPE_CAPACITY) continue;
                            if (tile.layer1.pollutionLevel > pixel.layer1.pollutionLevel) continue;

                            const toTake = Math.min(MAX_PIPE_CAPACITY * delta, pixel.layer1.pollutionLevel * .5);
                            if (toTake > .01) {
                                pixel.layer1.pollutionLevel -= toTake;
                                tile.layer1.pollutionLevel += toTake;
                            }
                        }
                    }
                }
            } else if (pixel.pixelType === 'water') {
                // Spread from water to other nearby water
                // if (pixel.layer1.pollutionLevel > WATER_MAX_POLLUTION * .5) {
                //     toPollute.push(pixel);
                // }
            }
        }

        for (let toPolluteElement of toPollute) {
            const nearbyWater = view.getNeighbours(toPolluteElement, 3, p => p.pixelType === 'water');
            const totalPollution = nearbyWater.reduce((acc, w) => acc + (w.layer1?.pollutionLevel || 0), toPolluteElement.layer1.pollutionLevel);
            const dividend = totalPollution / (nearbyWater.length + 1);
            let leftOver = 0;
            for (let nearbyWaterElement of nearbyWater) {
                if (!nearbyWaterElement.layer1) {
                    nearbyWaterElement.layer1 = {pollutionLevel: 0};
                }

                nearbyWaterElement.layer1.pollutionLevel = dividend;
                if (nearbyWaterElement.layer1.pollutionLevel > WATER_MAX_POLLUTION) {
                    leftOver = nearbyWaterElement.layer1.pollutionLevel - WATER_MAX_POLLUTION;
                    nearbyWaterElement.layer1.pollutionLevel = WATER_MAX_POLLUTION;
                }
            }
            toPolluteElement.layer1.pollutionLevel = dividend + leftOver;
        }
    }
}