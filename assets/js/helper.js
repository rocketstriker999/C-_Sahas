let requestHelper = {};

requestHelper.requestServer = ({ requestHeaders = { "Authorization": "Bearer " + requestHelper.getToken() }, requestPath = "/", requestMethod = "GET", requestGetQuery = false, requestPostBody = {}, requestCallBack = false } = {}) => {
    requestMethod = requestMethod.toUpperCase();
    requestPostBody = JSON.stringify(requestPostBody);

    if (requestGetQuery) {
        requestPath = requestPath + '?'
        requestPath = requestPath + Object.keys(requestGetQuery).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(requestGetQuery[key])).join('&');
    }

    let apiRequest = new XMLHttpRequest();
    apiRequest.open(requestMethod, requestPath, true);
    apiRequest.setRequestHeader("Content-type", "application/json");
    Object.keys(requestHeaders).map(headerKey => apiRequest.setRequestHeader(headerKey, requestHeaders[headerKey]));
    apiRequest.onreadystatechange = () => {
        if (apiRequest.readyState == XMLHttpRequest.DONE) {

            //uiHelper.updateUI(apiRequest.getResponseHeader('content-type').split('/')[1] != "json" ? apiRequest.responseText : false)

            let parsedResponse = JSON.parse(apiRequest.responseText)

            uiHelper.loadTemplateView(parsedResponse)

            if (requestCallBack)
                requestCallBack(apiRequest.status, JSON.parse(apiRequest.responseText));
        }
    }
    apiRequest.send(requestPostBody);
}

//returns current authentication token
requestHelper.getToken = () => {
    return localStorage.getItem("token") === null ? false : localStorage.getItem("token");
}

//sets current authentication token
requestHelper.setToken = (token) => {
    localStorage.setItem("token", token);
}

export { requestHelper }