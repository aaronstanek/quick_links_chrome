<script>
    'use strict';
    import { onMount } from 'svelte';
    export let createHandler // pass create operation upwards
    let urltext;
    let quicktext;
	onMount(async () => {
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
    <input class="in urltext" type="text" bind:this={urltext} />
</div>

<div class="row rowbottom">
    <p class="lefttext">Quick Link:</p>
    <p class="spacer"></p>
    <input class="in quicktext" type="text" bind:this={quicktext} />
    <p class="spacer"></p>
    <p class="create" on:click={create}>CREATE</p>
</div>

<style>
    .row {
        display: flex;
        box-sizing: border-box;
    }
    .rowtop {
        margin-bottom: 25px;
    }
    .rowbottom {
        margin-bottom: 50px;
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
</style>