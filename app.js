const libElectron = require("electron");
const libPath = require("path");
const crypto = require('crypto');
const commonUtil = require('./utils/common.js');
const configuration = require('./package.json');
const { dialog, } = require('electron');
const { autoUpdater } = require('electron-updater');

//Electron App Instance
let electronApp = libElectron.app;

//Ipc To Communicate With View JS Files 
electronApp.ipcMain = libElectron.ipcMain;

//Register For Deeplinking
electronApp.setAsDefaultProtocolClient('sahas', process.execPath, [libPath.resolve(process.argv[1]?process.argv[1]:"")]);

Object.defineProperty(electronApp, 'isPackaged', {
  get() {
    return true;
  }
});

//APP Ready Event
electronApp.on("ready", () => {
    //Electron App Window
    electronApp.window = new libElectron.BrowserWindow({
        autoHideMenuBar:true,
        show: false, //Keep Window initially hidden
        minWidth:1024,
        minHeight:768,
        icon:'./assets/img/sahas.png',
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
});

//Auto Update Ready Event
if (process.env.NODE_ENV === "development") {
  // Customize the test by toggling these lines
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false;
}
else{
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
}

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available.' + info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.' + info);
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
});
autoUpdater.on('update-downloaded', (info) => {
  console.log(info);
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Update'],
    title: 'Application Update',
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

//Google Login Browser Request
//Try To Acquire Single Instance Lock
if (!electronApp.requestSingleInstanceLock()) {
  electronApp.quit()
} else {
  //In case browser throw back response starting from sahas://
  electronApp.on('second-instance', (event, args, workingDirectory) => {
    const googleLoginUrl= args.find(arg=>{
      return arg.startsWith("sahas://")
    });

    if(googleLoginUrl){
        const googleLoginUser=commonUtil.decodeGoogleLoginToken(new URL(googleLoginUrl).searchParams.get("signin_token"));
        electronApp.currentUser={}
        electronApp.currentUser.user_name=googleLoginUser.name;
        electronApp.currentUser.user_email=googleLoginUser.email;
        electronApp.currentUser.user_pass=googleLoginUser.sub;
        electronApp.currentUser.user_phone="1111111111";
        electronApp.currentUser.signup_refer_user_index ="0";

        //Return Google Signin Reponse
        electronApp.googleLoginEvent.sender.send("google_login_get_res",electronApp.currentUser);
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
electronApp.ipcMain.on("google_login_get",(event,data)=>{
  libElectron.shell.openExternal("https://sahasinstitute.com/google_login.html");
  electronApp.googleLoginEvent =  event;
});

//Request For Device ID
electronApp.ipcMain.on("device_id_get", (event) => {
    event.sender.send("device_id_get_res",`${process.platform}_${crypto.createHash('sha256').update(Date.now().toString()).digest('hex').slice(0,12)}`);
});

//Save The User
electronApp.ipcMain.on("user_set", (event, userData) => {
    //save current user
    electronApp.currentUser=userData;
    //Secure Against Screenshot and Recording    
    electronApp.window.setContentProtection(Boolean(Number(userData.secure_screen)));
});

//Send User Data
electronApp.ipcMain.on("user_get", (event) => {
  //save current user
  event.sender.send("user_get_res",electronApp.currentUser);
});

//Back Button
electronApp.ipcMain.on("back_get", (event) => {
  electronApp.window.webContents.goBack();
});

//Logout
electronApp.ipcMain.on("user_logout_get", (event) => {
  //Remove Currnt User From Memory
  electronApp.currentUser={}
  electronApp.window.webContents.goBack();
});