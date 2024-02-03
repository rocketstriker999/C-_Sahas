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
profileInfoHandler.btnEditUsernameIcon = document.getElementById('editUsernameIcon');
profileInfoHandler.btnEditPhoneIcon = document.getElementById('editPhoneIcon');
profileInfoHandler.btnEditPasswordIcon = document.getElementById('editPasswordIcon');


profileInfoHandler.backToDashboard.addEventListener("click", (e) => {
  window.location.href = 'dashBoard.html';
  window.electron.back();
});

//Set Device Id From Storage Initially
profileInfoHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;

//Set UserName From Storage Initially

async function fetchUserProfile() {
  window.electron.getCurrentUser((currentUser) => {
    profileInfoHandler.extUsername.value = currentUser.user_name;
    profileInfoHandler.emailId.innerHTML = currentUser.user_email;
    profileInfoHandler.extPhone.value = currentUser.user_phone;
    profileInfoHandler.extPassword.innerHTML = currentUser.user_pass;
    profileInfoHandler.extWallet.innerHTML = currentUser.user_wallet;
  });
}

profileInfoHandler.btnAppyDetails.addEventListener("click", (e) => {

  e.preventDefault(); //Stop Form Submission

  if (loginHandler.validateInputs()) {

    requestHelper.requestServer({
      requestPath: "userAccAuth.php", requestMethod: "POST", requestPostBody: {

      }
    }).then(response => response.json()).then(jsonResponse => {
      if (jsonResponse.isTaskSuccess == 'true') {

      }
      else
        throw new Error(jsonResponse.response_msg);
    }).catch(error => loginHandler.setAuthenticationError(error));
  }
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

document.addEventListener('DOMContentLoaded', fetchUserProfile);