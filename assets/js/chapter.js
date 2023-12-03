import { requestHelper } from './helper.js';

let chapterHandler = {};


chapterHandler.btnBack = document.getElementById("BTN_BACK");
chapterHandler.chapterName = document.getElementById("CHAPTER_NAME");
chapterHandler.chapterDescription = document.getElementById("CHAPTER_DESCRIPTION");
chapterHandler.containerTabs = document.querySelectorAll('.tab');
chapterHandler.containerChapterData = document.getElementById("CONTAINER_CHAPTER_DATA");


//extract and generate get object passed from dashboard
chapterHandler.chapter = Object.fromEntries(new URLSearchParams(window.location.search));

//set up details
chapterHandler.chapterName.innerHTML = chapterHandler.chapter.chap_name
chapterHandler.chapterDescription.innerHTML = chapterHandler.chapter.chap_sub_name

//Back Button Click
chapterHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});

//Tab click Handler
chapterHandler.containerTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        //Remove Active Class from all tab
        chapterHandler.containerTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        //add active class to selected tab only
        e.target.classList.add("active");

        //Clear the existing Demo Data
        chapterHandler.containerChapterData.innerHTML = "";

        switch (e.target.innerHTML) {

            case "Videos":
                chapterHandler.showVideos()
                break;

            case "Audios":
                chapterHandler.showAudios()
                break;

            case "PDFs":
                chapterHandler.showPDFs()
                break;

        }
    });
});

chapterHandler.showNoDemoContentFound = () => {
    const noContentFound = document.createElement("p");
    noContentFound.classList.add("title_secondary");
    noContentFound.classList.add("padding_2");
    noContentFound.innerText = "No Content Found Here"
    chapterHandler.containerChapterData.appendChild(noContentFound)

}

chapterHandler.showVideos = () => {

    if (chapterHandler.videos && chapterHandler.videos.length > 0) {

        chapterHandler.videos.forEach(video => {

            const containerVideo = document.createElement("div");
            containerVideo.classList.add("container_content_item");

            //Image Of The Course
            const videoImage = document.createElement("img");
            videoImage.classList.add("content_item_image");
            videoImage.src = `http://img.youtube.com/vi/${video.vid_file}/0.jpg`;

            //container of video text
            const containerVideoInfo = document.createElement("div");
            containerVideoInfo.classList.add("container_content_item_info");

            //Video Title
            const videoTitle = document.createElement("p");
            videoTitle.classList.add("content_item_title");
            videoTitle.innerText = video.vid_name

            //Video Text
            const videoDescription = document.createElement("p");
            videoDescription.classList.add("margin_top");
            videoDescription.innerText = video.vid_desc

            //Adding text into video text container
            containerVideoInfo.appendChild(videoTitle)
            containerVideoInfo.appendChild(videoDescription)

            containerVideo.appendChild(videoImage);
            containerVideo.appendChild(containerVideoInfo);

            //Add Video To Container
            chapterHandler.containerChapterData.appendChild(containerVideo);

            //click handler
            containerVideo.addEventListener("click", (e) => {
                window.location.href = `videoPlayer.html?${new URLSearchParams(video).toString()}`;
            })

        });
    }
    else
        chapterHandler.showNoDemoContentFound()
}

chapterHandler.showPDFs = () => {
    if (chapterHandler.PDFs && chapterHandler.PDFs.length > 0) {

        chapterHandler.PDFs.forEach(pdf => {

            const containerPdf = document.createElement("div");
            containerPdf.classList.add("container_content_item");

            //Image Of The Course
            const pdfImage = document.createElement("img");
            pdfImage.classList.add("content_item_image");
            pdfImage.src = `../img/pdf.png`;

            //container of pdf text
            const containerPdfInfo = document.createElement("div");
            containerPdfInfo.classList.add("container_content_item_info");

            //pdf Title
            const pdfTitle = document.createElement("p");
            pdfTitle.classList.add("content_item_title");
            pdfTitle.innerText = pdf.pdf_name

            //pdf Text
            const pdfDescription = document.createElement("p");
            pdfDescription.classList.add("margin_top");
            pdfDescription.innerText = pdf.pdf_desc

            //Adding text into pdf text container
            containerPdfInfo.appendChild(pdfTitle)
            containerPdfInfo.appendChild(pdfDescription)

            containerPdf.appendChild(pdfImage);
            containerPdf.appendChild(containerPdfInfo);

            //Add pdf To Container
            chapterHandler.containerChapterData.appendChild(containerPdf);

            //click handler
            containerPdf.addEventListener("click", (e) => {
                window.location.href = `pdfPlayer.html?${new URLSearchParams(pdf).toString()}`;
            })

        });
    }
    else
        chapterHandler.showNoDemoContentFound()
}

chapterHandler.showAudios = () => {

    if (chapterHandler.audios && chapterHandler.audios.length > 0) {

        chapterHandler.audios.forEach(audio => {

            const containerAudio = document.createElement("div");
            containerAudio.classList.add("container_content_item");

            //Image Of The Course
            const audioImage = document.createElement("img");
            audioImage.classList.add("content_item_image");
            audioImage.src = `../img/audio.png`;

            //container of audio text
            const containerAudioInfo = document.createElement("div");
            containerAudioInfo.classList.add("container_content_item_info");

            //audio Title
            const audioTitle = document.createElement("p");
            audioTitle.classList.add("content_item_title");
            audioTitle.innerText = audio.aud_name

            //audio Text
            const audioDescription = document.createElement("p");
            audioDescription.classList.add("margin_top");
            audioDescription.innerText = audio.aud_desc

            //Adding text into audio text container
            containerAudioInfo.appendChild(audioTitle)
            containerAudioInfo.appendChild(audioDescription)

            containerAudio.appendChild(audioImage);
            containerAudio.appendChild(containerAudioInfo);

            //Add audio To Container
            chapterHandler.containerChapterData.appendChild(containerAudio);

            //click handler
            containerAudio.addEventListener("click", (e) => {

            })

        });
    }
    else
        chapterHandler.showNoDemoContentFound()

}

//Fetch Intially All Content
requestHelper.requestServer({
    requestPath: "getContent.php", requestMethod: "POST", requestPostBody: {
        chap_id: chapterHandler.chapter.chap_id,
    }
}).then(response => response.json()).then(jsonResponse => {
    console.log(JSON.stringify(jsonResponse));

    //Put In Global Varibale To Access Later
    chapterHandler.videos = jsonResponse.vidData;
    chapterHandler.PDFs = jsonResponse.pdfData;
    chapterHandler.audios = jsonResponse.audData;

    //Select Video Defaultly
    chapterHandler.containerTabs[0].click();

});

