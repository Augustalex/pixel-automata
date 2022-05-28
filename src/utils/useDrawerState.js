import {useGameState, useGlobalGameClock} from "@/gameState";
import {computed, ref} from "vue";
import {FarmType, isFarm} from "@/utils/farmUtils";
import {Tech, useTechTree} from "@/utils/useTechTree";

export const FarmHumidityThreshold = .15;

const toolsUsedInfo = ref({});

export function useDrawerState() {
    const gameClock = useGlobalGameClock();
    const gameState = useGameState();
    const techTree = useTechTree();

    return {
        tools: computed(() => getTools()),
        toolsUsedInfo,
        toolUsed
    };

    function toolUsed(toolTitle) {
        const infos = toolsUsedInfo.value;
        const allTools = getTools(true);
        const cooldownTime = allTools.find(t => t.title === toolTitle).cooldownTime;
        infos[toolTitle] = gameClock.value + cooldownTime;
    }

    function getTools(showAll = false) {
        const cooldownInfos = toolsUsedInfo.value;
        const housingResearched = techTree.isResearched(Tech.HousingDomes, techTree.Branches.Urban);
        return [
            {
                title: 'humidifier',
                displayTitle: 'Humidifier',
                cooldownUntil: cooldownInfos['humidifier'] || 0,
                cooldownTime: 1.3,
            },
            techTree.isResearched(Tech.Grains, techTree.Branches.Farming) && {
                title: FarmType.Grain,
                displayTitle: 'Farm',
                cooldownUntil: cooldownInfos[FarmType.Grain] || 0,
                cooldownTime: .5,
            },
            techTree.isResearched(Tech.Mushrooms, techTree.Branches.Farming) && {
                title: FarmType.Mushrooms,
                displayTitle: 'Farm - Mushrooms',
                cooldownUntil: cooldownInfos[FarmType.Mushrooms] || 0,
                cooldownTime: 60,
            },
            housingResearched && {
                title: 'road',
                displayTitle: 'Road',
                cooldownUntil: cooldownInfos['road'] || 0,
                cooldownTime: .3,
            },
            housingResearched && {
                title: 'zone-city',
                displayTitle: 'City',
                cooldownUntil: cooldownInfos['zone-city'] || 0,
                cooldownTime: 60,
            },
            techTree.isResearched(Tech.RaiseLand, techTree.Branches.Terra) && {
                title: 'raise',
                displayTitle: 'Raise',
                cooldownUntil: cooldownInfos['raise'] || 0,
                cooldownTime: .1,
            },
            techTree.isResearched(Tech.Dig, techTree.Branches.Terra) && {
                title: 'dig',
                displayTitle: 'Dig',
                cooldownUntil: cooldownInfos['dig'] || 0,
                cooldownTime: .1,
            },
            {
                title: 'pipe',
                displayTitle: 'Pipes',
                cooldownUntil: cooldownInfos['pipe'] || 0,
                cooldownTime: 1.3,
            },
        ].filter(i => !!i);
    }
}