import {
    createWindow,
    removeWindow,
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

    helpWindowHandle = createWindow("helpWindow", "Help", -1, -1, 300, 400, WINMASK.MOVABLE | WINMASK.CLOSABLE, onCloseWindow);
    newSystemStatus("Help opened.");

    const closeButton = document.getElementById("helpCloseButton");
    closeButton.addEventListener('click', exitClickCloseButton);

    function exitClickCloseButton() {
        removeWindow(helpWindowHandle);
    }

    function onCloseWindow() {
        closeButton.removeEventListener('click', exitClickCloseButton);
        helpWindowHandle = undefined;
        return true;
    }
}

export { helpWindow };
