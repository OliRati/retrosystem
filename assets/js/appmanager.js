import { getAllApplications } from "./appregistry.js";
import { launchApp } from "./script.js";

import {
    createWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
} from "./windows.js";

let appManagerShown = false;

function appManagerWindow() {
    if (!appManagerShown) {

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
            appManagerShown = false;
            return true;
        }

        let newWin = createWindow("applicationsmanager", "Applications Manager", 50, 50, 300, 350, WINMASK_MOVABLE | WINMASK_CLOSABLE, onCloseWindow);
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

        appManagerShown = true;
    }
}

export { appManagerWindow };