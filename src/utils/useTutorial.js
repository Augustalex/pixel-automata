import {FarmHumidityThreshold} from "@/utils/useDrawerState";
import {useGameState} from "@/gameState";
import {computed, ref, watch} from "vue";

const canBuildFarmDone = ref(false);
const canBuildCityDone = ref(false);

export function useTutorial() {
    const gameState = useGameState();

    return {
        canBuildFarm: () => {
            if (canBuildFarmDone.value) return true;
            else {
                canBuildFarmDone.value = gameState.info.humidity > FarmHumidityThreshold;
                return canBuildFarmDone.value;
            }
        },
        canBuildCity: () => {
            if (canBuildCityDone.value) return true;
            else {
                canBuildCityDone.value = gameState.pixels.some(p => p.pixelType === 'farm');
                return canBuildCityDone.value;
            }
        }
    }
}