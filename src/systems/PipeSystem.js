import {PixelDataView} from "@/utils/PixelDataView";
import {LayerItems} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";

const WATER_MAX_POLLUTION = 100;

export function PipeSystem() {
    const view = PixelDataView();
    const notifications = useNotifications();

    const running = false;

    return {
        run,
        running: () => running,
        alwaysRun: true
    };

    function run({delta, pixels}) {
        const toPollute = [];

        for (let pixel of pixels) {
            if (pixel.layer1) {
                if (pixel.layer1.item === LayerItems.Pipe) {
                    if (pixel.pollution) {
                        const toAdd = pixel.pollution.level;
                        pixel.layer1.pollutionLevel += toAdd;
                        delete pixel.pollution;
                    }

                    const pollutedTiles = view.getNeighbours(pixel, 3, p => !!p.pollution || (p.layer1 && p.layer1.item === LayerItems.Pipe) || p.pixelType === 'water');
                    const totalPollution = pollutedTiles.filter(p => p.layer1 && p.layer1.item === LayerItems.Pipe).reduce((acc, p) => acc + (p.layer1?.pollutionLevel || 0), pixel.layer1.pollutionLevel);
                    const dividend = totalPollution / (pollutedTiles.length + 1);
                    pixel.layer1.pollutionLevel = dividend;

                    for (let pollutedTile of pollutedTiles) {
                        if (pollutedTile.layer1 && pollutedTile.layer1.item === LayerItems.Pipe) {
                            pollutedTile.layer1.pollutionLevel = dividend;
                        } else if (pollutedTile.pixelType === 'water') {
                            pollutedTile.layer1 = pollutedTile.layer1 || {pollutionLevel: 0};

                            pollutedTile.layer1.pollutionLevel = pixel.layer1.pollutionLevel;
                            pixel.layer1.pollutionLevel = 0;
                        } else {
                            pixel.pollution = pixel.pollution || {level: 0};

                            pixel.pollution.level += pollutedTile.pollution.level;
                            delete pollutedTile.pollution;
                        }
                    }
                } else if (pixel.pixelType === 'water' && pixel.layer1.pollutionLevel !== undefined) {
                    if (pixel.layer1.pollutionLevel > WATER_MAX_POLLUTION * .5) {
                        toPollute.push(pixel);
                    }
                }
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