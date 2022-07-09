<script>
    'use strict';
    import RedPercent from "./RedPercent.svelte";
    export let content; // [key,linkTable[key],i]
    export let trash; // pass delete operation upwards
    let show = ["",""];
    function createShow0(c) {
        // show the links in the case that
        // there are no arguments
        return [
            c[0].split("\x1F")[0], // quick
            c[1] // target
        ];
    }
    function createShow1(c) {
        // show the links in the case that
        // there is a single argument
        // we need to find the variable name
        let rightSplit = c[1].split("\x1F");
        // index 1 will have the variable number
        return [
            c[0].split("\x1F")[0] + "/%X" + rightSplit[1], // quick
            rightSplit[0] + "%X" + rightSplit[1] + rightSplit[2] // target
        ];
    }
    function createShow2(c) {
        // show the links in the case that there are multiple
        // arguments
        // we need to identify the variables
        // separate them out, and change their color
        // do the target url first
        let rightSplit = c[1].split("\x1E");
        let right = rightSplit[0].split("\x1F");
        for (let i = 1; i < right.length; i += 2) {
            right[i] = "/%X" + right[i];
        }
        // then do the quick link
        let varnumbers = rightSplit[1];
        let left = [ c[0].split("\x1F")[0] ];
        for (let i = 0; i < varnumbers.length; ++i) {
            left.push("/%X" + varnumbers[i]);
        }
        return [
            left.join(""), // quick
            right.join("") //vtarget
        ];
    }
    function createShow(c) {
        // show the links
        let argCount = parseInt( c[0].split("\x1F")[1] );
        if (argCount === 0) {
            return createShow0(c);
        }
        else if (argCount === 1) {
            return createShow1(c);
        }
        else {
            return createShow2(c);
        }
    }
    $: show = createShow(content);
    let rowStyle = "row";
    function updateRowStyle(c) {
        // set the line separator style
        // based on if this is the first
        // entry in the table or not
        if (c[2] === 0) {
            return "row";
        }
        else {
            return "row rowdash";
        }
    }
    $: rowStyle = updateRowStyle(content);
    function processClick() {
        trash(content[0]);
    }
</script>

<div class={rowStyle}>
    <p class="url left"><RedPercent text={show[0]}></RedPercent></p>
    <p class="spacer"></p>
    <p class="url right"><RedPercent text={show[1]}></RedPercent></p>
    <p class="spacer"></p>
    <img class="pencil" src="pencil.svg" alt="pencil icon" on:click={processClick}>
    <p class="spacer"></p>
    <img class="trash" src="trash.svg" alt="trash icon" on:click={processClick}>
</div>

<style>
    .row {
        display: flex;
        box-sizing: border-box;
    }
    .rowdash {
        border-top: 1px;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
        border-style: dashed;
        border-color: gray;
    }
    .left {
        flex: 10;
    }
    .spacer {
        flex: 1;
    }
    .right {
        flex: 30;
    }
    .pencil {
        height: 30px;
        width: 30px;
        display: block;
        margin-top: auto;
        margin-bottom: auto;
        cursor: pointer;
    }
    .trash {
        height: 20px;
        width: 20px;
        display: block;
        margin-top: auto;
        margin-bottom: auto;
        cursor: pointer;
    }
</style>