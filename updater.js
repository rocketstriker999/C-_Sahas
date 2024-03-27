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
    //start listners
    updater.addListners();
}

 //setup progressbar
 updater.createProgressBar =() => {
    return new electronProgressBar({
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
    });
}



updater.showNotification = (notificationTitle,notificationBody) => {
    
    //dismiss if current notification bar is there
    if(updater.updateNotification){
        updater.updateNotification.dismiss();
        delete updater.updateNotification
    }
    //create a new notification
    updater.updateNotification= new Notification({title: notificationTitle,body: notificationBody});
    updater.updateNotification.show();
     
}

updater.addListners = () => {
    //add listners
    updater.autoUpdater.on('update-available', listnerUpdateAvailable);
    updater.autoUpdater.on('download-progress', listnerUpdateDownloading);
    updater.autoUpdater.on('update-downloaded', listnerUpdateDownloaded);
    updater.autoUpdater.on('error',listnerUpdateFailed);
}


const listnerUpdateAvailable = (updateInfo) => {
    //create a progressbar
    updater.updateProgressBar = createProgressBar();
    //start update download
    updater.autoUpdater.downloadUpdate();
    
}

const listnerUpdateDownloading = (updateProgressInfo) => {
    updater.updateProgressBar.value = updateProgressInfo.percent;
    updater.updateProgressBar.detail = `Downloading the latest version. Please wait   ${(updateProgressInfo.bytesPerSecond / 1000).toFixed(2)} KB/s (${(updateProgressInfo.transferred / 1000000).toFixed(2)} MB / ${(updateProgressInfo.total / 1000000).toFixed(2)} MB)`;
}

const listnerUpdateDownloaded = () => {
    updater.updateProgressBar.setCompleted();
    updater.updateProgressBar.close();
    updater.autoUpdater.quitAndInstall();
}

const listnerUpdateFailed =  (error) => {
    updater.autoUpdater.getUpdateprogressBar.setCompleted();
    updater.autoUpdater.getUpdateprogressBar.close();
    updater.showNotification("Failed To Update",`Failed To Update Sahas Smart Studies : ${error}`)
};



//Check updates
updater.checkUpdates = () => {
    // Check on server and Notify that new update is found.
    updater.autoUpdater.checkForUpdates();
}

module.exports = updater;