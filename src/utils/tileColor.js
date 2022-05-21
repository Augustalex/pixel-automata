import {iconColor} from "@/utils/iconColor";

export function getTileColor(pixel, worldInfo) {
    const variation = pixel.variation;
    const [baseHue, baseSaturation, baseLightness] = iconColor({title: pixel.pixelType});
    if (pixel.onFire) {
        const height = pixel.height;
        const variation = Math.random() * 1.5;
        return [
            15,
            50 + height * 2 + variation,
            40 + height * 2 + variation
        ]
    }
    if (pixel.pixelType === 'grass') {
        if (pixel.height >= 9) {
            return [
                120,
                60 - 20 * (pixel.height - 9),
                90 - 20 * (10 - pixel.height)
            ]
        }

        return [
            120,
            20 + pixel.height * 4 + .25 * variation,
            35 + pixel.height * 3 + .25 * variation,
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

        return [
            25 + .25 * variation,
            30 + pixel.height * 4 + .25 * variation,
            35 + pixel.height * 3 + .25 * variation,
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
        const lightnessVariation = (pixel.streamY); //tops out at 20
        return [
            190 - 5 + lightnessVariation * .5,
            // 40 + pixel.height * 3,
            ((Math.max(0, Math.min(80, 70 + pixel.height * 2 + lightnessVariation)) / 100)) * 100,
            (easeOutQuint(Math.max(0, Math.min(50, 10 + pixel.height * 2.5 + lightnessVariation / 3)) / 100)) * 100,
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

function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}