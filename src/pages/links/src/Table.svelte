<script>
    'use strict';
    import Row from "./Row.svelte";
    import Input from "./Input.svelte";
    export let linkTable;
    export let trash; // pass delete operation upwards
    export let create; // pass create operation upwards
    export let pushDisableEdit; // pass editing disable upwards
    export let editLink;
    let rowSpanElem;
    let emptyMessageElem;
    let rows = [];
    function showRowSpan(rse,eme) {
        rse.style.display = "inline";
        eme.style.display = "none";
    }
    function showEmptyMessage(rse,eme) {
        rse.style.display = "none";
        eme.style.display = "block";
    }
    function createRows(table,rse,eme) {
        if (typeof rse === "undefined" || typeof eme === "undefined") {
            return [];
        }
        if (typeof table !== "object") {
            showEmptyMessage(rse,eme);
            return [];
        }
        let keys = Object.keys(table).sort();
        // put the links in alphabetical (ish) order
        let output = [];
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            output.push([key,linkTable[key]]);
        }
        if (output.length) {
            showRowSpan(rse,eme);
        }
        else {
            showEmptyMessage(rse,eme);
        }
        return output;
    }
    $: rows = createRows(linkTable,rowSpanElem,emptyMessageElem);
</script>

<div class="table">
    <Input createHandler={create}></Input>
    <span bind:this={rowSpanElem}>
    {#each rows as row}
        <Row content={row} trash={trash} pushDisableEdit={pushDisableEdit} editLink={editLink}></Row>
    {/each}
    </span>
    <p class="emptymessage" bind:this={emptyMessageElem}>The links that you create appear here.</p>
</div>

<style>
    .table {
        display: flex;
        flex-direction: column;
        width: 61.8%;
        margin-left: auto;
        margin-right: auto;
    }
    .emptymessage {
        text-align: center;
        filter: drop-shadow(0px 6px 4px #989898);
    }
</style>