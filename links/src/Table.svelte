<script>
    'use strict';
    import Row from "./Row.svelte";
    import Input from "./Input.svelte";
    export let linkTable;
    export let trash; // pass delete operation upwards
    export let create; // pass create operation upwards
    export let pushDisableEdit; // pass editing disable upwards
    let rows = [];
    function createRows(table) {
        if (typeof table !== "object") {
            return [];
        }
        let keys = Object.keys(table).sort();
        // put the links in alphabetical (ish) order
        let output = [];
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            output.push([key,linkTable[key],i]);
        }
        return output;
    }
    $: rows = createRows(linkTable);
</script>

<div class="table">
    <Input createHandler={create}></Input>
    {#each rows as row}
        <Row content={row} trash={trash} pushDisableEdit={pushDisableEdit}></Row>
    {/each}
</div>

<style>
    .table {
        display: flex;
        flex-direction: column;
        width: 61.8%;
        margin-left: auto;
        margin-right: auto;
    }
</style>