/*
 * Application register management
 */

const applicationRegistry = new Map();

function registerApplication(name, label, icon, launchFunction) {
    applicationRegistry.set(name, {
        label: label,
        icon: icon,
        launch: launchFunction
    });
}

function getApplication(name) {
    return applicationRegistry.get(name);
}

function getAllApplications() {
    return Array.from(applicationRegistry.entries());
}

export { registerApplication, getApplication, getAllApplications };