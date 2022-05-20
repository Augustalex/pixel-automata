import {PixelDataView} from "@/utils/PixelDataView";
import {transform} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";

export function SimulateFarms() {
    const view = PixelDataView();
    const notifications = useNotifications();

    let builtFirstFarm = false;
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
                    transform(pixel, 'grass');
                } else {
                    if (!builtFirstFarm) {
                        builtFirstFarm = true;
                        notifications.marsianMushrooms();
                    }
                }
            }
        }
    }
}