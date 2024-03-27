const { dialog, Notification } = require('electron');
const electronProgressBar = require('electron-progressbar');
const { autoUpdater } = require('electron-updater');

//app updater
let updater = {}

//set app updater properties
updater.init = () => {
    //By default checks for updates
    updater.autoUpdater = autoUpdater;
    updater.autoUpdater.autoDownload = false;

    //updater Notification
    updater.getUpdateNotification = (updateInfo) => new Notification({
        title: 'A new version is ready to download',
        body: `New version ${updateInfo.version} can be downloaded and installed`
    });

    updater.addListners();
}

updater.addListners = () => {
    //add listners
    autoUpdater.on('update-available', listnerUpdateAvailable);
    autoUpdater.on('download-progress', listnerUpdateDownloading);
    autoUpdater.on('update-downloaded', listnerUpdateDownloaded);
}

const listnerUpdateAvailable = (updateInfo) => {
    //show notification
    updater.getUpdateNotification(updateInfo).show();
    updater.autoUpdater.downloadUpdate();
    updater.updateProgressBar=new electronProgressBar({
        indeterminate: false,
        value: 0,
        text: 'Updating Sahas Smart Studies.',
        detail: 'Downloading the latest version. Please wait..',
        title: 'Sahas Auto Updater',
        browserWindow: {
            backgroundColor: '#eee'
        },
        style: {
            bar: {
                'height': '8px',
                'box-shadow': 'none',
                'border-radius': '2px'
            }
        }
    })
}

const listnerUpdateDownloading = (updateProgressInfo) => {
    updater.updateProgressBar.value = updateProgressInfo.percent;
    updater.updateProgressBar.detail = `Downloading the latest version. Please wait   ${(updateProgressInfo.bytesPerSecond / 1000).toFixed(2)} KB/s (${(updateProgressInfo.transferred / 1000000).toFixed(2)} MB / ${(updateProgressInfo.total / 1000000).toFixed(2)} MB)`;
}

const listnerUpdateDownloaded = () => {
    autoUpdater.updateProgressBar.setCompleted();
    autoUpdater.updateProgressBar.close();
    autoUpdater.quitAndInstall();
}


//Check updates
updater.checkUpdates = () => {
    // Check on server and Notify that new update is found.
    updater.autoUpdater.checkForUpdates();
}

module.exports = updater;