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
        let argCount = sections.length - sectionConsider;
        let test = sections.slice(0,sectionConsider).join("/") + "\x1F" + argCount.toString();
        let result = linkTable[test];
        if (typeof result !== "string") {
            --sectionConsider;
            continue;
        }
        // we found a match
        // we have different formats for 0,1,many arguments
        if (argCount === 0) {
            // the result is the url that we should go to
            return result;
        }
        else if (argCount === 1) {
            // we need to do a single replacement
            // we don't care what the variable name is
            let urlParts = result.split("\x1F");
            if (urlParts.length !== 3) {
                return "error.html?code=1";
            }
            urlParts[1] = encodeURIComponent( sections[sectionConsider] );
            return urlParts.join("");
        }
        else {
            // argCount === many
            // we need to do multiple replacement
            let table = result.split("\x1E");
            if (table.length !== 2) {
                return "error.html?code=2";
            }
            let urlParts = table[0].split("\x1F");
            if (urlParts.length !== argCount*2+1) {
                return "error.html?code=3";
            }
            let varnames = table[1];
            if (varnames.length !== argCount) {
                return "error.html?code=4";
            }
            for (let i = 1; i < urlParts.length; i += 2) {
                let name = urlParts[i];
                // find the index of name
                let nameIndex = -1;
                for (let j = 0; j < varnames.length; ++j) {
                    if (name == varnames[j]) {
                        nameIndex = j;
                        break;
                    }
                }
                if (nameIndex < 0) {
                    return "error.html?code=5";
                }
                urlParts[i] = sections[sectionConsider + nameIndex];
            }
            return urlParts.join("");
        }
    }
    return "nomatch.html?link=" + encodeURIComponent(s);
}

function omnibox(str, disposition) {
    let url = linkTableLookup(str);
    chrome.tabs.update({url});
}

chrome.omnibox.onInputEntered.addListener(omnibox);