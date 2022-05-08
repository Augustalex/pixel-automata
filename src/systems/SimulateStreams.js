import {PixelDataView} from "@/utils/PixelDataView";
import {useGameClock} from "@/gameState";

export function SimulateStreams() {
    const wavelength = .6;
    let offset = {x: -10000, y: 10000};
    const speedScale = 2;
    const time = useGameClock();

    let flow = {x: 0, y: 0};

    let pacing = 0;

    return {
        run
    };

    function run({delta, pixels}) {
        pacing += delta;
        if (pacing < .5) return;
        pacing = 0;

        const view = PixelDataView(pixels);

        const steps = 20;

        for (let pixel of pixels) {
            if (pixel.pixelType === 'water') {
                const nearbyLand = view.getNeighbours(pixel, 3, p => p.pixelType === 'grass');

                const wave1 = height(pixel.position.x, pixel.position.y, wavelength, offset);
                const wave3 = height(pixel.position.x, pixel.position.y, wavelength / 4, {
                    x: 100,
                    y: 100
                });
                const waveHeight = (wave1 + wave3) / 2;
                const streamY = (steps / 2) + waveHeight * (steps / 2);
                if (nearbyLand.length >= 3) {
                    pixel.streamY = steps / 2 + (streamY / 2);
                } else {
                    pixel.streamY = streamY;
                }
            }
        }

        flow = clampVector(addVectors(flow, {
            x: -1 + Math.random() * 2,
            y: -1 + Math.random() * 2
        }), -1, 1);
        flow = rotateVector(flow, Math.random() * delta);
        offset = moduloVector(addVectors(offset, {
            x: flow.x * .1 * delta * speedScale,
            y: flow.y * .1 * delta * speedScale
        }), 10000);
    }

    function height(x, y, wavelength, offset) {
        const t = -((time.value * speedScale) % Number.MAX_VALUE);
        const v = Math.sqrt(Math.pow(x + offset.x, 2) + Math.pow(y - offset.y, 2));
        return Math.sin(wavelength * (t + v));
    }

    function getMagnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    function addVectors(a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    }

    function moduloVector(vector, modulo) {
        return {
            x: vector.x % modulo,
            y: vector.y % modulo,
        };
    }


    function scale(vector, factor) {
        return {
            x: vector.x * factor,
            y: vector.y * factor,
        };
    }

    function subtractVectors(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
        };
    }

    function rotateVector({x, y}, ang) {
        ang = -ang * (Math.PI / 180);
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        return {x: Math.round(10000 * (x * cos - y * sin)) / 10000, y: Math.round(10000 * (x * sin + y * cos)) / 10000};
    }

    function clampVector({x, y}, min, max) {
        return {
            x: Math.max(min, Math.min(max, x)),
            y: Math.max(min, Math.min(max, y)),
        }
    }
}