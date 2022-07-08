<script>
    'use strict';
    import {handleURL,handleQuick,buildLinkPair} from "../../links/src/create.js";
    let table;
    let wintext;
    let urltext;
    let quicktext;
    function showSuccess() {
        table.style.display = "none";
        wintext.style.display = "block";
    }
    function handleCreate(localUrlText,localQuickText,linkTable) {
        // see the createClicked function in links
        // for a guide of how this function works
        let urlResult = handleURL(localUrlText);
        if (!urlResult.valid) {
            alert("url is not properly formatted");
            return;
        }
        let quickResult = handleQuick(localQuickText);
        if (!quickResult.valid) {
            alert("quick link is not properly formatted");
            return;
        }
        if (quickResult.complexCharacters) {
            if (!confirm("Link contains characters outside [a-z][0-9]. Continue?")) {
                return;
            }
        }
        let totalResult = buildLinkPair(urlResult,quickResult);
        if (!totalResult.valid) {
            alert("variables in url and quick link do not match");
            return;
        }
        if (typeof linkTable[totalResult.quick] !== "undefined") {
            if (!confirm("Link already exists. Overwrite? : "+quicktext)) {
                return;
            }
        }
        showSuccess();
        linkTable[totalResult.quick] = totalResult.url;
        chrome.storage.local.set({links:linkTable});
        chrome.runtime.sendMessage("clearLinkTableLoader",(response)=>{});
    }
    function create() {
        // create button was pressed, we should create a link
        let localUrlText = urltext.value;
        let localQuickText = quicktext.value;
        chrome.storage.local.get(["links"],(result)=>{
            if (chrome.runtime.lastError) {
                alert("There was an error loading data.");
            }
            else if (typeof result.links !== "object") {
                handleCreate(localUrlText,localQuickText,{});
            }
            else {
                handleCreate(localUrlText,localQuickText,result.links);
            }
        });
    }
</script>

<div class="table" bind:this={table}>

    <div class="row rowtop">
        <p class="lefttext">URL:</p>
        <p class="spacer"></p>
        <input class="in urltext" type="text" bind:this={urltext} />
    </div>

    <div class="row">
        <p class="lefttext">Quick Link:</p>
        <p class="spacer"></p>
        <input class="in quicktext" type="text" bind:this={quicktext} />
        <p class="spacer"></p>
        <p class="create" on:click={create}>CREATE</p>
    </div>

</div>

<div class="wintext" bind:this={wintext}>
    <p>Your link was successfully created!</p>
</div>

<style>
    p {
        font-size: 12px;
    }
    .table {
        display: flex;
        flex-direction: column;
        width: 510px;
        margin: 30px;
    }
    .row {
        display: flex;
        box-sizing: border-box;
    }
    .rowtop {
        margin-bottom: 25px;
    }
    .lefttext {
        flex: 5;
    }
    .in {
        border-radius: 100px;
    }
    .urltext {
        flex: 37;
    }
    .quicktext {
        flex: 31;
    }
    .spacer {
        flex: 1;
    }
    .create {
        flex: 5;
        border: 2px solid black;
        border-radius: 15px;
        text-align: center;
        background-color: #4dff4d;
        cursor: pointer;
    }
    .wintext {
        text-align: center;
        display: none;
        width: 510px;
        margin: 30px;
    }
</style>