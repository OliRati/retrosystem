import { calculatorWindow } from "./calculator.js";

import {
    createWindow,
    removeWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
} from "./windows.js";

/* Currently shown menu */

let menuEarthShown = false;
let menuConfigShown = false;
let menuViewShown = false;
let menuAboutShown = false;

/* Selected item in config menu - default is Ordered transition */

let selectedChecklist = 2;

/*
 * Main menu fonctionality implementation
 */

function adjustMenuStates(i) {
    if ((i != 0) && menuEarthShown) {
        menuEarthShown = false;
        document.getElementById("earthbox").style.display = "none";
    }

    if ((i != 1) && menuConfigShown) {
        menuConfigShown = false;
        document.getElementById("configbox").style.display = "none";
    }

    if ((i != 2) && menuViewShown) {
        menuViewShown = false;
        document.getElementById("viewbox").style.display = "none";
    }

    if ((i != 3) && menuAboutShown) {
        menuAboutShown = false;
        document.getElementById("aboutbox").style.display = "none";
    }
}

var menuEarth = document.getElementById("menuearth");
menuEarth.addEventListener("click", () => {
    menuEarthShown = !menuEarthShown;
    if (menuEarthShown) {
        document.getElementById("earthbox").style.display = "block";
        document.getElementById("earthbox").style.animation = "movemenu .4s forwards";
    }
    else
        document.getElementById("earthbox").style.display = "none";

    adjustMenuStates(0);
});

var menuConfig = document.getElementById("menuconfig");
menuConfig.addEventListener("click", () => {
    menuConfigShown = !menuConfigShown;
    if (menuConfigShown) {
        document.getElementById("configbox").style.display = "block";
        document.getElementById("configbox").style.animation = "movemenu .4s forwards";
    }
    else
        document.getElementById("configbox").style.display = "none";

    adjustMenuStates(1);
});

var menuView = document.getElementById("menuview");
menuView.addEventListener("click", () => {
    menuViewShown = !menuViewShown;
    if (menuViewShown) {
        document.getElementById("viewbox").style.display = "block";
        document.getElementById("viewbox").style.animation = "movemenu .4s forwards";
    }
    else
        document.getElementById("viewbox").style.display = "none";

    adjustMenuStates(2);
});

var menuAbout = document.getElementById("menuabout");
menuAbout.addEventListener("click", () => {
    menuAboutShown = !menuAboutShown;
    if (menuAboutShown) {
        document.getElementById("aboutbox").style.display = "block";
        document.getElementById("aboutbox").style.animation = "movemenu .4s forwards";
    }
    else
        document.getElementById("aboutbox").style.display = "none";

    adjustMenuStates(3);
});

/* Debugging tools */

let debugShown = false;
var menuShowDebug = document.getElementById("menuShowDebug");
menuShowDebug.addEventListener("click", () => {

    function debugAddNewWindow() {
        let width = Math.floor((Math.random() * 300) + 300);
        let height = Math.floor((Math.random() * 400) + 200);

        let newWin = createWindow("newWindow", "New " + winid, -1, -1, width, height, WINMASK_MOVABLE | WINMASK_CLOSABLE);

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
        let newWin = createWindow("debugWindow", "Debugging", -1, -1, 300, 400, WINMASK_MOVABLE | WINMASK_CLOSABLE, onCloseWindow);

        document.getElementById("debugAddNewWindow").addEventListener('click', debugAddNewWindow);
    }
    
    adjustMenuStates(-1);
});

let winid = 0;

let helpShown = false;
var menuHelp = document.getElementById("menuHelp");
menuHelp.addEventListener("click", () => {
    adjustMenuStates(-1);

    function onCloseWindow() {
        helpShown = false;
        return true;
    }

    if (!helpShown) {
        helpShown = true;
        let newWin = createWindow("helpWindow", "Help", -1, -1, 300, 400, WINMASK_MOVABLE | WINMASK_CLOSABLE, onCloseWindow);
        newSystemStatus("Help opened.");

        winid++;
    }
});

var menuViewCalculator = document.getElementById("menuViewCalculator");
menuViewCalculator.addEventListener("click", () => {
    adjustMenuStates(-1);

    calculatorWindow();
});

var menuCoche = [
    document.getElementById("menucoche0"),
    document.getElementById("menucoche1"),
    document.getElementById("menucoche2"),
    document.getElementById("menucoche3"),
    document.getElementById("menucoche4"),
    document.getElementById("menucoche5"),
    document.getElementById("menucoche6")];

function adjustChecklist(nb) {
    selectedChecklist = nb;

    for (let idx = 0; idx < menuCoche.length; idx++) {
        if (idx === selectedChecklist)
            menuCoche[idx].classList.replace("fa-square", "fa-square-check");
        else
            menuCoche[idx].classList.replace("fa-square-check", "fa-square");
    }
}

var menuNoTransition = document.getElementById("menunotransition");
var menuNoTransitionCoche = document.getElementById("menunotransitioncoche");
menuNoTransition.addEventListener("click", () => {
    adjustMenuStates(-1);

    adjustChecklist(0);
});

var menuRandomTransition = document.getElementById("menurandomtransition");
menuRandomTransition.addEventListener("click", () => {
    adjustMenuStates(-1);
    adjustChecklist(1);
});

var menuOrderedTransition = document.getElementById("menuorderedtransition");
menuOrderedTransition.addEventListener("click", () => {
    adjustMenuStates(-1);
    adjustChecklist(2);
});

var menuSloMoveTrnasition = document.getElementById("menuslowmovetransition");
menuSloMoveTrnasition.addEventListener("click", () => {
    adjustMenuStates(-1);
    adjustChecklist(3);
});

var menuRollonTransition = document.getElementById("menurollontransition");
menuRollonTransition.addEventListener("click", () => {
    adjustMenuStates(-1);
    adjustChecklist(4);
});

var menuRotateTransition = document.getElementById("menurotatetransition");
menuRotateTransition.addEventListener("click", () => {
    adjustMenuStates(-1);
    adjustChecklist(5);
});

var menuTurnTransition = document.getElementById("menuturntransition");
menuTurnTransition.addEventListener("click", () => {
    adjustMenuStates(-1);
    adjustChecklist(6);
});

var menuEarthSystem = document.getElementById("menuearthsystem");
let aboutEarthSystemOpened = false;
menuEarthSystem.addEventListener("click", () => {
    adjustMenuStates(-1);

    if (!aboutEarthSystemOpened) {
        aboutEarthSystemOpened = true;
        let newWin = createWindow("aboutearthsystem", "About Earth System", 0, 0, 300, 350, 0);

        function closeAboutBox() {
            aboutEarthSystemOpened = false;
            document.getElementById("closeaboutearthsystem").removeEventListener("click", closeAboutBox);
            removeWindow(newWin);
        }

        document.getElementById("closeaboutearthsystem").addEventListener("click", closeAboutBox);
    }
});

var menuLogout = document.getElementById("menulogout");
menuLogout.addEventListener("click", () => {
    adjustMenuStates(-1);
});

/* Deactivate menu when clicking outside */

background.addEventListener("click", () => {
    if (menuEarthShown || menuConfigShown || menuViewShown || menuAboutShown)
        adjustMenuStates(-1);
});

var footerFrame = document.getElementById("footer");
footerFrame.addEventListener("click", () => {
    if (menuEarthShown || menuConfigShown || menuViewShown || menuAboutShown)
        adjustMenuStates(-1);
});

/* Add window to desktop */

const window1 = createWindow("helloWindow", "Hello", 25, 25, 250, 350);

const window2 = createWindow("worldWindow", "World", 75, 75, 250, 350);

/* ClickMe Window creation and interface for Click me button */

const window6 = createWindow("clickmeWindow", "ClickMe", 125, 125, 250, 350, WINMASK_MOVABLE);

let color = 0;

let changecolor = document.getElementById("changeColorClickWindow");
let exitwindow = document.getElementById("exitClickWindow");

function doChangeColor() {
    color++;
    if (color == 1)
        document.getElementById("demo").style.color = 'red';
    else if (color == 2)
        document.getElementById("demo").style.color = 'green';
    else if (color == 3) {
        color = 0;
        document.getElementById("demo").style.color = 'blue';
    }
}

changecolor.addEventListener('click', doChangeColor);

function exitClickWindow() {
    changecolor.removeEventListener('click', doChangeColor);
    exitwindow.removeEventListener('click', exitClickWindow);

    removeWindow(window6);
}

exitwindow.addEventListener('click', exitClickWindow);
