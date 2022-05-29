import {useGameClock} from "@/gameState";
import {PixelDataView} from "@/utils/PixelDataView";
import {fromGrassToCity, LayerItems} from "@/utils/transformers";
import {useNotifications} from "@/utils/useNotifications";
import {isFarm, isMushroomsFarm} from "@/utils/farmUtils";
import {Tech, useTechTree} from "@/utils/useTechTree";

export function SimulateCities() {
    const view = PixelDataView();
    const time = useGameClock();
    const notifications = useNotifications();
    const techTree = useTechTree();

    let nextRun = 0;
    let iterationId = 'a';
    let loopCount = 0;
    let running = false;
    let lastComplainedAboutFood = 0;

    const farmCountByRoadNetwork = new Map();
    const cityTilesByCityId = new Map();

    return {
        run,
        running: () => running
    };

    function run({delta, now, pixels}) {
        running = true;
        // if (time.value < nextRun) return;
        // nextRun = time.value + 1;

        if (loopCount >= 3) {
            loopCount = 0;
            iterationId = iterationId === 'a' ? 'b' : 'a';
            if (iterationId === 'a') {
                farmCountByRoadNetwork.clear();
                cityTilesByCityId.clear();
                running = false;
            }
        }

        // const toMakeCities = [];

        if (loopCount === 0) {
            let nextRoadId = 1;

            for (let pixel of pixels) {
                if (isRoad(pixel)) {
                    if (pixel.roadId) {
                        if (pixel.roadId.startsWith(iterationId)) {
                            continue; // Already been assigned a road ID during this run
                        }
                    }

                    assignIdsToRoadNetwork(pixel, `${iterationId}${nextRoadId++}`);
                }
            }
        }

        if (loopCount === 1) {
            const cityDomesResearched = techTree.isResearched(Tech.CityDomes, techTree.Branches.Urban);

            for (let pixel of pixels) {
                if (pixel.pixelType === 'city') {
                    if (pixel.cityLevel === 0 && cityDomesResearched) {
                        const neighbours = view.getNeighbours(pixel, 3);
                        if (neighbours.every(n => n.pixelType === 'city')) {
                            pixel.cityLevel = 1;
                        }
                    }

                    const currentCities = cityTilesByCityId.get(pixel.cityId) || [];
                    currentCities.push(pixel);
                    cityTilesByCityId.set(pixel.cityId, currentCities);
                } else if (isFarm(pixel)) {
                    const roadsIds = new Set(view.getNeighbours(pixel, 12, isRoad).map(p => p.roadId));

                    pixel.connected = false;
                    for (let roadId of roadsIds) {
                        const currentCount = farmCountByRoadNetwork.get(roadId) || 0;
                        const farmResource = isMushroomsFarm(pixel) ? .5 : 1;
                        farmCountByRoadNetwork.set(roadId, currentCount + farmResource);

                        pixel.connected = true;
                    }
                }
            }
        }

        if (loopCount === 2) {
            const toMakeGrass = [];

            for (const cityId of cityTilesByCityId.keys()) {
                let farmRequirement = 0;
                const cityTiles = cityTilesByCityId.get(cityId);
                const roadsIds = new Set();
                for (let cityTile of cityTiles) {
                    farmRequirement += farmRequirementByCityLevel(cityTile);
                    roadsIds.add(...view.getNeighbours(cityTile, 12, isRoad).map(p => p.roadId));
                }

                let totalFarms = 0;
                for (let roadId of roadsIds) {
                    totalFarms += (farmCountByRoadNetwork.get(roadId) || 0);
                }

                const farmCount = totalFarms;

                if (farmCount < farmRequirement) {
                    let tally = 0;
                    for (let t of cityTiles) {
                        tally += 1;
                        if (tally >= (farmRequirement - farmCount)) {
                            break;
                        } else {
                            // t.tag = Tags.MakeZone;
                            // t.iteration = iterationId;
                            toMakeGrass.push(t);
                        }
                    }
                } else if (farmCount > farmRequirement + 1) {
                    const randomTiles = cityTiles.slice();
                    shuffleArray(randomTiles);

                    for (let cityTile of randomTiles) {
                        const grass = view.getNeighbours(cityTile, 3, p => p.pixelType === 'grass');
                        if (grass.length > 0) {
                            const anyGrass = grass[Math.round(Math.random() * (grass.length - 1))];
                            fromGrassToCity(anyGrass);
                            anyGrass.cityId = cityId;

                            break;
                        }
                    }
                }
            }

            if (toMakeGrass.length > 3) {
                const dateNow = time.value;
                if (dateNow - lastComplainedAboutFood > 5 * 60) {
                    const settlementNotification = notifications.getNotifications()['settlement'];
                    if (!settlementNotification || (dateNow - settlementNotification) > 60) {
                        notifications.starving();
                        lastComplainedAboutFood = dateNow;
                    }
                }
            }
            // for (let toGrass of toMakeGrass) {
            //     if (Math.random() > .5) continue;
            //     if (toGrass.pixelType !== 'city') continue;
            //     transform(toGrass, 'zone');
            //
            //     const cities = view.getNeighbours(toGrass, 3, p => 'city' === p.pixelType);
            //     for (let city of cities) {
            //         city.cityLevel = Math.max(0, city.cityLevel - 1);
            //     }
            // }
        }

        function assignIdsToRoadNetwork(road, roadId) {
            if (!road.roadId || !road.roadId.startsWith(iterationId)) {
                road.roadId = roadId;
            }

            const nearbyRoads = view.getNeighbours(road, 5, isRoad);
            for (let nextRoad of nearbyRoads) {
                if (nextRoad.roadId && nextRoad.roadId.startsWith(iterationId)) {
                    continue;
                }

                assignIdsToRoadNetwork(nextRoad, roadId);
            }
        }

        loopCount += 1;
    }

    function farmRequirementByCityLevel(cityLevel) {
        if (cityLevel >= 1) {
            return 2;
        }
        return 1;
    }

}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function isRoad(pixel) {
    return pixel.pixelType === 'road' || (pixel.layer2 && pixel.layer2.item === LayerItems.Tunnel);
}