const libElectron = require("electron");
const libPath = require("path");
const crypto = require('crypto');

//Electron App Instance
let electronApp = libElectron.app;

//Ipc To Communicate With View JS Files 
electronApp.ipcMain = libElectron.ipcMain;

//APP Ready Event
electronApp.on("ready", () => {
    //Electron App Window
    electronApp.window = new libElectron.BrowserWindow({
        autoHideMenuBar:true,
        minWidth:1024,
        minHeight:768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            //Preload File for IPC
            preload: libPath.join(__dirname, "preload.js"),
        },
    });
    //In case User Quit
    electronApp.window.on('closed', () => { electronApp.window = null; });
    //load initial template
    electronApp.window.loadURL(`file://${__dirname}/assets/html/splash.html`);
    //Open Dev Tools , Remove Below Line While Production
    electronApp.window.webContents.openDevTools();
});

//All Window Close Event
electronApp.on('window-all-closed', () => electronApp.quit());

electronApp.ipcMain.on("deviceId:req", (event, data) => {
    event.sender.send("deviceId:res",`${process.platform}_${crypto.createHash('sha256').update(Date.now().toString()).digest('hex').slice(0,12)}`);
});