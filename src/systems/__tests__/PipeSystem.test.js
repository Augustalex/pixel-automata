import {PipeSystem} from "@/systems/PipeSystem";
import {PixelDataView} from "@/utils/pixelDataView/PixelDataView";
import {_PixelDataView, createPixelMapFromGrid} from "@/utils/pixelDataView/_PixelDataView";
import {LayerItems} from "@/utils/transformers";

jest.mock("@/utils/pixelDataView/PixelDataView", () => ({PixelDataView: jest.fn()}));

it('Pipes siphen pollution from grass tiles', () => {
    const {pixels, map} = setupMap([
        [pollutedTile(), pollutedTile(), pollutedTile()],
        [pollutedTile(), pipe(), pollutedTile()],
        [pollutedTile(), pollutedTile(), pollutedTile()]
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10});

    pipeSystem.run({delta: 1, pixels});

    expect(viewPollution(map)).toEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]);
})

it('Pipes siphen pollution from nearby city tiles', () => {
    const {pixels, map} = setupMap([
        [pollutedCityTile(), pollutedCityTile(), pollutedCityTile()],
        [pollutedCityTile(), pipe(), pollutedCityTile()],
        [pollutedCityTile(), pollutedCityTile(), pollutedCityTile()]
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10});

    pipeSystem.run({delta: 1, pixels});

    expect(viewPollution(map)).toEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]);
    matchLevels(viewPipePollution(map), [
        [0, 0, 0],
        [0, 8, 0],
        [0, 0, 0]
    ])
})

it('Pipes distribute waste with nearby pipes', () => {
    const {pixels, map} = setupMap([
        [pipe(1.2), pipe(0), pipe(0)],
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10});

    pipeSystem.run({delta: 1, pixels});

    matchLevels(viewPipePollution(map), [
        [0, 1.2, 0],
    ]);
})

it('Pipes dont distribute more than max limit', () => {
    const {pixels, map} = setupMap([
        [pipe(10), pipe(1), pipe(0)],
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10});

    pipeSystem.run({delta: 1, pixels});

    matchLevels(viewPipePollution(map), [
        [1, 10, 0],
    ]);
})

it('Pipes distribute evenly over time', () => {
    const {pixels, map} = setupMap([
        [pipe(10), pipe(1), pipe(0)],
    ]);
    const pipeSystem = PipeSystem({DRAW_RATE: 10});

    pipeSystem.run({delta: 1, pixels});
    pipeSystem.run({delta: 1, pixels});

    matchLevels(viewPipePollution(map), [
        [3, 4, 4],
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

function pollutedCityTile() {
    return {
        pixelType: 'city',
        pollution: {level: 1},
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