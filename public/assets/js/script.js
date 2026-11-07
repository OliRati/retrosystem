import { getApplication, registerApplication } from "./appregistry.js";
import { calculatorWindow } from "./calculator.js";
import { debugToolsWindow } from "./debugtools.js";
import { helpWindow } from "./help.js";
import { invadersWindow } from "./invaders.js";
import { appManagerWindow } from "./appmanager.js";
import { textEditorWindow } from "./texteditor.js";

import {
    createWindow,
    removeWindow,
    newSystemStatus,
    WINMASK,
    bringWindowTopmost
} from "./windows.js";

// Register available applications
registerApplication("help", "Help", "./assets/img/help.svg", helpWindow);
registerApplication("calculator", "Calculator", "./assets/img/Ionic-Ionicons-Calculator.svg", calculatorWindow);
registerApplication("texteditor", "Text Editor", "./assets/img/text-editor.svg", textEditorWindow);
registerApplication("invaders", "Invaders", "./assets/img/Pictogrammers-Material-Space-invaders.svg", invadersWindow);
registerApplication("debug", "Debug Tools", "./assets/img/debug-tools.svg", debugToolsWindow);

/*
 * Launch a new application
 */

function launchApp(name) {
    const app = getApplication(name);
    app?.launch();
}

export { launchApp };

/*
 * Main menu fonctionality implementation
 */

/* Currently shown menu */

let menuEarthShown = false;
let menuConfigShown = false;
let menuViewShown = false;
let menuAboutShown = false;

/* Selected item in config menu - default is Ordered transition */

let selectedChecklist = 2;

/* Ensure the full submenu window remain inside the desktop area */

function clipMenuFrameToDesktop(menuFrame) {
    const desktopArea = document.getElementById("background");
    const desktopAreaRect = desktopArea.getBoundingClientRect();

    const parent = menuFrame.parentElement;
    const parentRect = parent.getBoundingClientRect();

    menuFrame.style.width = "fit-content";
    menuFrame.style.top = parentRect.top + parentRect.height + "px";
    menuFrame.style.left = parentRect.left + "px";

    const windowAreaRect = menuFrame.getBoundingClientRect();

    if (windowAreaRect.width > desktopAreaRect.width) {
        menuFrame.style.width = desktopAreaRect.width + "px";
        windowAreaRect.width = desktopAreaRect.width;
    }

    if ((windowAreaRect.left + windowAreaRect.width) > desktopAreaRect.width) {
        menuFrame.style.left = (desktopAreaRect.width - windowAreaRect.width) + "px";
    }
}

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
        clipMenuFrameToDesktop(document.getElementById("earthbox"));
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
        clipMenuFrameToDesktop(document.getElementById("configbox"));
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
        clipMenuFrameToDesktop(document.getElementById("viewbox"));
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
        clipMenuFrameToDesktop(document.getElementById("aboutbox"));
    }
    else
        document.getElementById("aboutbox").style.display = "none";

    adjustMenuStates(3);
});


/*
 * View menu section
 */

/* Help Window menu item */
var menuHelp = document.getElementById("menuHelp");
menuHelp.addEventListener("click", () => {
    adjustMenuStates(-1);

    helpWindow();
});

/* Calculator Window menu item */
var menuViewCalculator = document.getElementById("menuViewCalculator");
menuViewCalculator.addEventListener("click", () => {
    adjustMenuStates(-1);

    calculatorWindow();
});

/* Text Editor Window menu item */
var menuViewTextEditor = document.getElementById("menuViewTextEditor");
menuViewTextEditor.addEventListener("click", () => {
    adjustMenuStates(-1);

    textEditorWindow();
});

/* Invaders Window menu item */
var menuViewInvaders = document.getElementById("menuViewInvaders");
menuViewInvaders.addEventListener("click", () => {
    adjustMenuStates(-1);

    invadersWindow();
});

/*
 * Config menu section
 */

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

/*
 * Earth menu section
 */

var menuEarthSystem = document.getElementById("menuearthsystem");
let aboutEarthSystemHandle = undefined;
let aboutEarthSystemClosing = false;
menuEarthSystem.addEventListener("click", () => {
    adjustMenuStates(-1);

    if (aboutEarthSystemHandle != undefined) {
        bringWindowTopmost(aboutEarthSystemHandle);
    } else {
        function onCloseWindow() {
            if (aboutEarthSystemClosing) {
                aboutEarthSystemHandle = undefined;
                return true;
            }
            return false;
        }

        function closeAboutBox() {
            document.getElementById("closeaboutearthsystem").removeEventListener("click", closeAboutBox);
            aboutEarthSystemClosing = true;
            removeWindow(aboutEarthSystemHandle);
            aboutEarthSystemClosing = false;
        }

        aboutEarthSystemHandle = createWindow("aboutearthsystem", "About Earth System", 0, 0, 300, 350, 0, onCloseWindow);

        document.getElementById("closeaboutearthsystem").addEventListener("click", closeAboutBox);
    }
});

const menuApplications = document.getElementById("menuapplications");
menuApplications.addEventListener("click", () => {
    adjustMenuStates(-1);

    appManagerWindow();
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

/*
 * Add a few window on desktop on startup
 */

// Simple Hello Window
// const window1 = createWindow("helloWindow", "Hello", 25, 25, 250, 350);

// Simple World Window
// const window2 = createWindow("worldWindow", "World", 75, 75, 250, 350);

// A ClickMe Window with buttons inside
// const window6 = createWindow("clickmeWindow", "ClickMe", 125, 125, 250, 350, WINMASK.MOVABLE);

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

// Open Help application
launchApp("help");
