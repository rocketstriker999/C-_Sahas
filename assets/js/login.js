import { requestHelper } from './helper.js';


let loginHandler = {};

loginHandler.deviceId = document.getElementById("DEVICE_ID");

loginHandler.etxEmail = document.getElementById("ETX_EMAIL");
loginHandler.etxPassWord = document.getElementById("ETX_PASSWORD");
loginHandler.error = document.getElementById("ERROR");

loginHandler.counterEmail = document.getElementById("COUNTER_EMAIL");
loginHandler.counterPassWord = document.getElementById("COUNTER_PASSWORD");

loginHandler.btnLogin = document.getElementById("BTN_LOGIN");
loginHandler.btnCreateAccout = document.getElementById("BTN_CREATE_ACCOUNT");

//Set Device Id From Storage Initially
loginHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;

loginHandler.etxEmail.addEventListener("input", (e) => {
    loginHandler.counterEmail.innerText = e.target.value.length + " / 32 characters";
});

loginHandler.etxPassWord.addEventListener("input", (e) => {
    loginHandler.counterPassWord.innerText = e.target.value.length + " / 16 characters";
});

//Login Feild Validation
loginHandler.validateInputs = () => {
    return true;
}

loginHandler.setError = (error) => {
    loginHandler.error.style.display = "block";
    loginHandler.error.innerHTML = error;
}

loginHandler.btnLogin.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission

    if (loginHandler.validateInputs()) {

        requestHelper.requestServer({
            requestPath: "userAccAuth.php", requestMethod: "POST", requestPostBody: {
                user_email: loginHandler.etxEmail.value,
                user_pass: loginHandler.etxPassWord.value,
                user_device: requestHelper.getData("DEVICEID")
            }
        }).then(response => response.json()).then(jsonResponse => {
            console.log(jsonResponse.isTaskSuccess)
            if (jsonResponse.isTaskSuccess == 'true') {
                window.electron.setCurrentUser(jsonResponse.userAccData);
                window.location.href = 'dashBoard.html';
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => loginHandler.setError(error));

    }

});

loginHandler.btnCreateAccout.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission
    window.location.href = 'createAccount.html'
});

