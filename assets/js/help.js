import {
    createWindow,
    newSystemStatus,
    WINMASK
} from "./windows.js";

let helpShown = false;

function helpWindow() {
    function onCloseWindow() {
        helpShown = false;
        return true;
    }

    if (!helpShown) {
        helpShown = true;
        let newWin = createWindow("helpWindow", "Help", -1, -1, 300, 400, WINMASK.MOVABLE | WINMASK.CLOSABLE, onCloseWindow);
        newSystemStatus("Help opened.");
    }
}

export { helpWindow };
