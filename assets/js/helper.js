
let requestHelper = {};

requestHelper.requestServer = async ({ requestHeaders = {}, requestPath = "/", requestMethod = "GET", requestGetQuery = false, requestPostBody = false } = {}) => {

    requestHeaders["Content-Type"] = "application/json";

    requestPath = "https://sahasinstitute.com/" + requestPath;

    requestMethod = requestMethod.toUpperCase();

    if (requestGetQuery) {
        requestPath = requestPath + '?'
        requestPath = requestPath + Object.keys(requestGetQuery).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(requestGetQuery[key])).join('&');
    }

    let fetchOptions = {
        // Adding headers to the request
        headers: requestHeaders,
        // Adding method type
        method: requestMethod,
        //Adding Cookies as well
        credentials: "same-origin",
    }

    // Adding body or contents to send
    //body: JSON.stringify(requestPostBody),
    
    if (requestPostBody){
        fetchOptions.body = JSON.stringify(requestPostBody)
    } 

    return fetch(requestPath, fetchOptions)
}


//returns current authentication token
requestHelper.getData = (key) => {
    return localStorage.getItem(key) === null ? false : localStorage.getItem(key);
}

//sets current authentication token
requestHelper.saveData = (key,value) => { localStorage.setItem(key, value) };


//Check Device Id Or Generate It
requestHelper.checkDeviceId = () =>{


    window.electron.getDeviceID((deviceId) => {
        requestHelper.saveData ("DEVICEID",deviceId);
    });

    requestHelper.saveData ("DEVICEID",requestHelper.getData("DEVICEID")?requestHelper.getData("DEVICEID"): window.electron.generateDeviceID());



}

requestHelper.checkDeviceId();

export { requestHelper }