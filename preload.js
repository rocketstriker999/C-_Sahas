const { ipcRenderer, contextBridge } = require("electron");
 
contextBridge.exposeInMainWorld("electron", {
  generateDeviceID: () => {
    ipcRenderer.send("deviceId:req");
  },
  getDeviceID: (callback) => {
    ipcRenderer.on("deviceId:res", (event,deviceId) => {
      callback(deviceId);
    });
  },
  openGoogleLogin:()=>{
    ipcRenderer.send("googleLogin:req");
  },
  setCurrentUser:(userData)=>{
    ipcRenderer.send("user:req",userData);
  }
});