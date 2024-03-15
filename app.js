const libElectron = require("electron");
const libPath = require("path");
const crypto = require('crypto');
const commonUtil = require('./utils/common.js');
const configuration = require('./package.json');
// const updater = require('./updater');
const { autoUpdater } = require('electron-updater');
const electron = require('electron');
const Notification = electron.Notification;
const ProgressBar = require('electron-progressbar');

// log.transports.file.level = 'debug';
autoUpdater.autoDownload = false;
// autoUpdater.logger = log;
let progressBar;
let notification;
//Electron App Instance
let electronApp = libElectron.app;

//Considering this as production build
Object.defineProperty(electronApp, 'isPackaged', {
  get() {
    return true;
  }
});

//Ipc To Communicate With View JS Files
electronApp.ipcMain = libElectron.ipcMain;

//Register For Deeplinking
electronApp.setAsDefaultProtocolClient('sahas', process.execPath, [libPath.resolve(process.argv[1] ? process.argv[1] : "")]);

//APP Ready Event
electronApp.on("ready", () => {
  //Electron App Window
  electronApp.window = new libElectron.BrowserWindow({
    autoHideMenuBar: true,
    show: false, //Keep Window initially hidden
    minWidth: 1024,
    minHeight: 768,
    icon: './assets/img/sahas.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      //Preload File for IPC
      preload: libPath.join(__dirname, "preload.js"),
    },
  });
  //once window is ready maximize it
  electronApp.window.maximize();
  //show the window
  electronApp.window.show();
  //In case User Quit
  electronApp.window.on('closed', () => { electronApp.window = null; });
  //load initial template
  electronApp.window.loadURL(`file://${__dirname}/assets/html/splash.html?version=${configuration.version}`);
  //Open Dev Tools , Remove Below Line While Production
  //electronApp.window.webContents.openDevTools();
  //Disable Right Click Due to Youtube Video Privacy
  electronApp.window.on("system-context-menu", (event, _point) => event.preventDefault());
  // //check for update
  //  updater.init();
  //  updater.checkUpdates();
  autoUpdater.checkForUpdates();
});
//Check update available.
autoUpdater.on('update-available', (info) => {
      notification = new Notification({ 
          title: 'A new version is ready to download',
          body: `${electronApp.getName()} version ${info.version} can be downloaded and installed`
      });
      notification.show();
      progressBar = new ProgressBar({
        indeterminate: false,
        value : 0,
        text: 'Updating Sahas Smart Studies.',
        detail: 'Downloading the latest version. Please wait..',
        title: 'Sahas Auto Updater',
        browserWindow: {
            backgroundColor: '#eee'
        },
        style: {
            bar: {
                'height': '10px',
                'box-shadow': 'none',
                'border-radius': '2px'
            }
        }
    });
    autoUpdater.downloadUpdate();    
});

// Download progress show the percentage of download is completed.
autoUpdater.on('download-progress', (progressObj) => {
  progressBar.value = progressObj.percent;
  progressBar.detail =  `Downloading the latest version. Please wait   ${(progressObj.bytesPerSecond / 1000).toFixed(2)} KB/s (${(progressObj.transferred / 1000000).toFixed(2)} MB / ${(progressObj.total / 1000000).toFixed(2)} MB)`;
});

// The update is downloaded
autoUpdater.on('update-downloaded', () => {
  progressBar.setCompleted();
  progressBar.close();  
  // dialog.showMessageBox({
  //     title: 'Ready to Install',
  //     message: 'The software has been downloaded. Click Restart to relaunch the new version...',
  //     buttons: ['Restart']
  // })
  autoUpdater.quitAndInstall();
});

// function createUpdateDialog(info) {
//       // dialog.showMessageBox({
//       //     type: 'info',
//       //     title: 'Software Update',
//       //     message: 'A new version of Sahas is available.',
//       //     detail: `Sahas ${info.version} is now available & you have ${autoUpdater.currentVersion} installed. Would you like to download it now?`,
//       //     buttons: ['Yes']
//       // })
//       startDownload();
// }

// function startDownload() {
//   progressBar = new ProgressBar({
//       indeterminate: false,
//       text: 'Updating Sahas Smart Studies.',
//       detail: 'Downloading the latest version. Please wait..',
//       title: 'Sahas Auto Updater',
//       browserWindow: {
//           backgroundColor: '#eee'
//       },
//       style: {
//           bar: {
//               'height': '10px',
//               'box-shadow': 'none',
//               'border-radius': '2px'
//           }
//       }
//   });
//   autoUpdater.downloadUpdate();
// }

//Google Login Browser Request
//Try To Acquire Single Instance Lock
if (!electronApp.requestSingleInstanceLock()) {
  electronApp.quit()
} else {
  //In case browser throw back response starting from sahas://
  electronApp.on('second-instance', (event, args, workingDirectory) => {
    const googleLoginUrl = args.find(arg => {
      return arg.startsWith("sahas://")
    });

    if (googleLoginUrl) {
      const googleLoginUser = commonUtil.decodeGoogleLoginToken(new URL(googleLoginUrl).searchParams.get("signin_token"));
      electronApp.currentUser = {}
      electronApp.currentUser.user_name = googleLoginUser.name;
      electronApp.currentUser.user_email = googleLoginUser.email;
      electronApp.currentUser.user_pass = googleLoginUser.sub;
      electronApp.currentUser.user_phone = "1111111111";
      electronApp.currentUser.signup_refer_user_index = "0";

      //Return Google Signin Reponse
      electronApp.googleLoginEvent.sender.send("google_login_get_res", electronApp.currentUser);
    }

    // Someone tried to run a second instance, we should focus our window.
    if (electronApp.window)
      electronApp.window.focus()
  })
}

//All Window Close Event
electronApp.on('window-all-closed', () => electronApp.quit());

// --- IPC Handling Section ---//
//User requested For Google Login
electronApp.ipcMain.on("google_login_get", (event) => {
  libElectron.shell.openExternal("https://sahasinstitute.com/google_login.html");
  electronApp.googleLoginEvent = event;
});

//Request For Device ID
electronApp.ipcMain.on("device_id_get", (event) => {
  event.sender.send("device_id_get_res", `${process.platform}_${crypto.createHash('sha256').update(Date.now().toString()).digest('hex').slice(0, 12)}`);
});

//Save The User
electronApp.ipcMain.on("user_set", (event, userData) => {
  userData.user_wallet = Number(userData.user_wallet);
  //save current user
  electronApp.currentUser = userData;
  //Secure Against Screenshot and Recording    
  electronApp.window.setContentProtection(Boolean(Number(userData.secure_screen)));
});

//Send User Data
electronApp.ipcMain.on("user_get", (event) => {
  //save current user
  event.sender.send("user_get_res", electronApp.currentUser);
});

//Back Button
electronApp.ipcMain.on("back_get", (event) => {
  electronApp.window.webContents.goBack();
});

//Logout
electronApp.ipcMain.on("user_logout_get", (event) => {
  //Remove Currnt User From Memory
  electronApp.currentUser = {}
  electronApp.window.webContents.goBack();
  electronApp.window.webContents.executeJavaScript('localStorage.setItem("LOGGEDINUSEREMAIL", "");', true);
  electronApp.window.webContents.executeJavaScript('localStorage.setItem("LOGGEDINUSERPASSWORD", "");', true);
});

electronApp.ipcMain.on("receipt_get", (event, purchaseId) => {
  libElectron.shell.openExternal(`https://sahasinstitute.com/adminportal/mobileApis/generateReceipt.php?purchase_id=${purchaseId}`);
});