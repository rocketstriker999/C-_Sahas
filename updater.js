const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

//app updater
let updater = {}

//set app updater properties
updater.init = () => {
    //By default checks for updates
    updater.autoUpdater = autoUpdater;
    updater.autoUpdater.autoDownload = true;
    //Close App and Install Update
    updater.autoUpdater.on('update-downloaded', ()=>updater.autoUpdater.quitAndInstall());
}

//Check updates
updater.checkUpdates = () => {
    // Check on server and Notify that new update is found.
    updater.autoUpdater.checkForUpdatesAndNotify();
}

module.exports = updater;