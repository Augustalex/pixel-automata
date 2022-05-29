import {ref} from "vue";

export const Tech = {
    Grains: 'Grains',
    Mushrooms: 'Marshrooms',
    HousingPods: 'Housing Domes',
    RaiseLand: 'Raise Land',
    Dig: 'Excavate Land',
    Humidifier: 'Humidifier',
    Pipes: 'Waste pipes',
    CityDomes: 'City Domes',
    UndergroundHighway: 'Underground Highways'
}

const _techTreeVisible = ref(false);
const _terraTech = ref([
    {title: Tech.Humidifier, researched: true, researchTime: 5},
    {title: Tech.RaiseLand, researched: false, researchTime: 10},
    {
        title: Tech.Dig,
        researched: false, researchTime: 20
    },
]);
const _urbanTech = ref([
    {title: Tech.HousingPods, researched: true, researchTime: 5},
    {
        title: Tech.Pipes,
        researched: false, researchTime: 10
    },
    {title: Tech.CityDomes, researched: false, researchTime: 20},
    {title: Tech.UndergroundHighway, researched: false, researchTime: 30}
]);
const _farmingTech = ref([
    {title: Tech.Grains, researched: true, researchTime: 5},
    {
        title: Tech.Mushrooms,
        researched: false, researchTime: 20
    },
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
        research,
        isResearched
    };

    function isResearched(tech, branchName) {
        return getBranch(branchName).value.find(t => t.title === tech).researched;
    }

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