import { requestHelper } from './helper.js';


let pdfPlayerHandler = {};

pdfPlayerHandler.pdfPlayer = document.getElementById("PDF_PLAYER");
pdfPlayerHandler.btnBack = document.getElementById("BTN_BACK");

//extract and generate get object passed from dashboard
pdfPlayerHandler.pdf = Object.fromEntries(new URLSearchParams(window.location.search));

//Back Button Handler
pdfPlayerHandler.btnBack.addEventListener("click",(e)=>{
    window.electron.back();
})
