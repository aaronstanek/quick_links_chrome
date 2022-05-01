function replace(str) {
    return "http://example.com";
}

function omnibox(str, disposition) {
    let url = replace(str);
    chrome.tabs.update({url});
}

chrome.omnibox.onInputEntered.addListener(omnibox);