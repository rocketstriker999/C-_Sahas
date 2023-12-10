import { requestHelper } from './helper.js';

let purchaseHandler = {};

purchaseHandler.courseImage = document.getElementById("COURSE_IMG");
purchaseHandler.courseName = document.getElementById("COURSE_NAME");
purchaseHandler.courseDescription = document.getElementById("COURSE_DESCRIPTION");
purchaseHandler.courseSubjects = document.getElementById("COURSE_SUBJECTS");
purchaseHandler.courseOriginalPrice = document.getElementById("COURSE_ORIGINAL_PRICE");
purchaseHandler.courseDiscount = document.getElementById("COURSE_DISCOUNT");
purchaseHandler.coursePayPrice = document.getElementById("COURSE_PRICE_PAY");
purchaseHandler.etxCoupon = document.getElementById("ETX_COUPON");

purchaseHandler.btnBack = document.getElementById("BTN_BACK");
purchaseHandler.btnPurchaseCourse = document.getElementById("BTN_BUY");

//extract and generate get object passed from dashboard
purchaseHandler.course = Object.fromEntries(new URLSearchParams(window.location.search));
//Set Image For Course
purchaseHandler.courseImage.src = `${requestHelper.serverAddress}/thumbnails/${purchaseHandler.course.std_image}`;
//set name
purchaseHandler.courseName.innerHTML = purchaseHandler.course.std_name;
//set description
purchaseHandler.courseDescription.innerHTML = purchaseHandler.course.std_desc;
//set number of subject
purchaseHandler.courseSubjects.innerHTML = `${purchaseHandler.course.sub_count} Subjects`;
//Set Course Price
purchaseHandler.courseOriginalPrice.innerHTML = `Course Price : ${purchaseHandler.course.std_price}.rs`;
//Set Same Course Price To Pay
purchaseHandler.course.pricePay = purchaseHandler.course.std_price;
purchaseHandler.course.discount = 0;
purchaseHandler.coursePayPrice.innerHTML = `Price To Pay : ${purchaseHandler.course.pricePay}.rs`;


//Open Purchase Flow
purchaseHandler.btnPurchaseCourse.addEventListener("click", (e) => {

     //Get User Info
     window.electron.getCurrentUser((currentUser) => {

        if (currentUser.user_wallet >= purchaseHandler.course.std_price) {
            //Direct Purchase
            console.log("DIRECT ACCESS")
        }
        else {
            //Open Payu Money Gateway
            console.log("PAYMENT GATEWAY")
        }
    });

});



purchaseHandler.setCuoponCodeError = (error) => {
    purchaseHandler.error.style.display = "block";
    purchaseHandler.error.innerHTML = error;
}

purchaseHandler.handleCouponCode = (e) => {
    if (e.target.value.length > 2) {
        requestHelper.requestServer({
            requestPath: "validateReferalCode.php", requestMethod: "POST", requestPostBody: {
                referal_code: purchaseHandler.etxCoupon.value,
                std_name: purchaseHandler.course.std_name,
                course_original_price: purchaseHandler.course.std_price
            }
        }).then(response => response.json()).then(jsonResponse => {
            purchaseHandler.course.discount = (jsonResponse.isTaskSuccess == "true" && jsonResponse.referal_discount > 0) ? jsonResponse.referal_discount : 0;
            purchaseHandler.updatePayPrice()
        }).catch(error => {
            purchaseHandler.course.discount = 0;
            purchaseHandler.updatePayPrice()
        });
    }
}

purchaseHandler.updatePayPrice = () => {

    if (purchaseHandler.course.discount > 0) {
        purchaseHandler.etxCoupon.classList.add("promo_success")
        purchaseHandler.courseDiscount.style.display = 'block';
        purchaseHandler.courseDiscount.innerHTML = `Applied Discount : -${(purchaseHandler.course.std_price * purchaseHandler.course.discount / 100)} rs (${purchaseHandler.course.discount}%)`;
        purchaseHandler.course.pricePay = purchaseHandler.course.std_price - (purchaseHandler.course.std_price * purchaseHandler.course.discount / 100)
    }
    else {
        purchaseHandler.etxCoupon.classList.remove("promo_success")
        purchaseHandler.courseDiscount.style.display = 'none';
        purchaseHandler.course.pricePay = purchaseHandler.course.std_price;
    }
    purchaseHandler.coursePayPrice.innerHTML = `Price To Pay : ${purchaseHandler.course.pricePay}.rs`;
}

//on coupon code text change
purchaseHandler.etxCoupon.addEventListener("keyup", purchaseHandler.handleCouponCode);
purchaseHandler.etxCoupon.addEventListener("change", purchaseHandler.handleCouponCode);
purchaseHandler.etxCoupon.addEventListener("paste", purchaseHandler.handleCouponCode);

//Back Button Click
purchaseHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});