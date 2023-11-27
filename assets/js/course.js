import { requestHelper } from './helper.js';

let courseHandler = {};

courseHandler.courseImage = document.getElementById("COURSE_IMG");
courseHandler.courseName = document.getElementById("COURSE_NAME");
courseHandler.courseDescription = document.getElementById("COURSE_DESCRIPTION");
courseHandler.courseSubjects = document.getElementById("COURSE_SUBJECTS");
courseHandler.containerSubjects = document.getElementById("CONTAINER_SUBJECTS");
courseHandler.coursePurchaseInfo = document.getElementById("COURSE_PURCHASE_INFO");
courseHandler.btnBack = document.getElementById("BTN_BACK");
courseHandler.btnPurchaseCourse = document.getElementById("BTN_BUY");


//extract and generate get object passed from dashboard
courseHandler.course = Object.fromEntries(new URLSearchParams(window.location.search));

//Set Image For Course
courseHandler.courseImage.src = `${requestHelper.serverAddress}/thumbnails/${courseHandler.course.std_image}`;
//set name
courseHandler.courseName.innerHTML = courseHandler.course.std_name;
courseHandler.courseDescription.innerHTML = courseHandler.course.std_desc;
courseHandler.courseSubjects.innerHTML = `${courseHandler.course.sub_count} Subjects`;

//Back Button Click
courseHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});

//Set UserName From Storage Initially
window.electron.getCurrentUser((currentUser) => {

    requestHelper.requestServer({
        requestPath: "getStdAuth.php", requestMethod: "POST", requestPostBody: {
            user_email: currentUser.user_email,
            std_name: courseHandler.course.std_name,
            is_combo: courseHandler.course.combo_id
        }
    }).then(response => response.json()).then(jsonResponse => {
        console.log(JSON.stringify(jsonResponse))
        //Check If Course Is Been Purchased By User
        courseHandler.isCoursePurchased = jsonResponse.isTaskSuccess == 'true';

        if (courseHandler.isCoursePurchased) {
            //User Has Already Purchased This Course
            courseHandler.btnPurchaseCourse.style.display="none"
            courseHandler.showPurchaseInfo(jsonResponse.purchaseData);
        }
        else {
            //User Has Not Purchased This Course
            courseHandler.btnPurchaseCourse.innerHTML="Purchase Course"
            courseHandler.btnPurchaseCourse.addEventListener("click",courseHandler.startPurchaseFlow);
        }

        //Pass Parameter if Demo Button is needed To Show Or not
        courseHandler.loadSubjects()

    }).catch(error => {
            console.warn(error);
    })
});



//Get Subject List
courseHandler.loadSubjects = () => {

    requestHelper.requestServer({
        requestPath: "getSubs.php", requestMethod: "POST", requestPostBody: {
            std_name: courseHandler.course.std_name,
            combo_id: courseHandler.course.combo_id,
        }
    })
        .then(response => response.json()).then(jsonResponse => {
            if (jsonResponse.isTaskSuccess == 'true') {
                //Load Subject List
                //Clear Current Subjects First
                courseHandler.containerSubjects.innerHTML = "";
                //Iterate through all subjects
                jsonResponse.subData.forEach(subject => {
                    //generate and add subject element to container
                    courseHandler.containerSubjects.innerHTML +=
                        `<div class="card card_subject">
                    <img src="${requestHelper.serverAddress}/thumbnails/${subject.sub_img}"/>
                    <div class="padding_1">
                        <p class="text_normal bold">${subject.sub_name}</p>
                        <p class="margin_top">${subject.sub_desc}</p>
                        <div class="margin_top">
                            <a class="bold btn_chapters" href="#">${subject.chapCount} Chapters</a>` +
                            (courseHandler.isCoursePurchased ? `` : `<a class="bold btn_demo" href="#">View Demo</a>`) +
                        `</div>
                    </div>
                </div>`;
                });
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => console.warn(error));

}


//show purchase info
courseHandler.showPurchaseInfo=(purchaseData)=>{
    courseHandler.coursePurchaseInfo.style.display='block';
    courseHandler.coursePurchaseInfo.innerHTML=`Your Access To This Course is Valid From ${purchaseData[0].purchase_date} To ${purchaseData[0].expire_date}`;
}

//Start purchase Flow
courseHandler.startPurchaseFlow=()=>{

}




