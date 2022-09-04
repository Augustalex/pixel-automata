import {useNotifications} from "@/utils/useNotifications";
import {useTechTree} from "@/utils/useTechTree";

export function ResearchSystem() {
    const techTree = useTechTree();
    const notifications = useNotifications();
    let running = false;

    return {
        run,
        running: () => running,
        alwaysRun: true,
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
                    tech.researchProgress += delta * 1000;
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