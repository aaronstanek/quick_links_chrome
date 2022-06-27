'use strict';

function tabRedirect(url) {
    chrome.tabs.update({url});
}

function linkTableLookupHandle1(result, sections, sectionConsider) {
    let urlParts = result.split("\x1F");
    if (urlParts.length !== 3) {
        return tabRedirect("error/index.html?code=1");
    }
    urlParts[1] = encodeURIComponent( sections[sectionConsider] );
    tabRedirect(urlParts.join(""));
}

function linkTableLookupHandle2(result, sections, sectionConsider, argCount) {
    let table = result.split("\x1E");
    if (table.length !== 2) {
        return tabRedirect("error/index.html?code=2");
    }
    let urlParts = table[0].split("\x1F");
    if (urlParts.length !== argCount*2+1) {
        return tabRedirect("error/index.html?code=3");
    }
    let varnames = table[1];
    if (varnames.length !== argCount) {
        return tabRedirect("error/index.html?code=4");
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
            return tabRedirect("error/index.html?code=5");
        }
        urlParts[i] = sections[sectionConsider + nameIndex];
    }
    tabRedirect(urlParts.join(""));
}

function linkTableLookup(linkTable,s) {
    let sections = s.split("/");
    if (sections.length > 16) {
        return tabRedirect("error/index.html?code=8");
    }
    if (sections[0] === "links") {
        if (s === "links") {
            return tabRedirect("links/index.html");
        }
        else if (s === "links/export") {
            return tabRedirect("export/index.html");
        }
        else if (s === "links/import") {
            return tabRedirect("import/index.html");
        }
        else {
            tabRedirect( "nomatch/index.html?link=" + encodeURIComponent(s) );
        }
    }
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
            return tabRedirect(result);
        }
        else if (argCount === 1) {
            // we need to do a single replacement
            // we don't care what the variable name is
            return linkTableLookupHandle1(result,sections,sectionConsider);
        }
        else {
            // argCount === many
            // we need to do multiple replacement
            return linkTableLookupHandle2(result,sections,sectionConsider,argCount);
        }
    }
    tabRedirect( "nomatch/index.html?link=" + encodeURIComponent(s) );
}

function newLinkTableLoader() {
    return {
        "started": false,
        "completed": false,
        "table": null
    };
}

let linkTableLoader = newLinkTableLoader();

function loadLinkTable(localLoader) {
    // localLoader is our local copy of linkTableLoader
    if (!localLoader.started) {
        localLoader.started = true;
        chrome.storage.local.get(["links"],(result)=>{
            if (chrome.runtime.lastError) {
                tabRedirect("error/index.html?code=6");
            }
            else if (typeof result.links !== "object") {
                localLoader.table = {};
                localLoader.completed = true;
            }
            else {
                localLoader.table = result.links;
                localLoader.completed = true;
            }
        });
    }
}

function loadLinkTableCaller() {
    loadLinkTable(linkTableLoader);
    // create local copy of linkTableLoader
    // and only change the local copy
    // that way if the table changes,
    // the changes will be isolated from the edits here
}

chrome.omnibox.onInputStarted.addListener(loadLinkTableCaller);
chrome.omnibox.onInputChanged.addListener(loadLinkTableCaller);

function useLinkTable(str, localLoader, iterationCount) {
    // str was given by the user
    // localLoader is our local copy of linkTableLoader
    // iterationCount is the number of times that this function
    // has been called for this input
    // we need to wait until the completed flag is marked
    // on localLoader
    if (localLoader.completed) {
        linkTableLookup(localLoader.table,str);
    }
    else if (iterationCount < 100) {
        setTimeout(useLinkTable,20,str,localLoader,iterationCount+1);
    }
    else {
        tabRedirect("error/index.html?code=9");
    }
}

function startLinkRedirect(str,disposition) {
    // lock the linkTableLoader ref
    // so the loader and the lookup share the same copy
    loadLinkTable(linkTableLoader);
    useLinkTable(str,linkTableLoader,0);
}

chrome.omnibox.onInputEntered.addListener(startLinkRedirect);

function gotMail(message,sender,sendResponse) {
    if (message === "clearLinkTableLoader") {
        linkTableLoader = newLinkTableLoader();
    }
}

chrome.runtime.onMessage.addListener(gotMail);
