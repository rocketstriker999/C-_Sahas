import { requestHelper } from './helper.js';


let videoPlayerHandler = {};

videoPlayerHandler.videoPlayer = document.getElementById("YOUTUBE_IFRAME");
videoPlayerHandler.btnBack = document.getElementById("BTN_BACK");

//extract and generate get object passed from dashboard
videoPlayerHandler.video = Object.fromEntries(new URLSearchParams(window.location.search));

//Youtube Ifram URL set
videoPlayerHandler.videoPlayer.setAttribute("src", `https://www.youtube.com/embed/${videoPlayerHandler.video.vid_file}?vq=hd720`);

//Back Button Handler
videoPlayerHandler.btnBack.addEventListener("click",(e)=>{
    window.electron.back();
})
