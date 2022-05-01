import {PixelDataView} from "@/utils/PixelDataView";
import {useGameClock} from "@/gameState";

export function SimulateStreams() {
    let wavePosition = {
        x: 0,
        y: 0
    };
    const speedScale = 1;
    const time = useGameClock();
    let current = 0;

    return {
        run
    };

    function run({delta, pixels}) {
        const scaledTime = time.value * speedScale;

        const view = PixelDataView(pixels);

        for (let pixel of pixels) {
            if (pixel.pixelType === 'water') {
                const nearbyLand = view.getNeighbours(pixel, 3, p => p.pixelType === 'grass');

                const [vx, vy] = rotateVector({x: 1, y: 1}, 45);
                const velocity = {x: vx, y: vy};

                wavePosition = moduloVector(addVectors(wavePosition, scale(velocity, delta * .005)), 1000);

                const area = 80;
                const range = 20;
                const variationScale = 1;

                let rateX;
                const absoluteXVelocity = Math.abs(velocity.x);
                if (absoluteXVelocity > 0) {
                    rateX = Math.round((pixel.position.x + wavePosition.x) % area);

                    const variation = Math.max(0, rateX - (area - range * 2)) - range;

                    // pixel.streamX = Math.min(10, Math.max(0, Math.round((velocity.x < 0 ? 10 - rateX * 2 : rateX * 2) - 1)));
                    pixel.streamX = 10 - (variation < 0 ? variation + range : variation) * variationScale;
                } else {
                    pixel.streamX = 0;
                }


                let rateY;
                const absoluteYVelocity = Math.abs(velocity.y);
                if (absoluteYVelocity > 0) {
                    rateY = Math.round((pixel.position.y + wavePosition.y) % area);

                    const variation = Math.max(0, rateY - (area - range * 2)) - range;

                    // pixel.streamY = Math.min(10, Math.max(0, Math.round((velocity.y < 0 ? 10 - rateY * 2 : rateY * 2) - 1)));
                    pixel.streamY = (variation < 0 ? variation + range : variation) * variationScale;
                } else {
                    pixel.streamY = 0;
                }


                // const [newX, newY] = rotateVector({x: pixel.streamX, y: pixel.streamY}, 30);
                // pixel.streamX = newX;
                // pixel.streamY = newY;
            }
        }
        current += delta;
        if (current > 10) current = 0;
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
        return [Math.round(10000 * (x * cos - y * sin)) / 10000, Math.round(10000 * (x * sin + y * cos)) / 10000];
    }
}