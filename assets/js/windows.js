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

/* Window type mask */
const WINMASK_CLOSABLE = 1;
const WINMASK_RESIZABLE = 2;
const WINMASK_MOVABLE = 4;

/* Remove a window */

function removeWindow(win) {
    /* Remove that window from list */
    const index = windowList.indexOf(win);
    if (index > -1) {
        windowList.splice(index, 1);
        win.remove();
    }
}

/* Create a new window on top of others
 *-------------------------------------------------
 * id             id of dom element to bring into window at creation
 *                or 0 for custom drawn content
 * title          Title of window
 * poxx, poxy     Position relative to background area of new window
 * width, height  width and height of new window
 * winmask        Creation mask for window type
 *                  WINMASK_CLOSABLE         A window with a close button in title bar
 *                  WINMASK_MOVABLE          A window with a title bar to move it on background 
 *                  const WINMASK_RESIZABLE  A resizable window ( not implemented yet ) 
 * 
 * onCloseWindow  Function called when the window is close by the title bar cross icon
 *                if function return true, closing is allowed, otherwise disabled
 * 
 * return the element newly creted in the DOM
 */

function createWindow(id, title, posx, posy, width, height, winmask = WINMASK_CLOSABLE | WINMASK_MOVABLE, onCloseWindow = () => { return true }) {
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

    if (id) {
        let content = document.getElementById(id);
        if (content) {
            div.innerHTML += content.outerHTML;
        }
        else {
            div.innerHTML += `
                <div class="margincontainer">
                    <p class="error">Error id="` + id + `' Undefined in DOM.</p>
                </div>`;
        }
    }

    windowList.push(div);

    /*
    var windowbars = div.getElementsByClassName("windowbar");
    if (windowbars.length === 1) {
        windowbars[0].addEventListener('click', (event) => {
            console.log("Here");
            console.dir(event);
        });
    }
    */

    if (winmask & WINMASK_CLOSABLE) {
        const closebtn = div.getElementsByClassName("windowbarclose");
        if (closebtn.length === 1) {
            closebtn[0].addEventListener('click', () => {
                if (onCloseWindow())
                    removeWindow(div);
            });
        }
    }

    const windowWidth = div.getBoundingClientRect().width;
    const windowHeight = div.getBoundingClientRect().height;

    if (winmask & WINMASK_MOVABLE) {
        /* Ensure the full window size is in background area */
        if ((div.getBoundingClientRect().top + windowHeight) > clientHeight)
            div.style.top = (clientHeight - windowHeight) + "px";

        if ((div.getBoundingClientRect().left + windowWidth) > clientWidth)
            div.style.left = (clientWidth - windowWidth) + "px";
    } else {
        /* Place unmovable window at the center of background area */
        div.style.left = ((clientWidth - windowWidth) / 2) + "px";
        div.style.top = ((clientHeight - windowHeight) / 2) + "px";
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

function changecolor() {
    console.log("changecolor");
}

export {
    createWindow,
    removeWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
};