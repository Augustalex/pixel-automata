import {useGameClock} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";
import {fromCityToGrass, fromGrassToCity, transform} from "@/utils/transformers";

export function SimulateCities() {
    const time = useGameClock();

    let nextRun = 0;

    return {
        run
    };

    function run({delta, pixels}) {
        if (time.value < nextRun) return;
        nextRun = time.value + 1;

        const view = PixelDataView(pixels);

        const toMakeGrass = [];
        const farmCountByCityId = new Map();
        const cityTilesByCityId = new Map();

        for (let pixel of pixels) {
            if (pixel.pixelType === 'city') {
                const currentCities = cityTilesByCityId.get(pixel.cityId) || [];
                currentCities.push(pixel);
                cityTilesByCityId.set(pixel.cityId, currentCities);
            } else if (pixel.pixelType === 'farm') {
                const cityIds = new Set(view.getNeighbours(pixel, 12, p => 'city' === p.pixelType).map(c => c.cityId));
                for (let cityId of cityIds) {
                    const currentCount = farmCountByCityId.get(cityId) || 0;
                    farmCountByCityId.set(cityId, currentCount + 1);
                }
            }
        }

        for (let cityId of cityTilesByCityId.keys()) {
            const tiles = cityTilesByCityId.get(cityId);
            const farmRequirement = tiles.reduce((acc, v) => acc + farmRequirementByCityLevel(v.cityLevel), 0);
            const farmCount = farmCountByCityId.get(cityId) || 0;

            if (farmCount < farmRequirement) {
                const sortedTiles = tiles.sort((a, b) => a.cityLevel - b.cityLevel);

                let tally = 0;
                for (let t of sortedTiles) {
                    if (t.cityLevel > 1) continue;

                    tally += farmRequirementByCityLevel(t.cityLevel);
                    if (tally >= farmRequirement - farmCount) {
                        break;
                    }

                    toMakeGrass.push(t);
                }
            }
        }

        // for (let pixel of pixels) {
        //     if (pixel.pixelType === 'grass') {
        //         if (Math.random() >= .2) continue;
        //
        //         const cities = view.getNeighbours(pixel, 3, p => 'city' === p.pixelType);
        //         if (cities.length === 0) continue;
        //
        //         const cityId = cities[Math.round(Math.random() * (cities.length - 1))].cityId;
        //         const nearbyCities = cities.filter(c => c.cityId === cityId);
        //
        //         const tiles = cityTilesByCityId.get(cityId);
        //         const farmRequirement = tiles.reduce((acc, v) => acc + farmRequirementByCityLevel(v.cityLevel), 0);
        //         const farmCount = farmCountByCityId.get(cityId) || 0;
        //
        //         if (farmCount > farmRequirement) {
        //             for (let nearbyCity of nearbyCities) {
        //                 nearbyCity.cityLevel += 1;
        //             }
        //             fromGrassToCity(pixel);
        //             pixel.cityId = cityId;
        //         }
        //     }
        // }

        // for (let toMakeCity of toMakeCities) {
        //     fromGrassToCity(toMakeCity);
        // }

        for (let toGrass of toMakeGrass) {
            transform(toGrass, 'zone');

            const cities = view.getNeighbours(toGrass, 3, p => 'city' === p.pixelType);
            for (let city of cities) {
                city.cityLevel = Math.max(0, city.cityLevel - 1);
            }
        }
    }

    function farmRequirementByCityLevel(cityLevel) {
        if (cityLevel <= 2) {
            return 1;
        } else if (cityLevel <= 5) {
            return 2;
        }
        return 3;
    }

}