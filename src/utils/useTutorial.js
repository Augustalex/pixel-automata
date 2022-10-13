import {FarmHumidityThreshold} from "@/utils/useDrawerState";
import {useGameState, pixels} from "@/gameState";
import {computed, ref, watch} from "vue";
import {calculateSeaLevel} from "@/systems/SimulateWaterSpread";

const canBuildFarmDone = ref(false);
const canBuildCityDone = ref(false);

export function useTutorial() {
    const gameState = useGameState();

    return {
        canBuildFarm: () => {
            if (canBuildFarmDone.value) return true;
            else {
                const seaLevel = calculateSeaLevel(gameState.info.humidity);
                canBuildFarmDone.value = seaLevel >= FarmHumidityThreshold;
                return canBuildFarmDone.value;
            }
        },
        canBuildCity: () => {
            if (canBuildCityDone.value) return true;
            else {
                canBuildCityDone.value = pixels.some(p => p.pixelType === 'farm');
                return canBuildCityDone.value;
            }
        }
    }
}