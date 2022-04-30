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

// change format again to account for different kinds of copy/paste
// encodeURIComponenet or not
// allow empty string, or not
// add some way to include slash characters in output

function linkTableLookup(s) {
    // s is a NFKC unicode string
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
    return "https://aaronstanek.info?reason=nomatch";
}

let utf8CodepageLayout = {
    "0": 3, "1": 3, "2": 3, "3": 3, "4": 3, "5": 3, "6": 3, "7": 3,
    "8": 0, "9": 0, "A": 0, "a": 0, "B": 0, "b": 0,
    "C": 6, "c": 6, "D": 6, "d": 6,
    "E": 9, "e": 9,
    "F": 12, "f": 12
};

// hex codes in the 0 range are UTF-8 continuation bytes
// the rest are are UTF-8 header bytes
// their value is the length of the codepoint in
// URI percent-encoded UTF-8

function decodePercentSpecial(s,i) {
    // i is the index of a percent symbol
    if (i+3 > s.length) {
        // we are at the end of the string,
        // we can't have anything interesting
        return ["%",1];
    }
    // we know that i+1 and i+2 are valid indicies
    let lex = utf8CodepageLayout[s[i+1]];
    if (typeof lex !== "number") {
        // this is not a valid percent encoding
        return ["%",1];
    }
    if (lex) {
        // this might be a header byte for a multi byte code
        // we need lex characters of percent-encoded input
        if (i+lex > s.length) {
            // this cannot be a valid code
            return [s.slice(i,i+2),2];
        }
        try {
            return [decodeURIComponent(s.slice(i,i+lex)),lex];
        }
        catch (e) {
            return [s.slice(i,i+2),2];
        }
    }
    else {
        // this might be a lone continuation byte
        return [s.slice(i,i+2),2];
    }
}

function decodePercent(s) {
    // s is an ASCII-compatible string
    // partially percent encoded
    let output = [];
    let i = 0;
    while (i < s.length) {
        let c = s[i];
        if (c === "%") {
            let result = decodePercentSpecial(s,i);
            output.push(result[0]);
            i += result[1];
        }
        else {
            output.push(c);
            ++i;
        }
    }
    return output.join("");
}

function replace(details) {
    try {
        let query = details.url.split("://go/")[1];
        query = decodePercent(query);
        query = query.normalize("NFKC");
        return linkTableLookup(query);
    }
    catch (e) {
        return "https://aaronstanek.info?reason=error";
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {return {"redirectUrl":replace(details)}},
    {urls: ["*://go/*"]},
    ['blocking']
);