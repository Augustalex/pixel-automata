import {useGameClock, useGameState} from "@/gameState";
import {computed} from "vue";

let _cacheByClockTime = null;

export function useCities() {
    const state = useGameState();
    const time = useGameClock();

    return computed(() => {
        if (_cacheByClockTime && _cacheByClockTime[0] === time.value) return _cacheByClockTime[1];

        const tilesByCityId = new Map();
        for (const pixel of state.pixels) {
            if (pixel.pixelType === 'city') {
                const currentCities = tilesByCityId.get(pixel.cityId) || [];
                currentCities.push(pixel);
                tilesByCityId.set(pixel.cityId, currentCities);
            }
        }

        const dataByCity = new Map();
        for (let cityId of tilesByCityId.keys()) {
            const tiles = tilesByCityId.get(cityId);
            let population = 0;
            let maxLevel = 0;
            for (let tile of tiles) {
                if (tile.cityLevel > maxLevel) {
                    maxLevel = tile.cityLevel;
                }

                const level = tile.cityLevel + 1;
                population += 1000 * Math.pow(level, 2);
            }

            dataByCity.set(cityId, {maxLevel, population})
        }

        if (!_cacheByClockTime || _cacheByClockTime[0] !== time.value) {
            _cacheByClockTime = [time.value, dataByCity];
        }

        return dataByCity;
    });
}