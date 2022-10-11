import {useNotifications} from "@/utils/useNotifications";
import {useTechTree} from "@/utils/useTechTree";

export function ResearchSystem() {
    const techTree = useTechTree();
    const notifications = useNotifications();

    return {
        run,
        systemDelta: null,
    };

    function run({delta}) {
        const branches = [
            techTree.terraTech,
            techTree.urbanTech,
            techTree.farmingTech
        ];

        for (let branch of branches) {
            branch.value = branch.value.map(tech => {
                if (tech.researching) {
                    tech.researchProgress += delta * 10;
                    if (tech.researchProgress > tech.researchTime) {
                        tech.researched = true;
                        tech.researching = false;
                        delete tech.researchProgress;
                    }
                }
                return tech;
            });
        }
    }
}