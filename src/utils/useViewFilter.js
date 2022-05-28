import {ref} from "vue";

const pollutionView = ref(true);
const heightMap = ref(true);
const pixelVariation = ref(true);
const pipeView = ref(false);

export function useViewFilter() {
    return {
        pollutionView,
        heightMap,
        pixelVariation,
        pipeView
    }
}