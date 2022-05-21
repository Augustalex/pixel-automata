import {reactive, ref} from "vue";
import {TileSize, WorldHeight, WorldWidth} from "@/utils/constants";
import {SimulateCities} from "@/systems/SimulateCities";
import {SimulateStreams} from "@/systems/SimulateStreams";
import {SimulateHumidifiers} from "@/systems/SimulateHumidifiers";
import {SimulateWaterSpread} from "@/systems/SimulateWaterSpread";
import {SimulateFarms} from "@/systems/SimulateFarms";
import {ZoneSystem} from "@/systems/ZoneSystem";
import {SimulatePollution} from "@/systems/SimulatePolution";

const _gameClock = ref(0);
const _state = reactive({
    worldData: {
        tileSize: TileSize,
        width: WorldWidth,
        height: WorldHeight,
    },
    info: {
        averageTemperature: 0,
        humidity: 0,
    },
    pixels: GenerateWorld(WorldWidth, WorldHeight)
});

export const useGlobalGameClock = () => {
    if (_gameClock.value === 0) {
        const loop = () => {
            _gameClock.value = Date.now();

            requestAnimationFrame(loop);
        };
        loop();
    }

    return _gameClock;
};
export const useGameClock = () => _gameClock;
export const useGameState = () => _state;

const frameTimeBuffer = [];

window.fpsCounter = () => {
    setInterval(() => {
        if (frameTimeBuffer.length === 0) return;

        const cycleTime = frameTimeBuffer.reduce((acc, v) => acc + v, 0) / frameTimeBuffer.length;
        console.log(1000 / cycleTime);
    }, 800);
}

export function Simulation({modules} = {modules: DefaultModules()}) {
    let timeoutId;
    let systemIndex = 0;

    return {
        start,
        stop,
        isRunning
    };

    function start() {
        let previousTime = Date.now();

        const loop = () => {
            const start = performance.now();
            const currentTime = Date.now();
            const delta = (currentTime - previousTime) / 1000;
            _gameClock.value = (_gameClock.value + delta);

            const moduleProps = {now: currentTime, delta, pixels: _state.pixels};

            const runningModule = modules.find(m => !m.alwaysRun && m.running());
            if (!runningModule) {
                systemIndex += 1;
                if (systemIndex >= modules.length) {
                    systemIndex = 0;
                }
            }
            modules[systemIndex].run(moduleProps);

            for (let alwaysRunModule of modules.filter(m => m.alwaysRun)) {
                alwaysRunModule.run(moduleProps)
            }


            frameTimeBuffer.push(performance.now() - start);

            if (frameTimeBuffer.length > 100) frameTimeBuffer.shift();

            previousTime = currentTime;
            timeoutId = setTimeout(loop, 250);
        };

        loop();
    }

    function stop() {
        clearTimeout(timeoutId);
        timeoutId = undefined;
    }

    function isRunning() {
        return timeoutId !== undefined;
    }
}

function DefaultModules() {
    return [
        // SimulateGrassGrowth(),
        // SimulateGlobalWarming(),
        SimulateCities(),
        SimulateStreams(),
        SimulateHumidifiers(),
        SimulateWaterSpread(),
        SimulateFarms(),
        ZoneSystem(),
        SimulatePollution()
    ];
}

function SimulateGrassGrowth() {
    return {
        run
    };

    function run({delta, pixels}) {
        for (let pixel of pixels) {
            if (pixel.pixelType === 'grass') {
                pixel.age += delta;

                if (pixel.age >= (5 + (pixel.variation * pixel.variation))) {
                    fromGrassToDeadGrass(pixel);
                }
            }
        }
    }

    function fromGrassToDeadGrass(pixel) {
        pixel.age = undefined;
        pixel.pixelType = 'dead-grass';
        pixel.water = 0;
    }
}

function SimulateGlobalWarming() {
    const gasOutput = 1;

    let amplitude = 10;
    let deviationStrength = 10;
    let globalAverageTemperature = 10;

    const midX = _state.worldData.width * .5;
    const midY = _state.worldData.height * .5;

    // todo maybe adjust grass based on a height map instead?

    return {
        run
    };

    function run({delta, pixels}) {
        for (let pixel of pixels) {
            const xDeviation = Math.abs(pixel.position.x - midX) * deviationStrength;
            const yDeviation = Math.abs(pixel.position.y - midY) * deviationStrength;
            pixel.temperature = globalAverageTemperature - xDeviation + (globalAverageTemperature * .5) - yDeviation;

            if (pixel.pixelType === 'water') {

                // if (pixel.pixelType === 'water') {
                //     if (pixel.age >= (5 + (pixel.variation * pixel.variation))) {
                //         TransformGrassToDeadGrass(pixel);
                //     }
                // }

                if (pixel.temperature > 100) {
                    fromWaterToGrass(pixel);
                }
            } else if (pixel.pixelType === 'grass') {
                if (pixel.temperature < 0) {
                    fromGrassToIce(pixel);
                } else if (pixel.temperature > 200) {
                    fromGrassToDeadGrass(pixel);
                }
            } else if (pixel.pixelType === 'dead-grass') {
                if (pixel.temperature < 0) {
                    fromDeadGrassToIce(pixel);
                }
            } else if (pixel.pixelType === 'ice') {
                if (pixel.temperature > 0) {
                    fromIceToWater(pixel);
                }
            }
        }

        amplitude += gasOutput * delta;
        deviationStrength = amplitude / 10;
        globalAverageTemperature += amplitude * delta;
    }

    function fromGrassToDeadGrass(pixel) {
        pixel.age = undefined;
        pixel.pixelType = 'dead-grass';
        pixel.water = 0;
    }

    function fromWaterToGrass(pixel) {
        pixel.pixelType = 'grass';
        pixel.age = 0;
        pixel.water = 0;
    }

    function fromIceToWater(pixel) {
        pixel.pixelType = 'water';
    }

    function fromGrassToIce(pixel) {
        pixel.pixelType = 'ice';
        pixel.age = undefined;
    }

    function fromDeadGrassToIce(pixel) {
        pixel.pixelType = 'ice';
        pixel.water = undefined;
    }
}

function GenerateWorld(width, height) {
    const pixelMap = new Map();

    const pixels = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let pixel = GeneratePixel(x, y);
            pixelMap.set(key(pixel), pixel);
            pixels.push(pixel);
        }
    }

    const passes = 2;
    for (let i = 0; i < passes; i++) {
        for (let pixel of pixels) {
            if (pixel.pixelType === 'sand') {
                if (pixel.height === 0 && Math.random() < .1) continue;
                // if (Math.random() < .3) continue;
                // if ((pixel.height > 7 || pixel.height <= 3) && Math.random() > .3) continue;
                const neighbours = getPixelsInRadius(pixel, 4);
                const newHeight = Math.round(neighbours.reduce((acc, v) => acc + easeInOutSine(v.height / 10) * 10, 0) / neighbours.length);
                pixel.height = newHeight;
            }
        }
    }

    return pixels;

    function getNeighbours(ox, oy, diameter) {
        const n = [];
        const startRadius = Math.floor(diameter / 2);
        const endRadius = Math.ceil(diameter / 2) - 1;
        for (let y = oy - startRadius; y <= oy + endRadius; y++) {
            for (let x = ox - startRadius; x <= ox + endRadius; x++) {
                const wrappedX = x < 0 ? (WorldWidth + x) : x % WorldWidth;
                n.push(`${wrappedX}:${y}`);
            }
        }

        return n;
    }

    function getPixelsInRadius(pixel, radius) {
        return getNeighbours(pixel.position.x, pixel.position.y, radius)
            .map(key => pixelMap.get(key))
            .filter(p => !!p);
    }

    function GeneratePixel(x, y) {
        return {
            pixelType: 'sand',
            variation: Math.round(Math.random() * 10),
            height: Math.round(easeInOutSine(Math.random()) * 10),
            position: {x, y},
            age: 0,
            streamY: 0,
            surface: 'smooth',
        }
    }

    function key(pixel) {
        return `${pixel.position.x}:${pixel.position.y}`;
    }
}

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}