/* Currently shown menu */

let menuEarthShown = false;
let menuConfigShown = false;
let menuViewShown = false;
let menuAboutShown = false;

/* Selected item in config menu - default is Ordered transition */

let selectedChecklist = 2;

const background = document.getElementById("background");


/* Add window title bar */

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

/* Create a new window */

function createWindow(id, title, posx, posy, width, height, closebtn = false) {
    const div = document.createElement('div');
    div.className = 'windowframe';
    div.innerHTML = `
            <div id="` + id + `">
            <div id="` + id + `Bar"></div>
            `;

    div.style.left = posx;
    div.style.top = posy;
    div.style.width = width;
    div.style.height = height;

    document.getElementById('background').appendChild(div);

    document.getElementById(id + 'Bar').appendChild(addWindowFrame(title, closebtn));

    return div;
}

/* Menu fonctionality implementation */

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

function adjustChecklist() {
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

    selectedChecklist = 0;
    adjustChecklist();
});

var menuRandomTransition = document.getElementById("menurandomtransition");
menuRandomTransition.addEventListener("click", () => {
    adjustMenuStates(-1);

    selectedChecklist = 1;
    adjustChecklist();
});

var menuOrderedTransition = document.getElementById("menuorderedtransition");
menuOrderedTransition.addEventListener("click", () => {
    adjustMenuStates(-1);

    selectedChecklist = 2;
    adjustChecklist();
});

var menuSloMoveTrnasition = document.getElementById("menuslowmovetransition");
menuSloMoveTrnasition.addEventListener("click", () => {
    adjustMenuStates(-1);

    selectedChecklist = 3;
    adjustChecklist();
});

var menuRollonTransition = document.getElementById("menurollontransition");
menuRollonTransition.addEventListener("click", () => {
    adjustMenuStates(-1);

    selectedChecklist = 4;
    adjustChecklist();
});

var menuRotateTransition = document.getElementById("menurotatetransition");
menuRotateTransition.addEventListener("click", () => {
    adjustMenuStates(-1);

    selectedChecklist = 5;
    adjustChecklist();
});

var menuTurnTransition = document.getElementById("menuturntransition");
menuTurnTransition.addEventListener("click", () => {
    adjustMenuStates(-1);

    selectedChecklist = 6;
    adjustChecklist();
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

const window1 = createWindow("window1", "Hello World", "25px", "25px", "200px", "300px", false);
window1.innerHTML += "<p>Hello World !!!</p>";

const window2 = createWindow("window2", "Beautifull World", "75px", "75px", "200px", "300px", false);
window2.innerHTML += "<p>That's a beautifull world !!!</p>";

const window3 = createWindow("window3", "First", "125px", "125px", "200px", "300px", false);
window3.innerHTML += "<p>New Window 3</p>";

const window4 = createWindow("window4", "Second", "175px", "175px", "200px", "300px", true);
window4.innerHTML += "<p>New Window 4</p>";

const window5 = createWindow("window5", "Third", "225px", "225px", "200px", "300px", true);
window5.innerHTML += "<p>New Window 5</p>";
