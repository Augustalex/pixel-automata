import {PixelDataView} from "@/utils/PixelDataView";
import {getTransform} from "@/utils/transformers";

export function SimulateFarms() {
    const view = PixelDataView();

    const running = false;

    return {
        run,
        running: () => running
    };

    function run({delta, pixels}) {

        for (let pixel of pixels) {
            if (pixel.pixelType === 'farm') {
                const water = view.getNeighbours(pixel, 5, p => p.pixelType === 'water');
                if (water.length === 0) {
                    getTransform(pixel, 'grass')?.(pixel);
                }
            }
        }
    }
}