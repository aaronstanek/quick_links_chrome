<script>
    'use strict';
    import Table from "./Table.svelte";
    import {handleURL,handleQuick,buildLinkPair} from "./create.js";
    let linkTable = "Loading";
    function updateLinkTable() {
        chrome.storage.local.get(["links"],(result)=>{
            if (chrome.runtime.lastError) {
                linkTable = "An error occurred while loading data.";
            }
            else if (typeof result.links !== "object") {
                linkTable = {};
            }
            else {
                linkTable = result.links;
            }
        });
    }
    updateLinkTable();
    // we display either a message
    // or the link table
    // depending on the type of the linkTable variable
    let messageDisplay = "none";
    let messageValue = "";
    let tableDisplay = "none";
    $: whatToShow(linkTable);
    function whatToShow(lt) {
        // this function switches between message display
        // and table display
        if (typeof lt === "string") {
            messageDisplay = "inline";
            messageValue = lt;
            tableDisplay = "none";
        }
        else {
            messageDisplay = "none";
            messageValue = "";
            tableDisplay = "inline";
        }
    }
    function saveLinkTableChanges() {
        // after we make an edit to the local copy of
        // linkTable, we need to push the changes to everywhere else
        linkTable = linkTable;
        // tells svelte to update the display
        chrome.storage.local.set({links:linkTable});
        // tells the browser to save the local linkTable to the hard drive
        chrome.runtime.sendMessage("clearLinkTableLoader",(response)=>{});
        // tells the service worker that its local copy
        // of linkTable is out-of-date
    }
    function trashClicked(key) {
        // the user pressed the trash icon next to
        // one of the links
        // key is a string containing the key of the entry
        pushDisableEdit(null);
        let show = [key.split("\x1F")[0]];
        // show is the human-readable
        // name for the link
        if (typeof linkTable[key] === "undefined") {
            return;
        }
        let sections = linkTable[key].split("\x1E")[0].split("\x1F");
        for (let i = 1; i < sections.length; i += 2) {
            show.push("/%X");
            show.push(sections[i]);
        }
        // show is built, now ask the user if they really
        // wanted to delete the link
        if (confirm("Delete link? : "+show.join(""))) {
            delete linkTable[key];
            saveLinkTableChanges(); // need to push change
        }
    }
    function createClicked(urltext,quicktext,supressOverwriteWarning) {
        // user clicked the create link button
        // urltext is the text in the target url field
        // quicktext is the text in the quick link field
        // check the format of the urltext
        let output = {
            "created": false,
            "overwrite": false
        };
        pushDisableEdit(null);
        let urlResult = handleURL(urltext);
        if (!urlResult.valid) {
            alert("url is not properly formatted")
            return output;
        }
        // check the format of the quick link
        let quickResult = handleQuick(quicktext);
        if (!quickResult.valid) {
            alert("quick link is not properly formatted");
            return output;
        }
        if (quickResult.complexCharacters) {
            // if the quick link has characters beyond [a-z][0-9]
            // it is probably a mistake, and the users should have
            // an opportunity to correct it before it is placed
            if (!confirm("Link contains characters outside [a-z][0-9]. Continue?")) {
                return output;
            }
        }
        // make sure that the variables used in the url are all
        // defined in the quick link
        // make sure the quick link contains no unused variables
        let totalResult = buildLinkPair(urlResult,quickResult);
        if (!totalResult.valid) {
            alert("variables in url and quick link do not match");
            return output;
        }
        if (typeof linkTable[totalResult.quick] !== "undefined") {
            output.overwrite = true;
            if (!supressOverwriteWarning) {
                if (!confirm("Link already exists. Overwrite? : "+quicktext)) {
                    return output;
                }
            }
        }
        linkTable[totalResult.quick] = totalResult.url;
        saveLinkTableChanges(); // need to push change
        output.created = true;
        return output;
    }
    function editLink(urltext,quicktext,oldQuicktext) {
        let result = createClicked(urltext,quicktext,true);
        if (result.created) {
            if (!result.overwrite) {
                delete linkTable[oldQuicktext];
                saveLinkTableChanges();
            }
        }
    }
    let disableEdit = null;
    function pushDisableEdit(elem) {
        // elem is a function to call when we want
        // to disable the current editing session
        // pass null to clear
        if (disableEdit !== null) {
            disableEdit();
        }
        disableEdit = elem;
    }
</script>

<main>
    <span style={"display:"+messageDisplay}><p>{messageValue}</p></span>
    <span style={"display:"+tableDisplay}><Table linkTable={linkTable} trash={trashClicked} create={createClicked} pushDisableEdit={pushDisableEdit} editLink={editLink}></Table></span>
</main>

<style>
</style>