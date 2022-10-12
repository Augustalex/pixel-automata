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
            let changed = false;
            for (const tech of branch.value) {
                if (tech.researching) {
                    changed = true;

                    tech.researchProgress += delta;
                    if (tech.researchProgress > tech.researchTime) {
                        tech.researched = true;
                        tech.researching = false;
                        delete tech.researchProgress;
                    }
                }
            }

            if(changed) {
                branch.value = [...branch.value]; // Shallow copy to trigger Vue reactive system
            }
        }
    }
}