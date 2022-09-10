import {PipeSystem} from "@/systems/PipeSystem";
import {PixelDataView} from "@/utils/pixelDataView/PixelDataView";
import {_PixelDataView, createPixelMapFromGrid} from "@/utils/pixelDataView/_PixelDataView";
import {LayerItems} from "@/utils/transformers";

jest.mock("@/utils/pixelDataView/PixelDataView", () => ({PixelDataView: jest.fn()}));

it('Pipes distribute waste with nearby pipes', () => {
    const {pixels, map} = setupMap([
        [pipe(0), pipe(0), pipe(0), pipeInWater()],
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10, WATER_MAX_POLLUTION: 100});

    pipeSystem.run({delta: 1, pixels});

    matchLevels(viewPipeNeed(map), [
        [10, 10, 10, 10],
    ]);
})

it('Pulls pollution when has need', () => {
    const {pixels, map} = setupMap([
        [pollutedCityTile(100), pipe(0), pipe(0), pipe(0), pipeInWater()],
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10, WATER_MAX_POLLUTION: 100});

    pipeSystem.run({delta: 1, pixels});
    pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});
    // pipeSystem.run({delta: 1, pixels});

    // matchLevels(viewPipeNeed(map), [
    //     [10,10,10,10,10],
    // ]);
    matchLevels(viewPipePollution(map), [
        [0,0,10,0,10],
    ]);
    matchLevels(viewPollution(map), [
        [70,0,0,0,10],
    ]);
})

function matchLevels(levels, expected) {
    expect(levels.map(row => row.map(l => Math.round(l * 10) / 10))).toEqual(expected);
}

function viewPollution(map) {
    return map.map(row => row.map(p => p.pollution ? p.pollution.level : 0));
}

function viewPipePollution(map) {
    return map.map(row => row.map(p => p.layer1 ? p.layer1.pollutionLevel : 0));
}

function viewPipeNeed(map) {
    return map.map(row => row.map(p => p.layer1 ? p.layer1.pollutionNeed : 0));
}

function setupMap(map) {
    const pixelMap = createPixelMapFromGrid(map)
    const pixelDataView = _PixelDataView({pixelMap, WorldWidth: 3});

    PixelDataView.mockReturnValue(pixelDataView);

    const pixels = fromGridToPixels(map);

    return {pixels, map};
}

function fromGridToPixels(grid) {
    const pixels = [];
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const pixel = row[x];
            pixel.position = {x, y};
            pixels.push(pixel);
        }
    }

    return pixels;
}

function pollutedTile() {
    return {
        pixelType: 'grass',
        pollution: {level: 1},
    };
}

function pollutedCityTile(pollution) {
    return {
        pixelType: 'city',
        pollution: {level: pollution},
    };
}

function pipeInWater() {
    return {
        pixelType: 'water',
        pollution: {level: 0},
        layer1: {
            item: LayerItems.Pipe,
            pollutionLevel: 0
        }
    };
}

function pipe(pollution = 0) {
    return {
        pixelType: 'grass',
        layer1: {
            item: LayerItems.Pipe,
            pollutionLevel: pollution
        }
    }
}