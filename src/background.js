let linkTable = {
    "example": {
        0: ["http://example.com"]
    },
    "w": {
        0: ["https://en.wikipedia.org"],
        1: ["https://en.wikipedia.org/wiki/",""]
    },
    "w/talk": {
        1: ["https://en.wikipedia.org/wiki/Talk:",""]
    },
    "g": {
        0: ["https://www.google.com"],
        1: ["https://www.google.com/search?q=",""]
    }
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