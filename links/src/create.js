'use strict';

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
    if (urltext.slice(0,7) !== "http://" && urltext.slice(0,8) !== "https://") {
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
        if (sections[i].length === 0) {
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

class handleQuickresult {
    constructor() {
        this.valid = false;
        this.link = "";
        this.variables = [];
    }
}

function handleQuick(quicktext) {
    // check the format
    let output = new handleQuickresult();
    let sections = quicktext.split("/");
    let seenVariable = false;
    for (let i = 0; i < sections.length; ++i) {
        if (sections[i].length === 0) {
            return output;
        }
        sections[i] = sections[i].split("%x").join("%X");
        if (sections[i].split("%x").length > 1) {
            // it contains %X
            if (sections[i].length !== 3) {
                return output;
            }
            let varname = sections[i][2];
            if (varname.charCodeAt(0) < 48 || varname.charCodeAt(0) > 57) {
                // variable name is not a numeral
                return output;
            }
            // check to see if this variable has appeared before
            for (let j = 0; j < output.variables.length; ++j) {
                if (output.variables[j] === varname) {
                    // reuse of variable
                    return output;
                }
            }
            // variable name is new
            output.variables.push(varname);
            seenVariable = true;
        }
        else {
            // this is not a variable section
            // make sure that there are no prior variable sections
            if (seenVariable) {
                return output;
            }
        }
    }
    // all validated
    // all variables have been recorded
    output.valid = true;
    output.link = sections.slice(0,sections.length-output.variables.length).join("/") + "\x1F" + output.variables.length;
    return output;
}

function buildLinkPair(urlResult,quickResult) {
    // assumes both are respective result object
    // which are both valid
    // we need to ensure that each variable in the quick result
    // appears in the url result
    // and vice versa
    if (urlResult.variables.length !== quickResult.variables.length) {
        return {"valid":false};
    }
    for (let i = 0; i < quickResult.variables.length; ++i) {
        if (typeof urlResult.variables[quickResult.variables[i]] === "undefined") {
            return {"valid":false};
        }
    }
    // all good
    // need to complete url if it has 2 or more variables
    if (quickResult.variables.length > 1) {
        return {
            "valid": true,
            "url": urlResult.url + "\x1E" + quickResult.variables.join(""),
            "quick": quickResult.link
        }
    }
    else {
        // we can return now
        return {
            "valid": true,
            "url": urlResult.url,
            "quick": quickResult.link
        };
    }
}