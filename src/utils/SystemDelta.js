
export function useSystemDelta(systemRunDelay) {
    let systemDelta = 0;

    return {_info, updateSystemDelta, canRunThisFrame, resetSystemDelta};

    function _info() {
        return {
            systemDelta,
            systemRunDelay
        }
    }

    function updateSystemDelta(delta) {
        systemDelta += delta;
    }

    function canRunThisFrame() {
        return systemDelta >= systemRunDelay;
    }

    function resetSystemDelta() {
        systemDelta = 0;
    }
}
