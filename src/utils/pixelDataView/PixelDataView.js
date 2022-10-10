import {WorldWidth} from "@/utils/constants";
import {pixels} from "@/gameState";
import {_PixelDataView, pixelMapKey} from "@/utils/pixelDataView/_PixelDataView";

let loaded = false;
const pixelMap = new Map();

export function PixelDataView() {
    if (!loaded) {
        for (let pixel of pixels) {
            const position = pixel.position;
            pixelMap.set(pixelMapKey(position.x, position.y), pixel);
        }
        loaded = true;
    }


    return _PixelDataView({pixelMap, WorldWidth});
}
