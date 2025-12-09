import {
    createWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
} from "./windows.js";

let helpShown = false;

function helpWindow() {
    function onCloseWindow() {
        helpShown = false;
        return true;
    }

    if (!helpShown) {
        helpShown = true;
        let newWin = createWindow("helpWindow", "Help", -1, -1, 300, 400, WINMASK_MOVABLE | WINMASK_CLOSABLE, onCloseWindow);
        newSystemStatus("Help opened.");
    }
}

export { helpWindow };
