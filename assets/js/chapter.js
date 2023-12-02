import { requestHelper } from './helper.js';

let chapterHandler = {};


chapterHandler.btnBack = document.getElementById("BTN_BACK");
chapterHandler.chapterName = document.getElementById("CHAPTER_NAME");
chapterHandler.chapterDescription = document.getElementById("CHAPTER_DESCRIPTION");

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