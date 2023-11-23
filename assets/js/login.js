import { requestHelper } from './helper.js';


let loginHandler={};

loginHandler.deviceId= document.getElementById("DEVICE_ID");
loginHandler.btnLogin = document.getElementById("BTN_LOGIN");
loginHandler.btnCreateAccout = document.getElementById("BTN_CREATE_ACCOUNT");

//Set Device Id From Storage Initially
loginHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;

loginHandler.btnLogin.addEventListener("click",(e)=>{
    e.preventDefault(); //Stop Form Submission
    console.log("LOGIN");
});

loginHandler.btnCreateAccout.addEventListener("click",(e)=>{
    e.preventDefault(); //Stop Form Submission
    window.location.href = 'createAccount.html'  
});

