const { ipcRenderer, contextBridge } = require("electron");
 
contextBridge.exposeInMainWorld("electron", {
  getDeviceID: (callback) => {
    ipcRenderer.send("device_id_get");
    ipcRenderer.once("device_id_get_res", (event,deviceId) => {
      callback(deviceId);
    });
  },
  googleLogin:(callback)=>{
    ipcRenderer.send("google_login_get");
    ipcRenderer.once("google_login_get_res", (event,googleLoginUser) => {
      callback(googleLoginUser);
    });
  },
  setCurrentUser:(userData)=>{
    ipcRenderer.send("user:set",userData);
  },
  getCurrentUser: (callback) => {
    ipcRenderer.send("user_get");
    ipcRenderer.once("user_get_res", (event,currentUser) => callback(currentUser))
  },

  back:()=>{
    ipcRenderer.send("back:req");
  }
});