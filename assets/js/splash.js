import { requestHelper } from './helper.js';

let splashHandler={};

splashHandler.progress = document.getElementById("progress_splash");

//Check If Already Authorized and Logged Priviously

//Add animation event listener, with attached function.
splashHandler.progress.addEventListener('animationend', () => {

      //Check If Credentials Exist - If Yes Check Login

      //Else
      window.location.href = 'login.html';
  });
