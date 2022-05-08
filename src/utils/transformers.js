export {
    fromGrassToCity, fromGrassToDeadGrass, fromCityToGrass, fromGrassToHumidifier, transform
}

function transform(pixel, toType) {
    getTransformer(pixel, toType)(pixel);
}

function getTransformer(pixel, toType) {
    if (toType === 'water') {
        return () => standardTransform(pixel, toType);
    }

    if (pixel.pixelType === 'grass') {
        if (toType === 'water') {
            return fromGrassToWater;
        }
        if (toType === 'city') {
            return fromGrassToCity;
        }
        if (toType === 'farm') {
            return fromGrassToFarm;
        }
        if (toType === 'humidifier') {
            return fromGrassToHumidifier;
        }
    } else if (pixel.pixelType === 'sand') {
        if (toType === 'humidifier') {
            return fromGrassToHumidifier;
        }
        if (toType === 'grass') {
            return fromSandToGrass;
        }
        if (toType === 'water') {
            return () => standardTransform(pixel, 'water');
        }
    } else if (pixel.pixelType === 'humidifier') {
        if (toType === 'water') {
            return () => standardTransform(pixel, 'water');
        }
        if (toType === 'grass') {
            return () => standardTransform(pixel, 'grass');
        }
    } else if (pixel.pixelType === 'farm') {
        return () => standardTransform(pixel, toType);
    } else if (pixel.pixelType === 'zone') {
        return fromZoneToCity;
    } else if (pixel.pixelType === 'city') {
        if (toType === 'zone') {
            return fromCityToZone;
        }
    }

    throw new Error('No implementation of transformer from ' + pixel.pixelType + ' to ' + toType);
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

function fromZoneToCity(pixel) {
    pixel.pixelType = 'city';
    pixel.cityId = `city-1`;
    pixel.variation = Math.round(Math.random() * 10);
    pixel.cityLevel = 0;
}

function fromGrassToFarm(pixel) {
    pixel.pixelType = 'farm';
    pixel.water = 0;
    pixel.age = undefined;
    pixel.variation = 0;
}

function fromGrassToHumidifier(pixel) {
    pixel.age = undefined;

    standardTransform(pixel, 'humidifier');
    pixel.radius = 1;
    pixel.readyMeter = 0;
}

function fromSandToGrass(pixel) {
    pixel.age = 0;
    standardTransform(pixel, 'grass');
}

function standardTransform(pixel, toType) {
    pixel.pixelType = toType;
}

function fromGrassToWater(pixel) {
    pixel.age = undefined;
    pixel.pixelType = 'water';
}

function fromCityToZone(pixel) {
    pixel.pixelType = 'zone';
    pixel.zoneType = 'city';
}
