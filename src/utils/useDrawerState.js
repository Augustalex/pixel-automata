import {useGameState} from "@/gameState";
import {computed, ref} from "vue";

export const FarmHumidityThreshold = .15;

const toolsUsedInfo = ref({});

export function useDrawerState() {
    const gameState = useGameState();

    return {
        tools: computed(() => getTools()),
        toolsUsedInfo,
        toolUsed
    };

    function toolUsed(toolTitle) {
        const infos = toolsUsedInfo.value;
        const allTools = getTools(true);
        const cooldownTime = allTools.find(t => t.title === toolTitle).cooldownTime;
        infos[toolTitle] = Date.now() + cooldownTime;
    }

    function getTools(showAll = false) {
        const canBuildFarm = showAll || gameState.info.humidity > FarmHumidityThreshold;
        const canBuildCity = showAll || gameState.pixels.some(p => p.pixelType === 'farm');
        const builtFirstCity = showAll || gameState.pixels.some(p => p.pixelType === 'city' || p.pixelType === 'zone-city');
        const cooldownInfos = toolsUsedInfo.value;
        return [
            {
                title: 'humidifier',
                displayTitle: 'Humidifier',
                cooldownUntil: cooldownInfos['humidifier'] || 0,
                cooldownTime: 1300,
            },
            canBuildFarm && {
                title: 'farm',
                displayTitle: 'Farm',
                cooldownUntil: cooldownInfos['farm'] || 0,
                cooldownTime: 500,
            },
            canBuildCity && {
                title: 'road',
                displayTitle: 'Road',
                cooldownUntil: cooldownInfos['road'] || 0,
                cooldownTime: 300,
            },
            canBuildCity && {
                title: 'zone-city',
                displayTitle: 'City',
                cooldownUntil: cooldownInfos['zone-city'] || 0,
                cooldownTime: 10000,
            },
            builtFirstCity && {
                title: 'dig',
                displayTitle: 'Dig',
                cooldownUntil: cooldownInfos['dig'] || 0,
                cooldownTime: 100,
            },
            builtFirstCity && {
                title: 'raise',
                displayTitle: 'Raise',
                cooldownUntil: cooldownInfos['raise'] || 0,
                cooldownTime: 100,
            }
        ].filter(i => !!i);
    }
}