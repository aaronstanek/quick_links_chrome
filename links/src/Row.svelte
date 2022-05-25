<script>
    import RedPercent from "./RedPercent.svelte";
    export let content;
    let show = ["",""];
    function createShow0(c) {
        return [
            c[0].split("\x1F")[0],
            c[1]
        ];
    }
    function createShow1(c) {
        // we need to find the variable name
        let rightSplit = c[1].split("\x1F");
        // index 1 will have the variable number
        return [
            c[0].split("\x1F")[0] + "/%X" + rightSplit[1],
            rightSplit[0] + "%X" + rightSplit[1] + rightSplit[2]
        ];
    }
    function createShow2(c) {
        // we need to do multiple variable names
        let rightSplit = c[1].split("\x1E");
        let right = rightSplit[0].split("\x1F");
        for (let i = 1; i < right.length; i += 2) {
            right[i] = "/%X" + right[i];
        }
        let varnumbers = rightSplit[1];
        let left = [ c[0].split("\x1F")[0] ];
        for (let i = 0; i < varnumbers.length; ++i) {
            left.push("/%X" + varnumbers[i]);
        }
        return [
            left.join(""),
            right.join("")
        ];
    }
    function createShow(c) {
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
        if (c[2] === 0) {
            return "row";
        }
        else {
            return "row rowdash";
        }
    }
    $: rowStyle = updateRowStyle(content);
</script>

<div class={rowStyle}>
    <p class="url left"><RedPercent text={show[0]}></RedPercent></p>
    <p class="spacer"></p>
    <p class="url right"><RedPercent text={show[1]}></RedPercent></p>
    <p class="spacer"></p>
    <img class="trash" src="trash.svg" alt="trash icon">
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
        flex: 1;
    }
    .spacer {
        flex: 0.1;
    }
    .right {
        flex: 3;
    }
    .trash {
        flex: 0.2;
        height: 40px;
        display: block;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>