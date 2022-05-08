export function PixelDataView(pixels) {
    const pixelMap = new Map();
    const countByType = new Map();

    for (let pixel of pixels) {
        pixelMap.set(key(pixel), pixel);

        const pixelType = pixel.pixelType;
        countByType[pixelType] = countByType[pixelType] || 0;
        countByType[pixelType] += 1;
    }

    return {
        getNeighbours,
        getNeighboursCircular,
        count
    }

    function count(pixelType) {
        return countByType[pixelType] || 0;
    }

    function getNeighbours(pixel, radius, checkFn) {
        return _getNeighbours(pixel.position.x, pixel.position.y, radius)
            .map(key => pixelMap.get(key))
            .filter(p => p && checkFn(p));
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
                n.push(`${x}:${y}`);
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
                if (distance < maxDistance) {
                    n.push(`${x}:${y}`);
                }
            }
        }

        return n;
    }

    function key(pixel) {
        return `${pixel.position.x}:${pixel.position.y}`;
    }
}
