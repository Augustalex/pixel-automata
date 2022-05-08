import {PixelDataView} from "@/utils/PixelDataView";
import {transform} from "@/utils/transformers";

export function SimulateFarms() {
    return {
        run
    };

    function run({delta, pixels}) {
        const view = PixelDataView(pixels);

        for (let pixel of pixels) {
            if (pixel.pixelType === 'farm') {
                const water = view.getNeighbours(pixel, 5, p => p.pixelType === 'water');
                if (water.length === 0) {
                    transform(pixel, 'grass');
                }
            }
        }
    }
}