const libElectron = require("electron");
const libPath = require("path");

const { app, BrowserWindow, ipcMain } = libElectron;

//main Window object
let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            //Preload File for IPC
            preload: libPath.join(__dirname, "preload.js"),
        },
    });
    //load initial template
    mainWindow.loadURL(`file://${__dirname}/assets/html/index.html`);
    //Open Dev Tools , Remove Below Line While Production
    mainWindow.webContents.openDevTools();
});

ipcMain.on("entity1:event1", (event, data) => {
    console.log(data);
    event.sender.send("entity1:event1", data);

});