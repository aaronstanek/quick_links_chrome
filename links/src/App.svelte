<script>
    'use strict';
    import Table from "./Table.svelte";
    import {handleURL,handleQuick,buildLinkPair} from "./create.js";
    let linkTableLocked = false;
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
    let messageDisplay = "none";
    let messageValue = "";
    let tableDisplay = "none";
    $: whatToShow(linkTable);
    function whatToShow(lt) {
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
        linkTable = linkTable;
        chrome.storage.local.set({links:linkTable});
        chrome.runtime.sendMessage("clearLinkTableLoader",(response)=>{});
    }
    function trashClicked(key) {
        let show = [key.split("\x1F")[0]];
        if (typeof linkTable[key] === "undefined") {
            return;
        }
        let right = linkTable[key].split("\x1E")[0].split("\x1F");
        for (let i = 1; i < right.length; i += 2) {
            show.push("/%X");
            show.push(right[i]);
        }
        if (confirm("Delete link? : "+show.join(""))) {
            delete linkTable[key];
            saveLinkTableChanges();
        }
    }
    function createClicked(urltext,quicktext) {
        let urlResult = handleURL(urltext);
        if (!urlResult.valid) {
            alert("url is not properly formatted")
            return;
        }
        let quickResult = handleQuick(quicktext);
        if (!quickResult.valid) {
            alert("quick link is not properly formatted");
            return;
        }
        let totalResult = buildLinkPair(urlResult,quickResult);
        if (!totalResult.valid) {
            alert("variables in url and quick link do not match");
            return;
        }
        linkTable[totalResult.quick] = totalResult.url;
        saveLinkTableChanges();
    }
</script>

<main>
    <span style={"display:"+messageDisplay}><p>{messageValue}</p></span>
    <span style={"display:"+tableDisplay}><Table linkTable={linkTable} trash={trashClicked} create={createClicked}></Table></span>
</main>

<style>
</style>