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
    let argNumber = sections[1];
    for (let i = 0; i < argNumber.length; ++i) {
        let charCode = argNumber.charCodeAt(i);
        if (charCode < 48 || charCode > 57) {
            return false;
        }
    }
    // we only allow 1 to 16 sections
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
    if (value.split("://").length !== 2) {
        return false;
    }
    let argNumber = parseInt(key.split("\x1F")[1]);
    if (argNumber === 0) {
        // we only need to check ://
        return true;
    }
    else if (argNumber === 1) {
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
        let bigsections = value.split("\x1E");
        if (bigsections.length !== 2) {
            return false;
        }
        let left = bigsections[0].split("\x1F");
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