import {ref} from "vue";

const _techTreeVisible = ref(false);
const _terraTech = ref([
    {title: 'Humidifier I', researched: true, researchTime: 10},
    {
        title: 'Humidifier II',
        researched: false, researchTime: 10
    },
    {title: 'Humidifier III', researched: false, researchTime: 10}
]);
const _urbanTech = ref([
    {title: 'City I', researched: false, researchTime: 10},
    {
        title: 'City II',
        researched: false, researchTime: 10
    },
    {title: 'City III', researched: false, researchTime: 10}
]);
const _farmingTech = ref([
    {title: 'Farms I', researched: false, researchTime: 10},
    {
        title: 'Farms II',
        researched: false, researchTime: 10
    },
    {title: 'Farms III', researched: false, researchTime: 10}
]);
const Terra = 'Terra';
const Urban = 'Urban';
const Farming = 'Farming';

export function useTechTree() {
    return {
        visible: _techTreeVisible,
        terraTech: _terraTech,
        urbanTech: _urbanTech,
        farmingTech: _farmingTech,
        toggle,
        show,
        hide,
        Branches: {
            Terra,
            Urban,
            Farming
        },
        getBranch,
        research
    };

    function getBranch(branch) {
        if (branch === Terra) {
            return _terraTech;
        } else if (branch === Urban) {
            return _urbanTech;

        } else if (branch === Farming) {
            return _farmingTech;
        }

        throw new Error('No tech branch by name: ' + branch);
    }

    function research(branch, title) {
        console.log('Research!', branch, title);
        const branchTech = getBranch(branch);

        branchTech.value = branchTech.value.map(tech => {
            if (tech.title === title) {
                tech.researching = true;
                tech.researchProgress = 0;
            }

            return tech;
        });
    }

    function toggle() {
        if (_techTreeVisible.value) {
            hide();
        } else {
            show();
        }
    }

    function show() {
        _techTreeVisible.value = true;
    }

    function hide() {
        _techTreeVisible.value = false;
    }
}