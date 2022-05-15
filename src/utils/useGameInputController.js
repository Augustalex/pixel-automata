import {TileSize} from "@/utils/constants";
import {useViewOffset} from "@/utils/useViewOffset";
import {ref} from "vue";
import {useGameState} from "@/gameState";
import {useGridController} from "@/gridController";
import {useHorizontalRotateAction} from "@/utils/useHorizontalRotateAction";

let mouseMoving = ref(null);
const scrollTime = 3000;

export function useGameInputController({target}) {
    const gameState = useGameState();
    const gridController = useGridController();
    const viewOffset = useViewOffset();
    const keysDown = new Set();
    const rotateAction = useHorizontalRotateAction();

    let lastX = ref(0);
    let lastY = ref(0);
    let lastTile = ref(null);

    return {
        start,
        stop,
        update
    };

    function update({delta, now}) {
        if (mouseMoving.value) {
            if (mouseMoving.value.time > now) {
                const progress = (mouseMoving.value.time - now) / scrollTime;
                rotateAction.rotate((mouseMoving.value.x > 0 ? 1 : -1) * mouseMoving.value.speed * Math.min(1, Math.max(0, progress)), Date.now() + 2000);
            }
        }

        if (anyKeyDown(['ArrowLeft', 'a', 'A'])) {
            rotateAction.rotate(1, now + 250);
        } else if (anyKeyDown(['ArrowRight', 'd', 'D'])) {
            rotateAction.rotate(-1, now + 250);
        }
    }

    function hoveredTile() {
        return lastTile;
    }

    function keyDown(key) {
        return keysDown.has(key);
    }

    function anyKeyDown(keys) {
        return keys.some(k => keysDown.has(k));
    }


    function start() {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp)
        target.value.addEventListener('mousemove', onMouseMove);
        target.value.addEventListener('mousedown', onMouseDown);
    }

    function stop() {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp)
        target.value.removeEventListener('mousemove', onMouseMove);
        target.value.removeEventListener('mousedown', onMouseDown);
    }

    function onKeyDown(e) {
        keysDown.add(e.key);
    }

    function onKeyUp(e) {
        keysDown.delete(e.key);
    }

    function onMouseMove(e) {
        const preX = e.offsetX - viewOffset.get().value;
        const postX = preX < 0 ? viewOffset.worldLength() + preX : preX;
        const newX = Math.round((postX) / TileSize);
        const offsetX = newX;
        const offsetY = Math.floor(e.offsetY / TileSize);

        if (offsetX !== lastX.value || offsetY !== lastY.value) {
            const tileAtPosition = gameState.pixels.find(p => {
                return p.position.x === offsetX && p.position.y === offsetY;
            });
            lastTile.value = tileAtPosition;
        }

        lastX.value = offsetX;
        lastY.value = offsetY;

        if (e.buttons === 1) {
            gridController.onTileClicked(lastTile.value);
        } else if (e.buttons === 2) {
            const speed = Math.max(0, Math.min(1, Math.abs(e.movementX) / 100)) * 2;
            mouseMoving.value = {speed, x: e.movementX, time: Date.now() + scrollTime};
            rotateAction.rotate((e.movementX > 0 ? 1 : -1) * speed, Date.now() + 250)
        }
    }

    function onMouseDown(e) {
        if (e.buttons === 1 && lastTile.value) {
            gridController.onTileClicked(lastTile.value);
        }
    }
}