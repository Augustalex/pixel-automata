export {
    fromGrassToCity,
    fromGrassToDeadGrass,
    fromCityToGrass,
}

function fromCityToGrass(pixel) {
    pixel.pixelType = 'grass';
    pixel.age = 0;
    pixel.cityLevel = undefined;
}

function fromGrassToDeadGrass(pixel) {
    pixel.age = undefined;
    pixel.pixelType = 'dead-grass';
    pixel.water = 0;
}

function fromGrassToCity(pixel) {
    pixel.age = undefined;

    pixel.pixelType = 'city';
    pixel.cityId = `city-${Math.round(Math.random() * 9999)}${pixel.position.x}${pixel.position.y}`;
    pixel.variation = Math.round(Math.random() * 10);
    pixel.cityLevel = 0;
}