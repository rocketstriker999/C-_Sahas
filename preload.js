const { ipcRenderer, contextBridge } = require("electron");
 
contextBridge.exposeInMainWorld("electron", {
  fun1: (data) => {
    ipcRenderer.send("entity1:event1", data);
  },
  fun2: (data) => {
    ipcRenderer.on("entity1:event2", (event, data) => {
      console.log(data);
      event.sender.send("entity2:event2", data);
    });
  },
});