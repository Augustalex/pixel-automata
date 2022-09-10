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
                    if (!pixel.layer1.pollutionNeed) pixel.layer1.pollutionNeed = 0;

                    // If there is pollution on top of the tile and around it, absorb it into the pipes, if room left over this tick
                    const tilesToDrawFrom = view.getNeighbours(pixel, 6, p => {
                        return (
                            !p.layer1
                            && p.pixelType !== 'water'
                            && p.pollution
                        );
                    });
                    for (let pollutedTile of tilesToDrawFrom) {
                        const toTake = Math.min(MAX_PIPE_CAPACITY - pixel.layer1.pollutionLevel, pixel.layer1.pollutionNeed, pollutedTile.pollution.level);
                        pixel.layer1.pollutionLevel += toTake;
                        pixel.layer1.pollutionNeed -= toTake;

                        pollutedTile.pollution.level = Math.max(0, pollutedTile.pollution.level - toTake);
                        if (pollutedTile.pollution.level === 0) delete pixel.pollution;
                    }

                    // Spread from pipe to nearby water
                    if (pixel.pixelType === 'water') {
                        if (!pixel.pollution) pixel.pollution = {level: 0};

                        if (pixel.pollution.level < WATER_MAX_POLLUTION) {
                            if (pixel.layer1.pollutionLevel > 0) {
                                const toTake = Math.min(WATER_MAX_POLLUTION - pixel.pollution.level, pixel.layer1.pollutionLevel);
                                pixel.pollution.level += toTake;
                                pixel.layer1.pollutionLevel -= toTake;
                            }

                            const newNeed = Math.min(MAX_PIPE_CAPACITY, Math.max(0, WATER_MAX_POLLUTION - pixel.pollution.level));
                            console.log('NEW NEED', newNeed);
                            pixel.layer1.pollutionNeed = newNeed;
                        }
                    }

                    //Spread to nearby pipes

                    const pollutedTiles = view.getNeighbours(pixel, 3, p => (p.layer1 && p.layer1.item === LayerItems.Pipe));
                    if (pollutedTiles.length > 0) {
                        const sortedTilesToPollute = pollutedTiles.sort((a, b) => a.layer1.pollutionLevel - b.layer1.pollutionLevel);
                        for (let tile of sortedTilesToPollute) {
                            if (pixel.layer1.pollutionNeed > 0) {
                                // Take what is needed
                                if (tile.layer1.pollutionLevel > 0) {
                                    const toTake = Math.min(MAX_PIPE_CAPACITY - pixel.layer1.pollutionLevel, pixel.layer1.pollutionNeed, tile.layer1.pollutionLevel);

                                    tile.layer1.pollutionLevel -= toTake;

                                    pixel.layer1.pollutionLevel += toTake;
                                    pixel.layer1.pollutionNeed -= toTake;
                                }

                                // Propagate left over needs
                                tile.layer1.pollutionNeed = Math.min(MAX_PIPE_CAPACITY, tile.layer1.pollutionNeed + pixel.layer1.pollutionNeed);
                            }
                        }
                    }
                }
            }
        }
    }
}