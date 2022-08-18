<script>
    'use strict';
    import { onMount } from 'svelte';
    import {enterToPressButton} from "../../modular/enterToPressButton.js";
    export let createHandler // pass create operation upwards
    let urltext;
    let quicktext;
    let buttonCreate;
	onMount(async () => {
        // when the user hits enter, we will
        // consider it a button press of the create button
        enterToPressButton(urltext,buttonCreate);
        enterToPressButton(quicktext,buttonCreate);
        // if user came here from another place
        // they might be expecting to create a particular link
		let params = new URLSearchParams(window.location.search);
        let queryCreate = params.get("create");
        if (typeof queryCreate === "string") {
            quicktext.value = queryCreate;
        }
	});
    function create() {
        // when the user presses the "create" button
        // pass the user input upwards
        if (createHandler(urltext.value,quicktext.value,false).created) {
            urltext.value = "";
            quicktext.value = "";
        }
    }
</script>

<div class="row rowtop">
    <p class="lefttext">URL:</p>
    <p class="spacer"></p>
    <input class="urltext" type="text" bind:this={urltext} />
</div>

<div class="row rowbottom">
    <p class="lefttext">Quick Link:</p>
    <p class="spacer"></p>
    <input class="quicktext" type="text" bind:this={quicktext} />
    <p class="spacer"></p>
    <p class="create" on:click={create} bind:this={buttonCreate}>CREATE</p>
</div>

<style>
    p {
        filter: drop-shadow(0px 6px 4px #989898);
    }
    .row {
        display: flex;
        box-sizing: border-box;
    }
    .rowtop {
        margin-top: 10px;
        margin-bottom: 40px;
    }
    .rowbottom {
        margin-bottom: 80px;
    }
    .lefttext {
        flex: 5;
    }
    input {
        border-radius: 100px;
        border: 2px solid black;
        filter: drop-shadow(0px 6px 4px #989898);
    }
    input:focus {
        outline:none;
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
</style>