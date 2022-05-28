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
        const canBuildFarm = showAll || gameState.info.humidity > FarmHumidityThreshold;
        const canBuildCity = showAll || gameState.pixels.some(p => p.pixelType === 'farm');
        const cooldownInfos = toolsUsedInfo.value;
        const housingResearched = techTree.isResearched(Tech.HousingDomes, techTree.Branches.Urban);

        const items = [
            {
                title: 'humidifier',
                displayTitle: 'Humidifier',
                cooldownUntil: cooldownInfos['humidifier'] || 0,
                cooldownTime: 1.3,
            }
        ];

        if (techTree.isResearched(Tech.RaiseLand, techTree.Branches.Terra))
            items.push({
                title: 'raise',
                displayTitle: 'Raise',
                cooldownUntil: cooldownInfos['raise'] || 0,
                cooldownTime: .1,
            });
        if (techTree.isResearched(Tech.Dig, techTree.Branches.Terra))
            items.push({
                title: 'dig',
                displayTitle: 'Dig',
                cooldownUntil: cooldownInfos['dig'] || 0,
                cooldownTime: .1,
            });

        if (techTree.isResearched(Tech.Pipes, techTree.Branches.Urban))
            items.push({
                title: 'pipe',
                displayTitle: 'Pipes',
                cooldownUntil: cooldownInfos['pipe'] || 0,
                cooldownTime: 1.3,
            });

        if (canBuildFarm) {
            if (techTree.isResearched(Tech.Grains, techTree.Branches.Farming))
                items.push({
                    title: FarmType.Grain,
                    displayTitle: 'Farm',
                    cooldownUntil: cooldownInfos[FarmType.Grain] || 0,
                    cooldownTime: .5,
                })
            if (techTree.isResearched(Tech.Mushrooms, techTree.Branches.Farming))
                items.push(
                    {
                        title: FarmType.Mushrooms,
                        displayTitle: 'Farm - Mushrooms',
                        cooldownUntil: cooldownInfos[FarmType.Mushrooms] || 0,
                        cooldownTime: 60,
                    }
                )
        }
        if (canBuildCity) {
            if (housingResearched) {
                items.push(
                    {
                        title: 'road',
                        displayTitle: 'Road',
                        cooldownUntil: cooldownInfos['road'] || 0,
                        cooldownTime: .3,
                    },
                    {
                        title: 'zone-city',
                        displayTitle: 'City',
                        cooldownUntil: cooldownInfos['zone-city'] || 0,
                        cooldownTime: 60,
                    }
                );
            }
        }

        return items.filter(i => !!i);
    }
}