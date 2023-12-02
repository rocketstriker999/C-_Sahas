import { requestHelper } from './helper.js';

let subjectHandler = {};

subjectHandler.subjectImage = document.getElementById("SUBJECT_IMG");
subjectHandler.subjectName = document.getElementById("SUBJECT_NAME");
subjectHandler.subjectDescription = document.getElementById("SUBJECT_DESCRIPTION");
subjectHandler.subjectChapters = document.getElementById("SUBJECT_CHAPTERS");
subjectHandler.subjectLock = document.getElementById("SUBJECT_LOCK");
subjectHandler.btnBack = document.getElementById("BTN_BACK");
subjectHandler.containerChapters = document.getElementById("CONTAINER_CHAPTERS");


//extract and generate get object passed from dashboard
subjectHandler.subject = Object.fromEntries(new URLSearchParams(window.location.search));

//Set Image For Subject
subjectHandler.subjectImage.src = `${requestHelper.serverAddress}/thumbnails/${subjectHandler.subject.sub_img}`;

//Back Button Click
subjectHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});

console.log(JSON.stringify(subjectHandler.subject))

//set name
subjectHandler.subjectName.innerHTML = subjectHandler.subject.sub_name;
//set description
subjectHandler.subjectDescription.innerHTML = subjectHandler.subject.sub_desc;
//set number of chapters
subjectHandler.subjectChapters.innerHTML = `${subjectHandler.subject.chapCount} Chapters`;
//show buy notice if not bought
if (subjectHandler.subject.isCoursePurchased == "false") {
    subjectHandler.subjectLock.style.display = 'block';
}

subjectHandler.showChapters = (chapterData) => {

    //Clear The list
    subjectHandler.containerChapters.innerHTML = "";

    chapterData.forEach((chapter,position) => {

        const containerChapter = document.createElement("div");
        containerChapter.classList.add("container_chpater");

        const imageLock = document.createElement("i");
        imageLock.classList.add("fa-solid");
        imageLock.classList.add("fa-lock");
        imageLock.classList.add("icon_lock");

        const chapterTitle = document.createElement("p");
        chapterTitle.classList.add("chapter_title");
        chapterTitle.innerHTML = `${position+1}. ${chapter.chap_name}`

        const chapterDescription = document.createElement("p");
        chapterDescription.classList.add("margin_top");
        chapterDescription.classList.add("text_normal");
        chapterDescription.innerHTML = chapter.chap_sub_name

        //creating chapter container
        if (subjectHandler.subject.isCoursePurchased=="false")
            containerChapter.appendChild(imageLock)
        containerChapter.appendChild(chapterTitle)
        containerChapter.appendChild(chapterDescription)

        //add to list
        subjectHandler.containerChapters.appendChild(containerChapter);

        //create a divider
        const divider = document.createElement("div");
        divider.classList.add("divider");

        //add divider
        subjectHandler.containerChapters.appendChild(divider);

        //Open Chapter Content
        containerChapter.addEventListener("click", (e) => {
            if (subjectHandler.subject.isCoursePurchased=="false")
                subjectHandler.subjectLock.classList.add("error")
            else
                window.location.href = `chapter.html?${new URLSearchParams(chapter).toString()}`;
        });

    });

}

//Get Chapters List
window.electron.getCurrentUser((currentUser) => {

    requestHelper.requestServer({
        requestPath: "getChaps.php", requestMethod: "POST", requestPostBody: {
            sub_id: subjectHandler.subject.sub_id
        }
    }).then(response => response.json()).then(jsonResponse => {
        //get The Chapters List
        if (jsonResponse.isTaskSuccess == "true") {
            console.log(JSON.stringify(jsonResponse));
            //load chapter list
            subjectHandler.showChapters(jsonResponse.chapData)

        } else
            throw new Error(jsonResponse.response_msg);
    }).catch(error => {
        console.warn(error);
    })
});