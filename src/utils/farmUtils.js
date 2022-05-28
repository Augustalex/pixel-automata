export const FarmType = {
    Grain: 'farm',
    Mushrooms: 'farm-mushrooms',
};

export {
    isFarm,
    isFarmType,
    isGrainsFarm,
    isMushroomsFarm
}

function isFarm(pixel) {
    return pixel.pixelType.startsWith('farm');
}

function isFarmType(pixelType) {
    return pixelType.startsWith('farm');
}

function isGrainsFarm(pixel) {
    return pixel.pixelType === FarmType.Grain;
}

function isMushroomsFarm(pixel) {
    return pixel.pixelType === FarmType.Mushrooms;
}