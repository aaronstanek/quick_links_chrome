let linkTable = {
    "example\x1F0": "http://example.com",
    "w\x1F0": "https://en.wikipedia.org",
    "w\x1F1": "https://en.wikipedia.org/wiki/\x1F1\x1F",
    "w/talk\x1F1": "https://en.wikipedia.org/wiki/Talk:\x1F1\x1F",
    "g\x1F0": "https://www.google.com",
    "g\x1F1": "https://www.google.com/search?q=\x1F1\x1F",
    "g\x1F2": "https://www.google.com/search?q=\x1F5\x1F+site%3A\x1F2\x1F\x1E25"
};

function linkTableLookup(s) {
    let sections = s.split("/");
    let sectionConsider = sections.length;
    while (sectionConsider > 0) {
        let test = sections.slice(0,sectionConsider).join("/");
        let resultSet = linkTable[test];
        if (typeof resultSet === "undefined") {
            --sectionConsider;
            continue;
        }
        // we found a match
        // make sure that this takes the same number of arguments
        // as what we are providing
        let result = resultSet[sections.length - sectionConsider];
        if (typeof result === "undefined") {
            --sectionConsider;
            continue;
        }
        // we have an exact match
        // return this
        let remainder = sections.slice(sectionConsider,sections.length);
        remainder = remainder.map(encodeURIComponent);
        let output = [];
        for (let i = 0; i < remainder.length; ++i) {
            output.push(result[i]);
            output.push(remainder[i]);
        }
        output.push(result[result.length-1]);
        return output.join("");
    }
    // we did not find a match
    return "nomatch.html";
}

function omnibox(str, disposition) {
    let url = linkTableLookup(str);
    chrome.tabs.update({url});
}

chrome.omnibox.onInputEntered.addListener(omnibox);