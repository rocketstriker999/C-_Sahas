import { requestHelper } from './helper.js';

let pdfPlayerHandler = {};

pdfPlayerHandler.pdfPlayer = document.getElementById("PDF_PLAYER");
pdfPlayerHandler.btnBack = document.getElementById("BTN_BACK");
pdfPlayerHandler.btnDownload = document.getElementById("BTN_DOWNLOAD");

//extract and generate get object passed from dashboard
pdfPlayerHandler.pdf = Object.fromEntries(new URLSearchParams(window.location.search));

//Back Button Handler
pdfPlayerHandler.btnBack.addEventListener("click",(e)=>{
    window.electron.back();
})

//Make Button Visible if download is enabled
if(pdfPlayerHandler.pdf.pdf_sharable == "true"){
    pdfPlayerHandler.btnDownload.style.display="block"

    //Handle Click Event
    pdfPlayerHandler.btnDownload.addEventListener("click",(e)=>{
        window.location.href=`https://drive.google.com/uc?authuser=0&id=${pdfPlayerHandler.pdf.pdf_file}&export=download`;
    });
}