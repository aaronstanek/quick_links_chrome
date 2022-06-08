<script>
</script>

<div class="row rowtop">
    <p class="lefttext">URL:</p>
    <p class="spacer"></p>
    <input class="in urltext" type="text" />
</div>

<div class="row rowbottom">
    <p class="lefttext">Quick Link:</p>
    <p class="spacer"></p>
    <input class="in quicktext" type="text" />
    <p class="spacer"></p>
    <p class="create">CREATE</p>
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
    }
</style>