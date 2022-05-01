let linkTable = {
    "example\x7F0": {
        "a": ["http://example.com"]
    },
    "w\x7F0": {
        "a": ["https://en.wikipedia.org"]
    },
    "w\x7F1": {
        "a": ["https://en.wikipedia.org/wiki/","1",""],
        "1": ["c","%"]
    },
    "w/talk\x7F1": {
        "a": ["https://en.wikipedia.org/wiki/Talk:","1",""],
        "1": ["c","%"]
    },
    "g\x7F0": {
        "a": ["https://www.google.com"]
    },
    "g\x7F1": {
        "a": ["https://www.google.com/search?q=","1",""],
        "1": ["%"]
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