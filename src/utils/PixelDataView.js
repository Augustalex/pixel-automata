export function PixelDataView(pixels) {
    const pixelMap = new Map();

    for (let pixel of pixels) {
        pixelMap.set(key(pixel), pixel);
    }

    return {
        getNeighbours
    }

    function getNeighbours(pixel, radius, checkFn) {
        return _getNeighbours(pixel.position.x, pixel.position.y, radius)
            .map(key => pixelMap.get(key))
            .filter(p => p && checkFn(p));
    }

    function _getNeighbours(ox, oy, diameter) {
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

    function key(pixel) {
        return `${pixel.position.x}:${pixel.position.y}`;
    }
}