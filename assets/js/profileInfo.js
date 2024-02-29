import { requestHelper } from './helper.js';


let profileInfoHandler = {};

profileInfoHandler.deviceId = document.getElementById("DEVICE_ID");
profileInfoHandler.emailId = document.getElementById("EMAIL_ID");
profileInfoHandler.extUsername = document.getElementById("ETX_USERNAME");
profileInfoHandler.extPhone = document.getElementById("ETX_PHONE");
profileInfoHandler.extPassword = document.getElementById("ETX_PASSWORD");
profileInfoHandler.extWallet = document.getElementById("ETX_WALLET");
profileInfoHandler.btnAppyDetails = document.getElementById("BTN_APPLYDETAILS");
profileInfoHandler.btnWallet = document.getElementById("BTN_WALLET");
profileInfoHandler.backToDashboard = document.getElementById("BTN_BACK_TO_DASHBOARD");
profileInfoHandler.btnEditUsernameIcon = document.getElementById('BTN_EDIT_USERNAME');
profileInfoHandler.btnEditPhoneIcon = document.getElementById('BTN_EDIT_PHONE');
profileInfoHandler.btnEditPasswordIcon = document.getElementById('BTN_EDIT_PASSWORD');
profileInfoHandler.profilePhoto = document.getElementById("PROFILE_PHOTO");
profileInfoHandler.validationUsername = document.getElementById("VALIDATION_USERNAME");
profileInfoHandler.validationPhone = document.getElementById("VALIDATION_PHONE");
profileInfoHandler.validationPassword = document.getElementById("VALIDATION_PASSWORD");

//Back to Dashboard button
profileInfoHandler.backToDashboard.addEventListener("click", (e) => {
  window.location.href = 'dashBoard.html';
  window.electron.back();
});

//Set Device Id From Storage Initially
profileInfoHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;

//Set UserName From Storage Initially
window.electron.getCurrentUser((currentUser) => {
  profileInfoHandler.profilePhoto.src = `${requestHelper.serverAddress}/mobileApis/userImgs/${currentUser.user_img}`;
  profileInfoHandler.extUsername.value = currentUser.user_full_name;
  profileInfoHandler.emailId.innerHTML = currentUser.user_email;
  profileInfoHandler.extPhone.value = currentUser.user_phone;
  profileInfoHandler.extPassword.value = currentUser.user_pass;
  profileInfoHandler.extWallet.innerHTML = currentUser.user_wallet;
});

profileInfoHandler.validateInputs = () => {
  // Reset previous validation messages
  profileInfoHandler.validationUsername.style.display = "none";
  profileInfoHandler.validationPhone.style.display = "none";
  profileInfoHandler.validationPassword.style.display = "none";
  profileInfoHandler.extUsername.classList.remove('invalid_edittext');
  profileInfoHandler.extPhone.classList.remove('invalid_edittext');
  profileInfoHandler.extPassword.classList.remove('invalid_edittext');

  if (profileInfoHandler.extUsername.value.length < 3) {
    profileInfoHandler.setInputError('Please enter Valid Username', profileInfoHandler.validationUsername, profileInfoHandler.extUsername)
    return false;
  }

  if (profileInfoHandler.extPhone.value.length < 10) {
    profileInfoHandler.setInputError('Please enter Valid Phone number', profileInfoHandler.validationPhone, profileInfoHandler.extPhone)
    return false;
  }

  if (profileInfoHandler.extPassword.value.length < 8) {
    profileInfoHandler.setInputError('Minimum 8 character required', profileInfoHandler.validationPassword, profileInfoHandler.extPassword)
    return false;
  }

  return true;
}

profileInfoHandler.setInputError = (error, validationArea, etx) => {
  validationArea.innerHTML = error;
  validationArea.style.display = 'block'
  etx.classList.add('invalid_edittext')
}

profileInfoHandler.btnAppyDetails.addEventListener("click", (e) => {

  e.preventDefault(); //Stop Form Submission
  window.electron.getCurrentUser((currentUser) => {
    if (profileInfoHandler.validateInputs()) {
      requestHelper.requestServer({
        requestPath: "userUpdateProfile.php", requestMethod: "POST", requestPostBody: {
          user_email: currentUser.user_email,
          user_full_name: profileInfoHandler.extUsername.value,
          user_phone: profileInfoHandler.extPhone.value,
        }
      }).then(response => response.json()).then(jsonResponse => {
        if (jsonResponse.isTaskSuccess == 'true') {
          //save into current app memory
          window.electron.setCurrentUser(jsonResponse.userAccData);
        }
        else
          throw new Error(jsonResponse.response_msg);
      }).catch(error => console.log(error));
    }
  });
});

function toggleEditableState(input) {
  input.readOnly = !input.readOnly;
  if (!input.readOnly) {
    input.focus();
  }
}

profileInfoHandler.btnEditUsernameIcon.addEventListener('click', () => {
  toggleEditableState(profileInfoHandler.extUsername);
});

profileInfoHandler.btnEditPasswordIcon.addEventListener('click', () => {
  toggleEditableState(profileInfoHandler.extPassword);
});

profileInfoHandler.btnEditPhoneIcon.addEventListener('click', () => {
  toggleEditableState(profileInfoHandler.extPhone);
});


