import {iconColor} from "@/utils/iconColor";

export function getTileColor(pixel, worldInfo) {
    const variation = pixel.variation;
    const [baseHue, baseSaturation, baseLightness] = iconColor({title: pixel.pixelType});
    if (pixel.pixelType === 'grass') {
        if (pixel.height >= 9) {
            return [
                120,
                60 - 20 * (pixel.height - 9),
                90 - 20 * (10 - pixel.height)
            ]
        }

        const saturationByHeight = pixel.height * 4 + 20;
        return [
            120,
            saturationByHeight + .25 * variation,
            saturationByHeight + .25 * variation,
            1
        ];
    }
    if (pixel.pixelType === 'sand') {
        if (worldInfo.humidity > .1 && pixel.height >= 9) {
            return [
                25 + .25 * variation,
                55 - 10 * (pixel.height - 9),
                90 - 20 * (10 - pixel.height)
            ]
        }

        const height = pixel.height * 5 + 20;
        return [
            25 + .25 * variation,
            height + .25 * variation,
            height + .25 * variation,
            // height,
            // applyVariation(height, 2, variation),
            1
        ];
    }
    if (pixel.pixelType === 'ice') return [
        applyVariation(120, 0, variation),
        applyVariation(10, 2, variation),
        applyVariation(100, .5, variation),
        1
    ];
    if (pixel.pixelType === 'farm') return [
        applyVariation(60, 0, variation),
        applyVariation(90, 2, variation),
        applyVariation(80, 1, variation),
        1
    ];
    if (pixel.pixelType === 'water') {
        const height = pixel.height * 5;
        const lightnessVariation = (pixel.streamY); //tops out at 20
        return [
            190 - 5 + lightnessVariation * .5,
            30 + height,
            20 + height + lightnessVariation,
            1
        ];
    }
    if (pixel.pixelType === 'city') return [
        applyVariation(190, 0, 0),
        applyVariation(0, 0, 0),
        applyVariation(50, 5, 10 - pixel.cityLevel),
        1
    ];
    if (pixel.pixelType === 'road') return [
        applyVariation(190, 0, 0),
        10,
        5 + variation * 1,
        1
    ];
    if (pixel.pixelType === 'humidifier') {
        const height = pixel.height * 5 + 20;
        return [
            baseHue,
            baseSaturation,
            baseLightness,
            1
        ];
    }
    return [0, 0, 0, 1];
}

function applyVariation(value, degree, variation, MAX_VARIATION = 10) {
    const startColor = Math.max(value - degree * MAX_VARIATION, degree * MAX_VARIATION)

    return startColor + degree * variation;
}
