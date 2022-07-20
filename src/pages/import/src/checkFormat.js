'use strict';

function checkKeyFormat(key) {
    // each should be a string
    // with the format: text\x1F#
    if (typeof key !== "string") {
        return false;
    }
    let sections = key.split("\x1F");
    if (sections.length !== 2) {
        return false;
    }
    if (sections[0].length < 1 || sections[1].length < 1) {
        return false;
    }
    // links and help are protected
    if (sections[0] === "links"
        || sections[0].slice(0,6) === "links/"
        || sections[0] === "help"
        || sections[0].slice(0,5) === "help/") {
            return false;
    }
    // the text after \x1F represents the number of arguments
    // that the link accepts
    let argNumber = sections[1];
    for (let i = 0; i < argNumber.length; ++i) {
        // only allow [0-9]
        let charCode = argNumber.charCodeAt(i);
        if (charCode < 48 || charCode > 57) {
            return false;
        }
    }
    // we only allow 1 to 16 sections
    // parseInt will have simple behavior because
    // we already checked the range of the input characters
    argNumber = parseInt(argNumber);
    if (argNumber < 0 || argNumber > 15) {
        return false;
    }
    // key is all good
    return true;
}

function checkValueFormat(key,value) {
    if (typeof value !== "string") {
        return false;
    }
    // we expect exactly one :// in every link
    // this prevents relative links
    if (value.split("://").length !== 2) {
        return false;
    }
    let argNumber = parseInt(key.split("\x1F")[1]);
    if (argNumber === 0) {
        // we only need to check ://
        return true;
    }
    else if (argNumber === 1) {
        // format is text\x1F#\x1Ftext
        let sections = value.split("\x1F");
        if (sections.length !== 3) {
            return false;
        }
        let varsection = sections[1];
        if (varsection.length !== 1) {
            return false;
        }
        if (varsection.charCodeAt(0) < 48 || varsection.charCodeAt(0) > 57) {
            return false;
        }
        return true;
    }
    else {
        // format is text{\x1F#\x1Ftext}\x1E##...
        // each number between the bracketed \x1F
        // must appear exactly once after \x1E
        // every number after \x1E must appear exactly once
        // in the bracketed \x1F pairs
        let bigsections = value.split("\x1E");
        if (bigsections.length !== 2) {
            return false;
        }
        let left = bigsections[0].split("\x1F");
        // the number sections between \x1F tokens 
        // is 2*args + 1
        if (left.length !== 2*argNumber + 1) {
            return false;
        }
        let variables = {};
        for (let i = 1; i < left.length; i += 2) {
            let varsection = left[i];
            if (varsection.length !== 1) {
                return false;
            }
            if (varsection.charCodeAt(0) < 48 || varsection.charCodeAt(0) > 57) {
                return false;
            }
            variables[varsection] = null;
        }
        if (Object.keys(variables).length !== argNumber) {
            return false;
        }
        let right = bigsections[1];
        if (right.length !== argNumber) {
            return false;
        }
        for (let i = 0; i < argNumber; ++i) {
            if (typeof variables[right[i]] === "undefined") {
                return false;
            }
        }
        return true;
    }
}

export function checkFormat(linkTable) {
    // expect it to be an object
    if (typeof linkTable !== "object") {
        return false;
    }
    let keys = Object.keys(linkTable);
    for (let i = 0; i < keys.length; ++i) {
        let key = keys[i];
        if (!checkKeyFormat(key)) {
            return false;
        }
        if (!checkValueFormat(key,linkTable[key])) {
            return false;
        }
    }
    return true;
}