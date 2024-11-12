/* Currently shown menu */

let menuEarthShown = false;
let menuConfigShown = false;
let menuViewShown = false;
let menuAboutShown = false;

/* Selected item in config menu - default is Ordered transition */

let selectedChecklist = 2;

/*
 * Window creation routines
 */

/* The desktop background */
const background = document.getElementById("background");

/* The list of all windows created */
let windowList = [];

/* Add a title bar to window */

function addWindowFrame(title, closebutton = false) {
    const div = document.createElement('div');
    div.className = 'windowbar';
    div.innerHTML = `            
                <div class="windowbarstart">
                    <div class="windowbardecoration"></div>
                    <div class="windowbardecoration"></div>
                    <div class="windowbardecoration"></div>
                    <div class="windowbardecoration"></div>
                    <div class="windowbardecoration"></div>
                </div>
                <div class="windowbarcube">
                </div>
                <div class="windowtitleframe">
                    <div class="windowbarend">
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                    </div>
                    <div class="windowtitle">`+ title + `</div>
                    <div class="windowbarend">
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                        <div class="windowbardecoration"></div>
                    </div>
                </div>
            `;
    if (closebutton) {
        div.innerHTML += `<div class="windowbarclose"></div>`;
    }
    return div;
}

/* Get the max zIndex in use for a window */

function getMaxZIndex() {
    let zmax = 0;

    windowList.forEach(window => {
        let z = parseInt(window.style.zIndex);
        if (z > zmax)
            zmax = z;
    });

    return zmax;
}

/* Move window to the topmost position */

function bringWindowTopmost(div) {
    let zmax = 0;
    let zmin = 65535;

    windowList.forEach(window => {
        let zwin = parseInt(window.style.zIndex);
        if (zwin > zmax)
            zmax = zwin;
        if (zwin < zmin)
            zmin = zwin;
    });

    if (parseInt(div.style.zIndex) < zmax) {
        div.style.zIndex = zmax + 1;
    }

    if (zmin > 0) {
        // Reorder all windows zIndex
        windowList.forEach(window => {
            let zwin = parseInt(window.style.zIndex);
            zwin -= zmin;
            window.style.zIndex = zwin;
        });
    }
}

/* Create a new window on top of others */
const WINMASK_CLOSABLE = 1;
const WINMASK_RESIZABLE = 2;
const WINMASK_MOVABLE = 4;

function createWindow(id, title, posx, posy, width, height, winmask = 0) {
    const background = document.getElementById('background');
    const clientWidth = background.getBoundingClientRect().width;
    const clientHeight = background.getBoundingClientRect().height;

    const div = document.createElement('div');
    if (winmask & WINMASK_MOVABLE) {
        div.className = 'windowframe';
        div.appendChild(addWindowFrame(title, winmask & WINMASK_CLOSABLE));
    }
    else
        div.className = 'staticwindowframe';

    div.style.zIndex = getMaxZIndex() + 1;

    div.style.left = posx + "px";
    div.style.top = posy + "px";
    div.style.width = width + "px";
    div.style.height = height + "px";

    background.appendChild(div);

    windowList.push(div);

    var windowbars = div.getElementsByClassName("windowbar");
    if (windowbars.length === 1) {
        windowbars[0].addEventListener('click', (event) => {
            console.log("Here");
            console.dir(event);
        });
    }

    const windowWidth = div.getBoundingClientRect().width;
    const windowHeight = div.getBoundingClientRect().height;

    if (!(winmask & WINMASK_MOVABLE)) {
        /* Place unmovable window at the center of background area */
        div.style.left = ((clientWidth - windowWidth) / 2) + "px";
        div.style.top = ((clientHeight - windowHeight) / 2) + "px";
    } else {
        /* Ensure the full window size is in background area */
        if ((div.getBoundingClientRect().top + windowHeight) > clientHeight)
            div.style.top = (clientHeight - windowHeight) + "px";

        if ((div.getBoundingClientRect().left + windowWidth) > clientWidth)
            div.style.left = (clientWidth - windowWidth) + "px";
    }

    div.addEventListener("mousedown", (event) => {
        const background = document.getElementById('background');

        const clientwidth = background.getBoundingClientRect().width;
        const clientheight = background.getBoundingClientRect().height;

        let shiftX = event.pageX - div.getBoundingClientRect().left;
        let shiftY = event.pageY - div.getBoundingClientRect().top
            + document.getElementById('mainmenu').getBoundingClientRect().height;

        bringWindowTopmost(div);

        if (winmask & WINMASK_MOVABLE) {
            /* Mouse down on title bar => move window */
            const titlebarheight = div.firstChild.getBoundingClientRect().height;
            const windowframetop = div.getBoundingClientRect().top;

            if (event.pageY < (titlebarheight + windowframetop)) {
                function moveAt(x, y) {
                    posx = x - shiftX;
                    posy = y - shiftY;

                    if (posx < 0) posx = 0;
                    if (posx + width > clientwidth)
                        posx = clientwidth - width;
                    if (posy < 0) posy = 0;
                    if (posy + height > clientheight)
                        posy = clientheight - height;

                    div.style.left = posx + 'px';
                    div.style.top = posy + 'px';
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener("mousemove", onMouseMove);

                function onMouseUp() {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }

                document.addEventListener('mouseup', onMouseUp);

                div.ondragstart = function () {
                    return false;
                };
            }
        }
    });

    return div;
}

/* Update System status string */
function newSystemStatus(text) {
    document.getElementById("statusframe").innerHTML = text;

    setTimeout(() => {
        document.getElementById("statusframe").innerHTML = "Ready.";
    }, 5000);
}

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

let windowShown = false;
var menuShowPlaylist = document.getElementById("menuShowPlaylist");

menuShowPlaylist.addEventListener("click", () => {
    windowShown = !windowShown;

    adjustMenuStates(-1);
});

let winid = 0;
let origX = 50;
let origY = 50;

var menuNewWindow = document.getElementById("menuNewWindow");
menuNewWindow.addEventListener("click", () => {
    adjustMenuStates(-1);

    let width = Math.floor((Math.random() * 300) + 300);
    let height = Math.floor((Math.random() * 400) + 200);

    let newWin = createWindow("newone", "New " + winid, origX, origY, width, height, WINMASK_MOVABLE | WINMASK_CLOSABLE);

    newWin.innerHTML += "<h3>New window size " + width + "x" + height + "</h3>";

    newSystemStatus("Window " + winid + " Created.");
    origX += 30;
    origY += 25;
    if (origX > 400) {
        origX = 50;
        origY = 50;
    }
    winid++;
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
        let newWin = createWindow("newone", "About Earth System", 0, 0, 350, 400, 0);

        let aboutbox = document.getElementById("aboutearthsystem");
        newWin.innerHTML += aboutbox.outerHTML;
        newWin.firstChild.style.display = "block";

        function closeAboutBox() {
            aboutEarthSystemOpened = false;
            newWin.style.display = "none";
            newWin.innerHTML = "";
            document.getElementById("closeaboutearthsystem").removeEventListener("click", closeAboutBox);
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

/* Add 5 window to desktop */

const window1 = createWindow("window1", "Hello", 25, 25, 200, 300, WINMASK_MOVABLE);
window1.innerHTML += `
    <h3>Hello World !!</h3>
    <p>This little window demo show you my programming skills in HTML JavaScript CSS.</p>
    `;

const window2 = createWindow("window2", "World", 75, 75, 200, 300, WINMASK_MOVABLE);
window2.innerHTML += `<h3>New World Window</h3>
    <p>A new world is happening. Stay tuned.</p>`;

const window3 = createWindow("window3", "TopMost", 125, 125, 200, 300, WINMASK_MOVABLE);
window3.innerHTML += `<h3>Bring on top</h3>
        <p>To bring a window to front click inside.</p>`;


const window4 = createWindow("window4", "Dancing", 175, 175, 200, 300, WINMASK_MOVABLE | WINMASK_CLOSABLE);
window4.innerHTML += `
    <h3>Dancing windows</h3>
    <p>Now windows can be moved with mouse with a click inside title bar.</p>`;

const window5 = createWindow("window5", "Third", 225, 225, 200, 300, WINMASK_MOVABLE | WINMASK_CLOSABLE);
window5.innerHTML += `
    <h3>A static window not movable.</h3>
    <h3>Click <i class="fa-regular fa-face-smile-wink"></i></h3>
    <p id="demo">Click button below to change color</p>
    <button onclick="changeColor()">Click me</button>`;

/* Window Click me function */
let color = 0;
function changeColor() {
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