import {FarmType, isFarm, isFarmType} from "@/utils/farmUtils";

export const LayerItems = {
    Pipe: 0,
    Tunnel: 1
}

export {
    fromGrassToCity, fromGrassToDeadGrass, fromCityToGrass, fromGrassToHumidifier, getTransformer, transform
}

function noop() {

}

function transform(pixel, toType) {
    const transformer = getTransformer(pixel, toType);
    if (transformer) {
        transformer(pixel);
    }
}

function getTransformer(pixel, toType) {
    if (toType === 'water') {
        if (pixel.pixelType === 'grass') {
            return fromGrassToWater;
        } else {
            return fromAnyToAny(toType);
        }
    }

    if (pixel.pixelType === 'grass') {
        if (isFarmType(toType)) {
            if (toType === FarmType.Mushrooms) {
                return fromAnyToMushrooms;
            }
            return fromAnyToAny(toType);
        }
        if (toType === 'water') {
            return fromGrassToWater;
        }
        if (toType === 'city') {
            return fromGrassToCity;
        }
        if (toType === 'humidifier') {
            return fromGrassToHumidifier;
        }
        if (toType === 'road') {
            return fromAnyToRoad;
        }
        if (toType === 'zone-city') {
            return zoneTransform(toType);
        }
        if (toType === 'sand') {
            return fromAnyToSand;
        }
    } else if (pixel.pixelType === 'sand') {
        if (toType === 'humidifier') {
            return fromGrassToHumidifier;
        }
        if (toType === 'grass') {
            return toGrass;
        }
        if (toType === 'water') {
            return () => standardTransform(pixel, 'water');
        }
        if (toType === 'road') {
            return fromAnyToRoad;
        }
    } else if (pixel.pixelType === 'water') {
        if (toType === 'grass') {
            return () => standardTransform(pixel, 'grass');
        }
        if (toType === 'sand') {
            return () => standardTransform(pixel, 'sand');
        }
    } else if (pixel.pixelType === 'humidifier') {
        if (toType === 'water') {
            return () => standardTransform(pixel, 'water');
        }
        if (toType === 'grass') {
            return () => standardTransform(pixel, 'grass');
        }
        if (toType === 'sand') {
            return fromAnyToSand;
        }
    } else if (isFarm(pixel)) {
        return () => standardTransform(pixel, toType);
    } else if (pixel.pixelType === 'zone') {
        if (toType === 'sand') {
            return fromAnyToSand;
        } else {
            return fromZoneToCity;
        }
    } else if (pixel.pixelType === 'city') {
        if (toType === 'zone') {
            return fromCityToZone;
        }
        if (toType === 'grass') {
            return () => standardTransform(pixel, toType);
        }
        if (toType === 'sand') {
            return fromAnyToSand;
        }
    } else if (pixel.pixelType === 'road') {
        if (toType === 'grass') {
            return toGrass;
        }
        if (toType === 'water' || toType === 'sand') {
            return () => standardTransform(pixel, toType);
        }
    }

    return null;
    // throw new Error('No implementation of transformer from ' + pixel.pixelType + ' to ' + toType);
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

function fromGrassToHumidifier(pixel) {
    pixel.age = undefined;

    standardTransform(pixel, 'humidifier');
    pixel.radius = 1;
    pixel.readyMeter = 0;
}

function toGrass(pixel) {
    pixel.age = 0;
    standardTransform(pixel, 'grass');
}

function standardTransform(pixel, toType) {
    pixel.pixelType = toType;
}

function fromAnyToAny(toType) {
    return (pixel) => {
        pixel.pixelType = toType;
    }
}

function fromAnyToMushrooms(pixel) {
    pixel.pixelType = FarmType.Mushrooms;
    pixel.life = 5;
}

function fromGrassToWater(pixel) {
    pixel.age = undefined;
    pixel.pixelType = 'water';
    pixel.subterrain = 'grass';
}

function fromCityToZone(pixel) {
    pixel.pixelType = 'zone';
    pixel.zoneType = 'city';
}

function fromAnyToRoad(pixel) {
    pixel.roadSurface = pixel.pixelType;

    standardTransform(pixel, 'road');
}

function fromAnyToSand(pixel) {
    standardTransform(pixel, 'sand');
}

function zoneTransform(toType) {
    return tile => {
        tile.pixelType = 'zone';
        tile.zoneType = toType.split('-')[1];
    }
}