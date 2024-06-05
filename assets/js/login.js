import { requestHelper } from './helper.js';

let userOtp = '';
let loginHandler = {};

loginHandler.deviceId = document.getElementById("DEVICE_ID");
loginHandler.etxEmail = document.getElementById("ETX_EMAIL");
loginHandler.etxPassWord = document.getElementById("ETX_PASSWORD");
loginHandler.error = document.getElementById("ERROR");
loginHandler.etxEmailSendOtp = document.getElementById("ETX_EMAIL_SEND_OTP");
loginHandler.etxResetPasswrod = document.getElementById("ETX_RESET_PASSWORD");
loginHandler.counterEmail = document.getElementById("COUNTER_EMAIL");
loginHandler.counterPassWord = document.getElementById("COUNTER_PASSWORD");
loginHandler.btnLogin = document.getElementById("BTN_LOGIN");
loginHandler.btnGoogleLogin = document.getElementById("BTN_GOOGLE_LOGIN");
loginHandler.btnCreateAccout = document.getElementById("BTN_CREATE_ACCOUNT");
loginHandler.btnForgetPassword = document.getElementById("BTN_FORGET_PASSWORD");
loginHandler.btnSendOtp = document.getElementById("BTN_SEND_OTP");
loginHandler.btnResend = document.getElementById("BTN_RESEND");
loginHandler.btnVerify = document.getElementById("BTN_VERIFY");
loginHandler.btnChangePassword = document.getElementById("BTN_CHANGE_PASSWORD");
loginHandler.validationEmail = document.getElementById('VALIDATION_EMAIL');
loginHandler.validationPassword = document.getElementById('VALIDATION_PASSWORD');
loginHandler.validationEmailSendOtp = document.getElementById('VALIDATION_EMAIL_SEND_OTP');
loginHandler.validationOtpNumber = document.getElementById('VALIDATION_OTP_NUMBER');
loginHandler.validationResetPassword = document.getElementById('VALIDATION_RESET_PASSWORD');
loginHandler.otpNumber = document.getElementById('OTP_NUMBER');
loginHandler.forgetPasswordModal = document.getElementById('FORGET_PASSWORD_MODAL');
loginHandler.otpVerificationModal = document.getElementById('OTP_VERIFICATION_MODAL');
loginHandler.resetPasswordModal = document.getElementById('RESET_PASSWORD_MODAL');


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


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginHandler.etxEmail.value)) {
        loginHandler.setInputError('Please enter valid email address.', loginHandler.validationEmail, loginHandler.etxEmail)
        return false;
    }

    if (loginHandler.etxPassWord.value.length < 8) {
        loginHandler.setInputError('Please enter Valid Password', loginHandler.validationPassword, loginHandler.etxPassWord)
        return false;
    }

    return true;
}

loginHandler.setInputError = (error, validationArea, etx) => {
    validationArea.innerHTML = error;
    validationArea.style.display = 'block'
    etx.classList.add('invalid_edittext')
}

loginHandler.setAuthenticationError = (error) => {
    loginHandler.error.style.display = "block";
    loginHandler.error.innerHTML = error;
}

//google Login redirect to Google Signin Via Sahas Website
loginHandler.btnGoogleLogin.addEventListener("click", (e) => {
    window.electron.googleLogin((currentUser) => {

        requestHelper.requestServer({
            requestPath: "userAccAuthGoogle.php?platform=windows", requestMethod: "POST", requestPostBody: {
                user_name: currentUser.user_name,
                user_email: currentUser.user_email,
                user_phone: currentUser.user_phone,
                user_pass: currentUser.user_pass,
                refer_id: currentUser.signup_refer_user_index,
                user_device: requestHelper.getData("DEVICEID")
            }
        }).then(response => response.json()).then(jsonResponse => {
            if (jsonResponse.isTaskSuccess == 'true') {
                //save current user for next app run
                requestHelper.saveData("LOGGEDINUSEREMAIL", currentUser.user_email);
                requestHelper.saveData("LOGGEDINUSERPASSWORD", currentUser.user_pass);
                //save into current app memory
                window.electron.setCurrentUser(jsonResponse.userAccData);
                //redirect to dashboard
                window.location.href = 'dashBoard.html';
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => loginHandler.setAuthenticationError(error));

    });
});


loginHandler.btnLogin.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission

    if (loginHandler.validateInputs()) {

        requestHelper.requestServer({
            requestPath: "userAccAuth.php?platform=windows", requestMethod: "POST", requestPostBody: {
                user_email: loginHandler.etxEmail.value,
                user_pass: loginHandler.etxPassWord.value,
                user_device: requestHelper.getData("DEVICEID")
            }
        }).then(response => response.json()).then(jsonResponse => {
            console.log(jsonResponse)

            if (jsonResponse.isTaskSuccess == 'true') {
                //save current user for next app run
                requestHelper.saveData("LOGGEDINUSEREMAIL", loginHandler.etxEmail.value);
                requestHelper.saveData("LOGGEDINUSERPASSWORD", loginHandler.etxPassWord.value);
                //save into current app memory
                window.electron.setCurrentUser(jsonResponse.userAccData);
                //redirect to dashboard
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

loginHandler.btnForgetPassword.addEventListener("click", (e) => {
    loginHandler.forgetPasswordModal.style.display = 'block';
    loginHandler.etxEmailSendOtp.value = '';
    loginHandler.etxResetPasswrod.value = '';
    loginHandler.otpNumber.value = '';
});

loginHandler.btnSendOtp.addEventListener("click", (e) => {

    loginHandler.validationEmailSendOtp.style.display = "none";
    loginHandler.etxEmailSendOtp.classList.remove('invalid_edittext');
    e.preventDefault(); //Stop Form Submission

    if (loginHandler.etxEmailSendOtp.value) {

        requestHelper.requestServer({
            requestPath: "otpGeneration.php?platform=windows", requestMethod: "POST", requestPostBody: {
                user_email: loginHandler.etxEmailSendOtp.value,
                request_type: 'OTP_RESET_PASSWORD'
            }
        }).then(response => response.json()).then(jsonResponse => {
            if (jsonResponse.userAccData === null) {
                loginHandler.setInputError('Please enter valid email address.', loginHandler.validationEmailSendOtp, loginHandler.etxEmailSendOtp);
                return false;
            }

            userOtp = jsonResponse.userAccData.user_otp;
            if (jsonResponse.isTaskSuccess == 'true') {
                loginHandler.forgetPasswordModal.style.display = 'none';
                loginHandler.otpVerificationModal.style.display = 'block';
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => loginHandler.setAuthenticationError(error));
    }
    else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginHandler.etxEmailSendOtp.value)) {
            loginHandler.setInputError('Please enter valid email address.', loginHandler.validationEmailSendOtp, loginHandler.etxEmailSendOtp)
            return false;
        }
    }
});

loginHandler.btnVerify.addEventListener("click", (e) => {

    loginHandler.validationOtpNumber.style.display = "none";
    loginHandler.otpNumber.classList.remove('invalid_edittext');

    if (userOtp == loginHandler.otpNumber.value) {
        loginHandler.otpVerificationModal.style.display = 'none';
        loginHandler.resetPasswordModal.style.display = 'block';
    }
    else {
        loginHandler.setInputError('Please enter valid OTP.', loginHandler.validationOtpNumber, loginHandler.otpNumber)
    }
});

loginHandler.btnChangePassword.addEventListener("click", (e) => {
    
    loginHandler.etxResetPasswrod.classList.remove('invalid_edittext');
    e.preventDefault();
    if (loginHandler.etxResetPasswrod.value.length > 8) {
        requestHelper.requestServer({
            requestPath: "userUpdateProfile.php", requestMethod: "POST", requestPostBody: {
                user_email: loginHandler.etxEmailSendOtp.value,
                user_pass: loginHandler.etxResetPasswrod.value
            }
        }).then(response => response.json()).then(jsonResponse => {
            if (jsonResponse.isTaskSuccess == 'true') {
                //save into current app memory
                window.electron.setCurrentUser(jsonResponse.userAccData);
                loginHandler.resetPasswordModal.style.display = 'none';
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => console.log(error));
    }
    else {
        loginHandler.setInputError('Please enter valid Password.', loginHandler.validationResetPassword, loginHandler.etxResetPasswrod)
    }
});