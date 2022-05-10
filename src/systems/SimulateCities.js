import {useGameClock} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";
import {fromCityToGrass, fromGrassToCity, transform} from "@/utils/transformers";

export function SimulateCities() {
    const time = useGameClock();

    let nextRun = 0;
    let iterationId = 'a';

    return {
        run
    };

    function run({delta, pixels}) {
        if (time.value < nextRun) return;
        nextRun = time.value + 1;

        iterationId = iterationId === 'a' ? 'b' : 'a';

        let nextRoadId = 1;

        const view = PixelDataView(pixels);

        // const toMakeCities = [];
        const toMakeGrass = [];
        const farmCountByRoadNetwork = new Map();
        const cityTilesByCityId = new Map();

        for (let pixel of pixels) {
            if (pixel.pixelType !== 'road') continue;
            if (pixel.roadId) {
                if (pixel.roadId.startsWith(iterationId)) {
                    continue; // Already been assigned a road ID during this run
                }
            }

            assignIdsToRoadNetwork(pixel, `${iterationId}${nextRoadId++}`);
        }

        for (let pixel of pixels) {
            if (pixel.pixelType === 'city') {
                const currentCities = cityTilesByCityId.get(pixel.cityId) || [];
                currentCities.push(pixel);
                cityTilesByCityId.set(pixel.cityId, currentCities);
            } else if (pixel.pixelType === 'farm') {
                const roadsIds = new Set(view.getNeighbours(pixel, 12, p => 'road' === p.pixelType).map(p => p.roadId));
                for (let roadId of roadsIds) {
                    const currentCount = farmCountByRoadNetwork.get(roadId) || 0;
                    farmCountByRoadNetwork.set(roadId, currentCount + 1);
                }
            }
        }

        for (let pixel of pixels) {
            if (pixel.pixelType !== 'city') continue;
            const roadsIds = new Set(view.getNeighbours(pixel, 12, p => 'road' === p.pixelType).map(p => p.roadId));
            let totalFarms = 0;
            for (let roadId of roadsIds) {
                totalFarms += (farmCountByRoadNetwork.get(roadId) || 0);
            }

            const cityId = pixel.cityId;
            const tiles = cityTilesByCityId.get(cityId) || [];
            // const farmRequirement = tiles.reduce((acc, v) => acc + farmRequirementByCityLevel(v.cityLevel), 0);
            const farmRequirement = tiles.length;
            const farmCount = totalFarms;

            if (farmCount < farmRequirement) {
                const sortedTiles = tiles.sort((a, b) => a.cityLevel - b.cityLevel);

                let tally = 0;
                for (let t of sortedTiles) {
                    // if (t.cityLevel > 1) continue;

                    tally += 1;
                    if (tally >= (farmRequirement - farmCount)) {
                        break;
                    } else {
                        toMakeGrass.push(t);
                    }

                }
            } else if (farmCount > farmRequirement) {
                const grass = view.getNeighbours(pixel, 3, p => p.pixelType === 'grass');
                if (grass.length > 0) {
                    const anyGrass = grass[Math.round(Math.random() * (grass.length - 1))];
                    fromGrassToCity(anyGrass);
                    anyGrass.cityId = cityId;
                }
            }
        }

        for (let toGrass of toMakeGrass) {
            if (Math.random() > .5) continue;
            if (toGrass.pixelType !== 'city') continue;
            transform(toGrass, 'zone');

            const cities = view.getNeighbours(toGrass, 3, p => 'city' === p.pixelType);
            for (let city of cities) {
                city.cityLevel = Math.max(0, city.cityLevel - 1);
            }
        }

        function assignIdsToRoadNetwork(road, roadId) {
            if (!road.roadId || !road.roadId.startsWith(iterationId)) {
                road.roadId = roadId;
            }

            const nearbyRoads = view.getNeighbours(road, 5, p => p.pixelType === 'road');
            for (let nextRoad of nearbyRoads) {
                if (nextRoad.roadId && nextRoad.roadId.startsWith(iterationId)) {
                    continue;
                }

                assignIdsToRoadNetwork(nextRoad, roadId);
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