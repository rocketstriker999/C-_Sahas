import { requestHelper } from './helper.js';


let loginHandler = {};

loginHandler.deviceId = document.getElementById("DEVICE_ID");

loginHandler.etxEmail = document.getElementById("ETX_EMAIL");
loginHandler.etxPassWord = document.getElementById("ETX_PASSWORD");
loginHandler.error = document.getElementById("ERROR");

loginHandler.counterEmail = document.getElementById("COUNTER_EMAIL");
loginHandler.counterPassWord = document.getElementById("COUNTER_PASSWORD");

loginHandler.btnLogin = document.getElementById("BTN_LOGIN");
loginHandler.btnGoogleLogin = document.getElementById("BTN_GOOGLE_LOGIN");
loginHandler.btnCreateAccout = document.getElementById("BTN_CREATE_ACCOUNT");
loginHandler.validationEmail = document.getElementById('VALIDATION_EMAIL');
loginHandler.validationPassword = document.getElementById('VALIDATION_PASSWORD');


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
    // Reset previous validation messages
    loginHandler.validationEmail.style.display = "none";
    loginHandler.validationPassword.style.display = "none";
    loginHandler.etxEmail.classList.remove('invalid_edittext');
    loginHandler.etxPassWord.classList.remove('invalid_edittext');

            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginHandler.etxEmail.value)){
                loginHandler.setInputError('Please enter valid email address.',loginHandler.validationEmail,loginHandler.etxEmail)
                return false;
            }

            if (loginHandler.etxPassWord.value.length < 8) {
                loginHandler.setInputError('Please enter Valid Password',loginHandler.validationPassword,loginHandler.etxPassWord)
                return false;
            }

            return true;
}

loginHandler.setInputError=(error,validationArea,etx)=>{
    validationArea.innerHTML=error;
    validationArea.style.display='block'
    etx.classList.add('invalid_edittext')
}

loginHandler.setAuthenticationError = (error) => {
    loginHandler.error.style.display = "block";
    loginHandler.error.innerHTML = error;
}

//google Login redirect to Google Signin Via Sahas Website
loginHandler.btnGoogleLogin.addEventListener("click", (e) => {
    window.electron.openGoogleLogin();
})

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
        }).catch(error => loginHandler.setAuthenticationError(error));

    }

});

loginHandler.btnCreateAccout.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission
    window.location.href = 'createAccount.html'
});

