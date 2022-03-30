function extractTextFromHTMLStr(htmlStr) {
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = htmlStr;
    return tmpDiv.textContent || tmpDiv.innerText;
}