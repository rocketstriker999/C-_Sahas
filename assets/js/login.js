import { requestHelper } from './helper.js';


let loginHandler={};

loginHandler.deviceId= document.getElementById("DEVICE_ID");

loginHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`

