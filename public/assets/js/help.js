import {
    createWindow,
    bringWindowTopmost,
    newSystemStatus,
    WINMASK
} from "./windows.js";

let helpWindowHandle = undefined;

function helpWindow() {
    if (helpWindowHandle != undefined) {
        bringWindowTopmost(helpWindowHandle);
        return;
    }

    function onCloseWindow() {
        helpWindowHandle = undefined;
        return true;
    }

    helpWindowHandle = createWindow("helpWindow", "Help", -1, -1, 300, 400, WINMASK.MOVABLE | WINMASK.CLOSABLE, onCloseWindow);
    newSystemStatus("Help opened.");
}

export { helpWindow };
