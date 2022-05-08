import {reactive, ref} from "vue";
import {SimulateCities} from "@/systems/SimulateCities";
import {SimulateStreams} from "@/systems/SimulateStreams";
import {SimulateHumidifiers} from "@/systems/SimulateHumidifiers";
import {SimulateFarms} from "@/systems/SimulateFarms";
import {ZoneSystem} from "@/systems/ZoneSystem";
import {TileSize} from "@/utils/constants";

const WorldWidth = 42;
const WorldHeight = 32;

const _gameClock = ref(0);
const _state = reactive({
    worldData: {
        tileSize: TileSize,
        width: WorldWidth,
        height: WorldHeight,
    },
    info: {
        humidity: 0,
    },
    pixels: GenerateWorld(WorldWidth, WorldHeight)
});

export const useGameClock = () => _gameClock;
export const useGameState = () => _state;

export function Simulation({modules} = {modules: DefaultModules()}) {
    let timeoutId;

    return {
        start,
        stop,
        isRunning
    };

    function start() {
        let previousTime = Date.now();

        const loop = () => {
            const currentTime = Date.now();
            const delta = (currentTime - previousTime) / 1000;
            _gameClock.value = (_gameClock.value + delta);

            const moduleProps = {delta, pixels: _state.pixels};

            for (let module of modules) {
                module.run(moduleProps);
            }

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
        SimulateFarms(),
        ZoneSystem()
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

    const passes = 12;
    for (let i = 0; i < passes; i++) {
        for (let pixel of pixels) {
            if (pixel.pixelType === 'sand') {
                if (Math.random() < .3) continue;
                if ((pixel.height > 7 || pixel.height < 2) && Math.random() > .3) continue;
                const neighbours = getPixelsInRadius(pixel, 4);
                const newHeight = Math.round(neighbours.reduce((acc, v) => acc + v.height, 0) / neighbours.length);
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
                n.push(`${x}:${y}`);
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
            height: Math.round(Math.random() * 10),
            position: {x, y},
            age: 0,
            streamY: 0,
            surface: 'smooth'
        }
    }

    function key(pixel) {
        return `${pixel.position.x}:${pixel.position.y}`;
    }
}