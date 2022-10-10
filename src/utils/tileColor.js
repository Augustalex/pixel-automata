import {iconColor} from "@/utils/iconColor";
import {isFarm, isMushroomsFarm} from "@/utils/farmUtils";

const CityHues = [
    291,
    332,
    254,
    174,
    83,
    19,
    0,
    14,
    245,
    300
];

export function getTileColor(pixel, humidity, variationTurnedOn, heightMapTurnedOn) {
    const variation = variationTurnedOn ? pixel.variation : 5;
    const [baseHue, baseSaturation, baseLightness] = iconColor({title: pixel.pixelType});
    const pixelHeight = heightMapTurnedOn ? pixel.height : 5;
    if (pixel.onFire) {
        const height = pixelHeight;
        const variation = Math.random() * 1.5;
        return [
            15,
            50 + height * 2 + variation,
            40 + height * 2 + variation
        ]
    }
    if (pixel.pixelType === 'grass') {
        if (pixelHeight >= 9) {
            return [
                120,
                60 - 20 * (pixelHeight - 9),
                90 - 20 * (10 - pixelHeight)
            ]
        }

        return [
            114 + 1.5 * variation,
            20 + pixelHeight * 4 + .15 * variation,
            35 + pixelHeight * 3 + .15 * variation,
            1
        ];
    }
    if (pixel.pixelType === 'sand') {
        const isIce = humidity > .1 && pixelHeight >= 9;
        if (isIce) {
            return [
                25 + .25 * variation,
                55 - 10 * (pixelHeight - 9),
                90 - 20 * (10 - pixelHeight)
            ]
        }

        return [
            22 + .15 * variation,
            40 + pixelHeight * 2 + variation * .15,
            35 + pixelHeight * 3 + variation * .1,
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
    if (isFarm(pixel)) {
        const pollutionLevel = pixel.pollution?.level || 0;
        return [
            (isMushroomsFarm(pixel) ? 120 : 50) + variation * 1.5,
            pixel.connected ? Math.max(15, 75 + variation * 2 - (pollutionLevel * 40)) : 20,
            70 + variation * 2,
            1
        ];
    }
    if (pixel.pixelType === 'water') {
        const waterStreamVariation = variationTurnedOn ? pixel.streamY : 5; //tops out at 20

        if (!variationTurnedOn && !heightMapTurnedOn) {
            return [200, 65, 43, 1];
        }
        if (!heightMapTurnedOn && variationTurnedOn) {
            return [200, 65 + waterStreamVariation * .5, 45 + waterStreamVariation * .5, 1];
        }

        return [
            200 + waterStreamVariation * 2,
            // 40 + pixel.height * 3,
            ((Math.max(40, Math.min(85, 70 + pixelHeight * 2 + waterStreamVariation)) / 100)) * 100,
            (easeOutQuint(Math.max(10, Math.min(70, 10 + pixelHeight * 2.5 + waterStreamVariation / 3)) / 100)) * 100,
            1
        ];
    }
    if (pixel.pixelType === 'city') {
        if (!variationTurnedOn) {
            return [332, 80, 77, 1];
        }
        if (!heightMapTurnedOn) {
            return [
                CityHues[Math.round(variation)],
                80,
                77,
                1
            ];
        }

        return [
            CityHues[Math.round(variation)],
            80,
            75 + pixelHeight * 1.5,
            1
        ];
    }
    if (pixel.pixelType === 'road') return [
        188 + variation * .5,
        20 + variation * .25 + pixelHeight * .25,
        5 + variation * .15 + pixelHeight * 4,
        1,
    ];
    if (pixel.pixelType === 'humidifier') {
        const height = pixelHeight * 5 + 20;
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