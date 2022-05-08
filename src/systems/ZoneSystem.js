import {useGameClock} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";
import {fromCityToGrass, fromGrassToCity, transform} from "@/utils/transformers";

export function ZoneSystem() {
    return {
        run
    };

    function run({delta, pixels}) {
        for (let pixel of pixels) {
            if (pixel.pixelType === 'zone') {
                if (Math.random() < .7) continue;
                transform(pixel, pixel.zoneType);
            }
        }
    }
}