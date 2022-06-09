class handleURLresult {
    constructor() {
        this.valid = false;
        this.url = "";
        this.variables = {};
    }
};

function handleURL(urltext) {
    // check the format
    let output = new handleURLresult();
    if (urltext.slice(0,7) != "http://" && urltext.slice(0,8) != "https://") {
        return output;
    }
    urltext = urltext.split("%x").join("%X");
    // we have either a solid link
    // or abc%X4def -> abc\x1F4\x1Fdef
    // or ab%X4cd%X5ef -> ab\x1F4\x1Fcd\x1F5\x1Fef\x1E45
    // (we don't know the order right now)
    let sections = urltext.split("%X");
    // sections 1 and onward must begin with a numeral
    for (let i = 1; i < sections.length; ++i) {
        if (sections[i].length == 0) {
            return output;
        }
        if (sections[i].charCodeAt(0) < 48 || sections[i].charCodeAt(0) > 57) {
            // it's not a numeral
            return output;
        }
        // the first character is a numeral
        if (typeof output.variables[sections[i][0]] !== "undefined") {
            // we already have this variable
            return output;
        }
        output.variables[sections[i][0]] = null;
        sections[i] = "\x1F" + sections[i][0] + "\x1F" + sections[i].slice(1);
    }
    // we have now validated the input, recorded which variables are in use
    // and rewritten the secions so that hey can be read by the redirection algorithm later
    output.valid = true;
    output.url = sections.join("");
    return output;
}