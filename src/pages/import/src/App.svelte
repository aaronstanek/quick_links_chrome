<script>
    'use strict';
    import {checkFormat} from "./checkFormat";
    let importBar;
    function doImport() {
        let linkTable;
        // check that the user entered valid JSON
        // get the JSON tree if it is valid
        try {
            linkTable = JSON.parse(importBar.value);
        }
        catch (e) {
            alert("Unable to parse JSON");
            return;
        }
        // check that the user input has a valid format
        if (!checkFormat(linkTable)) {
            alert("Invalid input")
            return;
        }
        // save and redirect
        chrome.storage.local.set({links:linkTable});
        window.location.href = "../links/index.html";
    }
</script>

<main>
    <div class="table">
        <div class="row">
            <input class="in" type="text" bind:this={importBar} />
            <p class="spacer"></p>
            <p class="import" on:click={doImport}>IMPORT</p>
        </div>
    </div>
</main>

<style>
    .table {
        display: flex;
        flex-direction: column;
        width: 61.8%;
        margin-left: auto;
        margin-right: auto;
    }
    .row {
        display: flex;
        box-sizing: border-box;
    }
    .spacer {
        flex: 1;
    }
    .in {
        border-radius: 100px;
        flex: 31;
    }
    .import {
        flex: 5;
        border: 2px solid black;
        border-radius: 15px;
        text-align: center;
        background-color: #4dff4d;
        cursor: pointer;
    }
</style>