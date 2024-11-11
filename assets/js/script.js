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

function createWindow(id, title, posx, posy, width, height, closebtn = false) {
    const div = document.createElement('div');

    div.className = 'windowframe';

    div.appendChild(addWindowFrame(title, closebtn));

    div.style.zIndex = getMaxZIndex() + 1;

    div.style.left = posx;
    div.style.top = posy;
    div.style.width = width;
    div.style.height = height;

    document.getElementById('background').appendChild(div);

    windowList.push(div);

    var windowbars = div.getElementsByClassName("windowbar");
    if (windowbars.length === 1) {
        windowbars[0].addEventListener('click', (event) => {
            console.log("Here");
            console.dir(event);
        });
    }

    div.addEventListener("mousedown", (event) => {
        const background = document.getElementById('background');

        const clientwidth = background.getBoundingClientRect().width;
        const clientheight = background.getBoundingClientRect().height;

        let shiftX = event.pageX - div.getBoundingClientRect().left;
        let shiftY = event.pageY - div.getBoundingClientRect().top
            + document.getElementById('mainmenu').getBoundingClientRect().height;

        let width = div.getBoundingClientRect().width;
        let height = div.getBoundingClientRect().height;

        bringWindowTopmost(div);

        /* Mouse down on title bar => move window */
        const titlebarheight = div.firstChild.getBoundingClientRect().height;
        const windowframetop = div.getBoundingClientRect().top;

        if (event.pageY < (titlebarheight + windowframetop)) {
            console.log("got it");

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
    });

    return div;
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
menuEarthSystem.addEventListener("click", () => {
    adjustMenuStates(-1);
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

const window1 = createWindow("window1", "Hello", "25px", "25px", "200px", "300px", false);
window1.innerHTML += `
    <h3>Hello World !!</h3>
    <p>This little window demo show you my programming skills in HTML JavaScript CSS.</p>
    `;

const window2 = createWindow("window2", "World", "75px", "75px", "200px", "300px", false);
window2.innerHTML += `<h3>New World Window</h3>
    <p>A new world is happening. Stay tuned.</p>`;

const window3 = createWindow("window3", "TopMost", "125px", "125px", "200px", "300px", false);
window3.innerHTML += `<h3>Bring on top</h3>
        <p>To bring a window to front click inside.</p>`;


const window4 = createWindow("window4", "Dancing", "175px", "175px", "200px", "300px", true);
window4.innerHTML += `
    <h3>Dancing windows</h3>
    <p>Now windows can be moved with mouse with a click inside title bar.</p>`;

const window5 = createWindow("window5", "Third", "225px", "225px", "200px", "300px", true);
window5.innerHTML += `
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