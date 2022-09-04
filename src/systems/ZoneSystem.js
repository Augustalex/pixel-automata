import {transform} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";

export function ZoneSystem() {
    const notifications = useNotifications();
    let running = false;
    let hasMadeFirstCity = false;

    return {
        run,
        running: () => running
    };

    function run({delta, pixels}) {
        for (let pixel of pixels) {
            if (pixel.pixelType === 'zone') {
                if (Math.random() < .3) continue;
                transform(pixel, pixel.zoneType);

                if (!hasMadeFirstCity) {
                    hasMadeFirstCity = true;
                    notifications.settlement();
                }
            }
        }
    }
}