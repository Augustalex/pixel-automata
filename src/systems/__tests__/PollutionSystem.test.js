import {SimulatePollution} from "@/systems/SimulatePolution";
import {_PixelDataView, createPixelMapFromGrid} from "@/utils/pixelDataView/_PixelDataView";
import {LayerItems} from "@/utils/transformers";

jest.mock("@/utils/pixelDataView/PixelDataView");
jest.mock("@/gameState", () => jest.fn());
jest.mock("@/utils/useNotifications");

it('Moves pollution across water', () => {
    const map = [
        [pollutedTile(4), pollutedTile(0), pollutedTile(0)],
        [pollutedTile(0), pollutedTile(0), pollutedTile(0)],
        [pollutedTile(0), pollutedTile(0), pollutedTile(0)],
    ];
    const pixelMap = createPixelMapFromGrid(map);
    const pixelDataView = _PixelDataView({pixelMap, WorldWidth: 3});

    const pixels = fromGridToPixels(map);

    const pipeSystem = SimulatePollution({
        PixelDataView: () => pixelDataView,
        useGameState: () => ({info: {averageTemperature: 0}}),
        useNotifications: () => jest.fn(),
    }, {deterministic: true});

    pipeSystem.run({delta: 1, pixels});

    expect(viewPollution(map)).toEqual([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ]);
})

it('Moves pollution across water for long distances', () => {
    const map = [
        [pollutedTile(4), pollutedTile(0), pollutedTile(0), pollutedTile(0), pollutedTile(0), pollutedTile(0)],
    ];
    const pixelMap = createPixelMapFromGrid(map);
    const pixelDataView = _PixelDataView({pixelMap, WorldWidth: 3});

    const pixels = fromGridToPixels(map);

    const pipeSystem = SimulatePollution({
        PixelDataView: () => pixelDataView,
        useGameState: () => ({info: {averageTemperature: 0}}),
        useNotifications: () => jest.fn(),
    }, {deterministic: true});

    pipeSystem.run({delta: 1, pixels});
    pipeSystem.run({delta: 1, pixels});
    pipeSystem.run({delta: 1, pixels});

    expect(viewPollution(map)).toEqual([
        [1, 1, 1, 1, 1, 1],
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

function pollutedTile(pollutionLevel) {
    return {
        pixelType: 'water',
        pollution: {level: pollutionLevel},
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