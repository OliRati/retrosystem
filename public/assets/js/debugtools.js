import {
    createWindow,
    newSystemStatus,
    WINMASK
} from "./windows.js";

let debugShown = false;
let winid = 0;

function debugToolsWindow() {
    function debugAddNewWindow() {
        let width = Math.floor((Math.random() * 300) + 300);
        let height = Math.floor((Math.random() * 400) + 200);

        let newWin = createWindow("newWindow", "New " + winid, -1, -1, width, height, WINMASK.MOVABLE | WINMASK.CLOSABLE);

        let content = newWin.getElementsByClassName("margincontainer");
        if (content.length > 0) {
            content[0].innerHTML = `
        <p class="title">New window size ` + width + `x` + height + `</p>
        `;
        }

        newSystemStatus("Window " + winid + " Created.");

        winid++;
    }

    function onCloseWindow() {
        debugShown = false;

        document.getElementById("debugAddNewWindow").removeEventListener('click', debugAddNewWindow);

        return true;
    }

    if (!debugShown) {
        debugShown = true;
        let newWin = createWindow("debugWindow", "Debugging", -1, -1, 300, 400, WINMASK.MOVABLE | WINMASK.CLOSABLE, onCloseWindow);

        document.getElementById("debugAddNewWindow").addEventListener('click', debugAddNewWindow);
    }
}

export { debugToolsWindow };