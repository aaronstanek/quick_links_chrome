<script>
    import Row from "./Row.svelte";
    export let linkTable;
    export let trash;
    let rows = [];
    function createRows(table) {
        if (typeof table !== "object") {
            return [];
        }
        let keys = Object.keys(table).sort();
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
    {#each rows as row}
        <Row content={row} trash={trash}></Row>
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