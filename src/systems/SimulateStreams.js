import {PixelDataView} from "@/utils/PixelDataView";
import {useGameClock} from "@/gameState";

export function SimulateStreams() {

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
                const landVectors = nearbyLand.map(land => subtractVectors(pixel.position, land.position));
                const totalVector = scale(landVectors.reduce((acc, v) => addVectors(acc, v), {x: 0, y: 0}), 4);
                pixel.velocity.x = totalVector.x;
                pixel.velocity.y = totalVector.y;
            }
        }
        for (let pixel of pixels) {
            if (pixel.pixelType === 'water') {
                const nearbyWater = view.getNeighbours(pixel, 3, p => p.pixelType === 'water');
                const totalVector = nearbyWater.map(water => water.velocity)
                    .reduce((acc, v) => addVectors(acc, v), {x: 0, y: 0});
                const finalVector = addVectors(totalVector, {x: 0, y: 0});
                pixel.velocity.x = finalVector.x;
                pixel.velocity.y = finalVector.y;

                const velocity = pixel.velocity;
                const magnitude = getMagnitude(velocity);

                const magFactor = magnitude / 8;
                const minV = Math.round(10 * magFactor);
                const range = 10 - minV;

                let rateX;
                const directionX = velocity.x > 0 ? 1 : -1;
                const absoluteXVelocity = Math.abs(velocity.x);
                if (absoluteXVelocity > 0) {
                    const magXFactor = Math.min(2, absoluteXVelocity) / 8;
                    const minVX = Math.round(10 * magXFactor);
                    const rangeX = 10 - minVX;

                    rateX = Math.round((scaledTime * directionX) % 2);
                    pixel.streamX = Math.min(10, Math.max(0, Math.round((velocity.x < 0 ? rangeX - rateX : minVX + rateX) - 1)));
                } else {
                    pixel.streamX = 0;
                }

                let rateY;
                const directionY = velocity.y > 0 ? 1 : -1;
                const absoluteYVelocity = Math.abs(velocity.y);
                if (absoluteYVelocity > 0) {
                    const magYFactor = Math.min(2, absoluteYVelocity) / 8;
                    const minVY = Math.round(10 * magYFactor);
                    const rangeY = 10 - minVY;

                    rateY = Math.round((pixel.position.y + scaledTime * directionY) % rangeY);
                    pixel.streamY = Math.min(10, Math.max(0, Math.round((velocity.y < 0 ? rangeY - rateY : minV + rateY) - 1)));
                } else {
                    pixel.streamY = 0;
                }

                if (pixel.position.x === 0 && pixel.position.y === 0) {
                    console.log({
                        rateX,
                        rateY,
                        sx: pixel.streamX,
                        sy: pixel.streamY,
                        vx: velocity.x,
                        vy: velocity.y,
                        magnitude,
                        minV,
                        range
                    })
                }
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
}