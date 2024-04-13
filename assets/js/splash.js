import { requestHelper } from './helper.js';

let splashHandler = {};

splashHandler.progress = document.getElementById("progress_splash");
splashHandler.appVersion = document.getElementById("APP_VERSION");

//set app version
splashHandler.appVersion.innerHTML=`V ${new URLSearchParams(window.location.search).get("version")}`;

//Check If Already Authorized and Logged Priviously
splashHandler.autoLogin = (email, password, deviceId) => {

  //Check If Credentials Exist - If Yes Check Login
  requestHelper.requestServer({
    requestPath: "userAccAuth.php?platform=windows", requestMethod: "POST", requestPostBody: {
      user_email: email,
      user_pass: password,
      user_device: deviceId
    }
  }).then(response=>response.json()).then(jsonResponse => {
      if (jsonResponse.isTaskSuccess=='true') {
        window.electron.setCurrentUser(jsonResponse.userAccData);
        window.location.href = 'dashBoard.html';
      }
      else {
        throw new Error("Pre Authentiation Failed");
      }
    }).catch(error => {
      window.location.href = 'login.html';
    });
};

//Add animation event listener, with attached function.
splashHandler.progress.addEventListener('animationend', () => {
  //Check Auto Login If User Had Already Logged In Earlier
  splashHandler.autoLogin(requestHelper.getData("LOGGEDINUSEREMAIL"), requestHelper.getData("LOGGEDINUSERPASSWORD"), requestHelper.getData("DEVICEID"));
});


