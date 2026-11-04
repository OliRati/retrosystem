import { getAllApplications } from "./appregistry.js";
import { launchApp } from "./script.js";

import {
    createWindow,
    bringWindowTopmost,
    newSystemStatus,
    WINMASK
} from "./windows.js";

let appManagerWindowHandle = undefined;

function appManagerWindow() {
    if (appManagerWindowHandle != undefined) {
        bringWindowTopmost(appManagerWindowHandle);
        return;
    }

    function createAppListHTML() {
        const apps = getAllApplications();
        let html = '';

        apps.forEach(([name, app]) => {
            html += `
                        <div class="applications-item" data-app="${name}">
                            <div class="applications-icon">
                                <img src="${app.icon}" alt="Application icon">
                            </div>
                            <div class="applicationq-name">
                                ${app.label}
                            </div>
                        </div>
                        `;
        });

        return html;
    }

    function onCloseWindow() {
        appManagerWindowHandle = undefined;
        return true;
    }

    appManagerWindowHandle = createWindow("applicationsmanager", "Applications Manager", 50, 50, 300, 350, WINMASK.MOVABLE | WINMASK.CLOSABLE, onCloseWindow);
    newSystemStatus("Applications manager opened.");

    const appContainer = document.getElementById('applications-container');
    if (appContainer) {
        appContainer.innerHTML = createAppListHTML();

        appContainer.querySelectorAll('.applications-item').forEach(item => {
            item.addEventListener('click', () => {
                const appName = item.dataset.app;
                launchApp(appName);
            });
        });
    }
}

export { appManagerWindow };