import { requestHelper } from './helper.js';


let createAccountHandler = {};

createAccountHandler.deviceId = document.getElementById("DEVICE_ID");

createAccountHandler.etxUserName = document.getElementById("ETX_USERNAME");
createAccountHandler.etxEmail = document.getElementById("ETX_EMAIL");
createAccountHandler.etxPassWord = document.getElementById("ETX_PASSWORD");
createAccountHandler.etxPhone = document.getElementById("ETX_PHONE");
createAccountHandler.etxReferCode = document.getElementById("ETX_REFERCODE");


createAccountHandler.counterUserName = document.getElementById("COUNTER_USERNAME");
createAccountHandler.counterEmail = document.getElementById("COUNTER_EMAIL");
createAccountHandler.counterPassWord = document.getElementById("COUNTER_PASSWORD");
createAccountHandler.counterPhone = document.getElementById("COUNTER_PHONE");
createAccountHandler.counterReferCode = document.getElementById("COUNTER_REFERCODE");

createAccountHandler.error = document.getElementById("ERROR");

createAccountHandler.btnLogin = document.getElementById("BTN_LOGIN");
createAccountHandler.btnCreateAccout = document.getElementById("BTN_SIGNUP");

//Set Device Id From Storage Initially
createAccountHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;

createAccountHandler.etxUserName.addEventListener("input", (e) => {
    createAccountHandler.counterUserName.innerText = e.target.value.length + " / 22 characters";
    console.log("CALLED")
});

createAccountHandler.etxEmail.addEventListener("input", (e) => {
    createAccountHandler.counterEmail.innerText = e.target.value.length + " / 32 characters";
});

createAccountHandler.etxPassWord.addEventListener("input", (e) => {
    createAccountHandler.counterPassWord.innerText = e.target.value.length + " / 16 characters";
});

createAccountHandler.etxPhone.addEventListener("input", (e) => {
    createAccountHandler.counterPhone.innerText = e.target.value.length + " / 10 characters";
});

createAccountHandler.etxReferCode.addEventListener("input", (e) => {
    createAccountHandler.counterReferCode.innerText = e.target.value.length + " / 10 characters";
});


createAccountHandler.btnLogin.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission
    window.location.href = 'login.html'
});

createAccountHandler.setError=(error)=>{
    createAccountHandler.error.style.display="block";
    createAccountHandler.error.innerHTML=error;
}

createAccountHandler.validateInputs = () => {
    return true;
}

createAccountHandler.btnCreateAccout.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission

    if (createAccountHandler.validateInputs()) {

        requestHelper.requestServer({
            requestPath: "userAccNew.php", requestMethod: "POST", requestPostBody: {
                user_name: createAccountHandler.etxUserName.value,
                user_email: createAccountHandler.etxEmail.value,
                user_pass: createAccountHandler.etxPassWord.value,
                user_phone: createAccountHandler.etxPhone.value,
                refer_id:createAccountHandler.etxReferCode.value,
                user_device: requestHelper.getData("DEVICEID")
            }
        }).then(response=> response.json()).then(jsonResponse => {
            console.log(jsonResponse.isTaskSuccess)
            if (jsonResponse.isTaskSuccess=='true') {
                window.electron.setCurrentUser(jsonResponse.userAccData);
                window.location.href = 'dashBoard.html';
            }
            else {
                throw new Error("Create Account Failed : "+jsonResponse.response_msg);
            }
        }).catch(error => {
            console.log(error)
            //window.location.href = 'login.html';
        });
    }
});


