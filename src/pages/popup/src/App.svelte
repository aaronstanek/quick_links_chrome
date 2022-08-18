<script>
    'use strict';
    import { onMount } from 'svelte';
    import {handleURL,handleQuick,buildLinkPair} from "../../links/src/create.js";
    import {enterToPressButton} from "../../modular/enterToPressButton.js";
    let table;
    let wintext;
    let urltext;
    let quicktext;
    let buttonCreate;
	onMount(async () => {
        // when the user hits enter, we will
        // consider it a button press of the create button
        enterToPressButton(urltext,buttonCreate);
        enterToPressButton(quicktext,buttonCreate);
        // by default, assume that the user will
        // want to create a link to the page that they are on
        let queryOptions = { active: true, lastFocusedWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        if (typeof tab !== "undefined") {
            urltext.value = tab.url;
        }
	});
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
            if (!confirm("Link already exists. Overwrite? : "+localQuickText)) {
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
    function linkTo_links() {
        chrome.tabs.create({ url: "links/index.html" });
    }
    function linkTo_export() {
        chrome.tabs.create({ url: "export/index.html" });
    }
    function linkTo_import() {
        chrome.tabs.create({ url: "import/index.html" });
    }
    function linkTo_help() {
        chrome.tabs.create({ url: "https://github.com/aaronstanek/quick_links_chrome" });
    }
</script>

<div class="linksArea">
    <p class="link" on:click={linkTo_links}>View Links</p>
    <p class="link" on:click={linkTo_export}>Export Links</p>
    <p class="link" on:click={linkTo_import}>Import Links</p>
    <p class="link" on:click={linkTo_help}>Help</p>
</div>

<div class="table" bind:this={table}>

    <div class="row rowtop">
        <p class="lefttext shadowtext">URL:</p>
        <p class="spacer"></p>
        <input class="urltext" type="text" bind:this={urltext} />
    </div>

    <div class="row">
        <p class="lefttext shadowtext">Quick Link:</p>
        <p class="spacer"></p>
        <input class="quicktext" type="text" bind:this={quicktext} />
        <p class="spacer"></p>
        <p class="create" on:click={create} bind:this={buttonCreate}>CREATE</p>
    </div>

</div>

<div class="wintext shadowtext" bind:this={wintext}>
    <p>Your link was successfully created!</p>
</div>

<style>
    p {
        font-size: 12px;
    }
    .shadowtext {
        filter: drop-shadow(0px 6px 4px #989898);
    }
    input {
        border-radius: 100px;
        border: 2px solid black;
        filter: drop-shadow(0px 6px 4px #989898);
    }
    input:focus {
        outline:none;
    }
    .table {
        display: flex;
        flex-direction: column;
        width: 510px;
        margin: 30px;
        margin-bottom: 35px;
    }
    .row {
        display: flex;
        box-sizing: border-box;
    }
    .rowtop {
        margin-top: 10px;
        margin-bottom: 35px;
    }
    .lefttext {
        flex: 5;
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
        filter: drop-shadow(0px 6px 4px #989898);
    }
    .wintext {
        text-align: center;
        display: none;
        width: 510px;
        margin: 30px;
    }
    .linksArea {
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-right: auto;
        margin-top: 30px;
    }
    .link {
        flex: 1;
        margin: 0px;
        color: #0099ff;
        cursor: pointer;
    }
    .link:hover {
        text-decoration: underline;
    }
</style>