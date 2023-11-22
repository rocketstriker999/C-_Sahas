import { requestHelper } from './helper.js';

console.log("Splash JS");

let splashHandler={};



splashHandler.progress = document.getElementById("progress_splash");

//Add animation event listener, with attached function.
splashHandler.progress.addEventListener('animationend', () => {
    console.log('Animation ended');
    window.location.href = 'login.html'  
  });