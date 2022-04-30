function repalce(str) {
    return "page.html";
}

chrome.omnibox.onInputEntered.addListener(
    (url, disposition) => {
        url = repalce(url);
        chrome.tabs.update({url});
    }
);