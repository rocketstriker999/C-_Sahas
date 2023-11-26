const libElectron = require("electron");
const libPath = require("path");
const crypto = require('crypto');

//Electron App Instance
let electronApp = libElectron.app;

//Ipc To Communicate With View JS Files 
electronApp.ipcMain = libElectron.ipcMain;

//Register For Deeplinking
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    electronApp.setAsDefaultProtocolClient('sahas', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  electronApp.setAsDefaultProtocolClient('sahas')
}


//APP Ready Event
electronApp.on("ready", () => {

    //Electron App Window
    electronApp.window = new libElectron.BrowserWindow({
        autoHideMenuBar:true,
        show: false, //Keep Window initially hidden
        minWidth:1024,
        minHeight:768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            //Preload File for IPC
            preload: libPath.join(__dirname, "preload.js"),
        },
    });

    if (!electronApp.requestSingleInstanceLock()) {
        electronApp.quit()
      } else {
        electronApp.on('second-instance', (event, args, workingDirectory) => {

          const deepLinkingUrl= args.find(arg=>{
            arg.startsWith("sahas://")
          });

          console.log("URL :"+deepLinkingUrl);

          // Someone tried to run a second instance, we should focus our window.
          if (electronApp.window) 
            electronApp.window.focus()
        })
      }

    //once window is ready maximize it
    electronApp.window.maximize();
    //show the window
    electronApp.window.show();
    
    //In case User Quit
    electronApp.window.on('closed', () => { electronApp.window = null; });
    //load initial template
    electronApp.window.loadURL(`file://${__dirname}/assets/html/splash.html`);
    //Open Dev Tools , Remove Below Line While Production
    electronApp.window.webContents.openDevTools();

});


//All Window Close Event
electronApp.on('window-all-closed', () => electronApp.quit());


electronApp.ipcMain.on("googleLogin:req",(event,data)=>{
  libElectron.shell.openExternal("https://sahasinstitute.com/google_login.html");
});

//Request For Device ID
electronApp.ipcMain.on("deviceId:req", (event, data) => {
    event.sender.send("deviceId:res",`${process.platform}_${crypto.createHash('sha256').update(Date.now().toString()).digest('hex').slice(0,12)}`);
});

//Save The User
electronApp.ipcMain.on("user:req", (event, userData) => {
    //save current user
    electronApp.currentUser=userData;
});