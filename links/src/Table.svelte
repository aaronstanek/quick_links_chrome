<script>
    export let linkTable;
    let rows = [];
    function createRows(table) {
        if (typeof table !== "object") {
            return [];
        }
        let keys = Object.keys(table).sort();
        let output = [];
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            output.push([key,linkTable[key]]);
        }
        return output;
    }
    $: rows = createRows(linkTable);
</script>

<div class="table">
    {#each rows as row}
        <p>{JSON.stringify(row)}</p>
    {/each}
</div>

<style>
    .table {
        display: flex;
        flex-direction: column;
    }
</style>