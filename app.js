const libElectron = require("electron");
const libPath = require("path");


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

electronApp.ipcMain.on("entity1:event1", (event, data) => {
    console.log(data);
    event.sender.send("entity1:event1", data);

});