export function createPixelMapFromGrid(grid) {
    const map = new Map();

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            map.set(pixelMapKey(x, y), row[x]);
        }
    }

    return map;
}

export function pixelMapKey(x, y) {
    return `${x}:${y}`;
}

export function _PixelDataView({pixelMap, WorldWidth}) {

    return {
        getNeighbours,
        getNeighboursCircular,
    }

    function getNeighbours(pixel, radius, checkFn = () => true) {
        return _getNeighbours(pixel.position.x, pixel.position.y, radius)
            .map(key => pixelMap.get(key))
            .filter(p => p && p !== pixel && checkFn(p));
    }

    function getNeighboursCircular(pixel, radius, checkFn) {
        return _getNeighboursCircular(pixel.position.x, pixel.position.y, radius)
            .map(key => pixelMap.get(key))
            .filter(p => p && checkFn(p));
    }

    function _getNeighbours(ox, oy, diameter) {
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

    function _getNeighboursCircular(ox, oy, diameter) {
        const startRadius = Math.floor(diameter / 2);
        const endRadius = Math.ceil(diameter / 2) - 1;
        const maxDistance = Math.abs(Math.pow((ox + diameter / 2) - ox, 2) + Math.pow((oy + diameter / 2) - oy, 2)) * .5;

        const n = [];
        for (let y = oy - startRadius; y <= oy + endRadius; y++) {
            for (let x = ox - startRadius; x <= ox + endRadius; x++) {
                const distance = Math.abs(Math.pow(x - ox, 2) + Math.pow(y - oy, 2));
                const wrappedX = x < 0 ? (WorldWidth + x) : x % WorldWidth;
                if (distance < maxDistance) {
                    n.push(`${wrappedX}:${y}`);
                }
            }
        }

        return n;
    }
}
