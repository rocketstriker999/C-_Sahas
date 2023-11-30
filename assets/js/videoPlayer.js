import { requestHelper } from './helper.js';


let videoPlayerHandler = {};

videoPlayerHandler.videoPlayer=document.getElementById("VIDEO_PLAYER");

//extract and generate get object passed from dashboard
videoPlayerHandler.video = Object.fromEntries(new URLSearchParams(window.location.search));

videoPlayerHandler.videoPlayer.setAttribute("src", `https://www.youtube.com/embed/${videoPlayerHandler.video.vid_file}?vq=hd720`);

const player = new Plyr('#player', {
    title: 'Video',
    
  });

  player.on('ready', event => {
    $('.plyr__control[data-plyr="fullscreen"]').hide();
    //$('.plyr__control[data-plyr="settings"]').hide();
    //$('.plyr__controls__item[data-plyr="volume"]').hide();
    //$('.plyr__volume').hide();
    console.log("CALLEEED")
    
  });  
