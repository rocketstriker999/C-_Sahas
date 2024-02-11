const { ipcRenderer, contextBridge } = require("electron");
 
contextBridge.exposeInMainWorld("electron", {
  getDeviceID: (callBack) => {
    ipcRenderer.send("device_id_get");
    ipcRenderer.once("device_id_get_res", (event,deviceId) => {
      callBack(deviceId);
    });
  },
  googleLogin:(callBack)=>{
    ipcRenderer.send("google_login_get");
    ipcRenderer.once("google_login_get_res", (event,googleLoginUser) => {
      callBack(googleLoginUser);
    });
  },
  setCurrentUser:(userData)=>{
    ipcRenderer.send("user_set",userData);
  },
  getCurrentUser: (callBack) => {
    ipcRenderer.send("user_get");
    ipcRenderer.once("user_get_res", (event,currentUser) => callBack(currentUser))
  },
  logOutCurrentUser : ()=>{
    ipcRenderer.send("user_logout_get");
  },
  downloadPurchaseReceipt : (receipt)=>{
    ipcRenderer.send("receipt_get",receipt);
  },
  back:()=>{
    ipcRenderer.send("back_get");
  }
});