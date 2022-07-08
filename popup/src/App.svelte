<script>
    'use strict';
    let urltext;
    let quicktext;
    function create() {
        alert("create was pressed.");
    }
</script>

<div class="table">

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
</style>