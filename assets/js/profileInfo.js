import { requestHelper } from './helper.js';


let profileInfoHandler = {};

profileInfoHandler.deviceId = document.getElementById("DEVICE_ID");
profileInfoHandler.emailId = document.getElementById("EMAIL_ID");
profileInfoHandler.extUsername = document.getElementById("ETX_USERNAME");
profileInfoHandler.extPhone = document.getElementById("ETX_PHONE");
profileInfoHandler.extPassword = document.getElementById("ETX_PASSWORD");
profileInfoHandler.extWallet = document.getElementById("ETX_WALLET");
profileInfoHandler.btnAppyDetails = document.getElementById("BTN_APPLYDETAILS");
profileInfoHandler.btnWidthdraw = document.getElementById("BTN_WIDTHDRAW");
profileInfoHandler.backToDashboard = document.getElementById("BTN_BACK_TO_DASHBOARD");
profileInfoHandler.btnEditUsernameIcon = document.getElementById('BTN_EDIT_USERNAME');
profileInfoHandler.btnEditPhoneIcon = document.getElementById('BTN_EDIT_PHONE');
profileInfoHandler.btnEditPasswordIcon = document.getElementById('BTN_EDIT_PASSWORD');
profileInfoHandler.profilePhoto = document.getElementById("PROFILE_PHOTO");
profileInfoHandler.validationUsername = document.getElementById("VALIDATION_USERNAME");
profileInfoHandler.validationPhone = document.getElementById("VALIDATION_PHONE");
profileInfoHandler.validationPassword = document.getElementById("VALIDATION_PASSWORD");
profileInfoHandler.widthdrawModel = document.getElementById("WIDTHDRAW_MODEL");
profileInfoHandler.closeModalBtn = document.getElementById("closeModalBtn");

profileInfoHandler.availableAmount = document.getElementById("AVAILABLE_AMOUNT");
profileInfoHandler.etxIfscCode = document.getElementById("ETX_IFSC_CODE");
profileInfoHandler.etxAccountNumber = document.getElementById("ETX_ACCOUNT_NUMBER");
profileInfoHandler.etxAccountHolderName = document.getElementById("ETX_ACCOUNT_HOLDER_NAME");
profileInfoHandler.etxWithdrawAmount = document.getElementById("ETX_WITHDRAW_AMOUNT");
profileInfoHandler.btnWidthdrawToAccount = document.getElementById("BTN_WIDTHDRAW_TO_ACCOUNT");
profileInfoHandler.btnBackToProfileInfo = document.getElementById("BTN_BACK_TO_PROFILEINFO");

profileInfoHandler.validateAcountHolderName = document.getElementById("VALIDATION_ACCOUNT_HOLDER_NAME");
profileInfoHandler.validateAcountNumber = document.getElementById("VALIDATION_ACCOUNT_NUMBER");
profileInfoHandler.validateIfscCode = document.getElementById("VALIDATION_IFSC_CODE");
profileInfoHandler.validateWithdrawAmount = document.getElementById("VALIDATION_WITHDRAW_AMOUNT");




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
  profileInfoHandler.availableAmount.innerHTML = `Available Amounts : ${currentUser.user_wallet}`
});

profileInfoHandler.validateWithdrawInputs = async () => {
  // Reset previous validation messages
  profileInfoHandler.validateAcountHolderName.style.display = "none";
  profileInfoHandler.validateAcountNumber.style.display = "none";
  profileInfoHandler.validateIfscCode.style.display = "none";
  profileInfoHandler.validateWithdrawAmount.style.display = "none";

  profileInfoHandler.etxIfscCode.classList.remove('invalid_edittext');
  profileInfoHandler.etxAccountNumber.classList.remove('invalid_edittext');
  profileInfoHandler.etxAccountHolderName.classList.remove('invalid_edittext');
  profileInfoHandler.etxWithdrawAmount.classList.remove('invalid_edittext');

  const currentUser = await new Promise((resolve) => {
    window.electron.getCurrentUser((user) => {
      resolve(user);
    });
  });

  if (profileInfoHandler.etxAccountHolderName.value.length === 0) {
    profileInfoHandler.setInputError('Please enter Account Holder Name', profileInfoHandler.validateAcountHolderName, profileInfoHandler.etxAccountHolderName);
    return false;
  }

  if (profileInfoHandler.etxAccountNumber.value.length === 0) {
    profileInfoHandler.setInputError('Please enter Account Number', profileInfoHandler.validateAcountNumber, profileInfoHandler.etxAccountNumber);
    return false;
  }

  if (profileInfoHandler.etxIfscCode.value.length === 0) {
    profileInfoHandler.setInputError('Please enter IFSC Code', profileInfoHandler.validateIfscCode, profileInfoHandler.etxIfscCode);
    return false;
  }

  if (profileInfoHandler.etxWithdrawAmount.value.length === 0) {
    profileInfoHandler.setInputError('Please enter Withdraw Amount', profileInfoHandler.validateWithdrawAmount, profileInfoHandler.etxWithdrawAmount);
    return false;
  }

  if (parseFloat(profileInfoHandler.etxWithdrawAmount.value) > currentUser.user_wallet) {
    profileInfoHandler.setInputError(`Available Amount: ${currentUser.user_wallet}`, profileInfoHandler.validateWithdrawAmount, profileInfoHandler.etxWithdrawAmount);
    return false;
  }

  return true;
};

profileInfoHandler.btnWidthdrawToAccount.addEventListener("click", async (e) => {
  e.preventDefault(); // Stop Form Submission
  const isValid = await profileInfoHandler.validateWithdrawInputs();

  if (isValid) {
    window.electron.getCurrentUser((currentUser) => {
      requestHelper.requestServer({
        requestPath: "walletWithDraw.php",
        requestMethod: "POST",
        requestPostBody: {
          user_email: currentUser.user_email,
          user_name: profileInfoHandler.etxAccountHolderName.value,
          withdraw_bank: profileInfoHandler.etxAccountNumber.value,
          withdraw_ifsc: profileInfoHandler.etxIfscCode.value,
          withdraw_amount: profileInfoHandler.etxWithdrawAmount.value,
        }
      }).then(response => response.json()).then(jsonResponse => {
        if (jsonResponse.isTaskSuccess == 'true') {
          // Show success popup alert
          alert("Withdrawal successful!");
          // Redirect to profileinfo.html page
          window.location.href = "profileinfo.html";
        } else {
          throw new Error(jsonResponse.response_msg);
        }
      }).catch(error => console.log(error));
    });
  }
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
  if (input == profileInfoHandler.extPassword) {
    if (profileInfoHandler.extPassword.type === "password") {
      profileInfoHandler.extPassword.type = "text";
      profileInfoHandler.btnEditPasswordIcon.classList.remove("fa-eye");
      profileInfoHandler.btnEditPasswordIcon.classList.add("fa-eye-slash");
    } else {
      profileInfoHandler.extPassword.type = "password";
      profileInfoHandler.btnEditPasswordIcon.classList.remove("fa-eye-slash");
      profileInfoHandler.btnEditPasswordIcon.classList.add("fa-eye");
    }
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

profileInfoHandler.btnWidthdraw.addEventListener("click", () => {
  profileInfoHandler.widthdrawModel.style.display = 'block';
});

profileInfoHandler.btnBackToProfileInfo.addEventListener("click", () => {
  profileInfoHandler.widthdrawModel.style.display = 'none';
});
