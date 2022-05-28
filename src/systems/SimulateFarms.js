import {PixelDataView} from "@/utils/PixelDataView";
import {transform} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";
import {FarmType, isFarm, isGrainsFarm, isMushroomsFarm} from "@/utils/farmUtils";

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
            if (isFarm(pixel)) {
                if (isMushroomsFarm(pixel) && pixel.life > 0) {
                    const nearSoil = view.getNeighbours(pixel, 3, p => p.pixelType === 'grass' || isGrainsFarm(p));
                    if (nearSoil.length > 0) {
                        const randomIndex = Math.round(Math.random() * (nearSoil.length - 1));
                        const randomSoil = nearSoil[randomIndex];

                        const water = view.getNeighbours(randomSoil, 5, p => p.pixelType === 'water');
                        if (water.length > 0) {
                            transform(randomSoil, FarmType.Mushrooms);
                            randomSoil.life = pixel.life - 1;
                        }
                    }
                } else if (isGrainsFarm(pixel)) {

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
}