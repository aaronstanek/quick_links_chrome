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
</script>

<div class="row">
    <p class="url row left"><RedPercent text={show[0]}></RedPercent></p>
    <p class="spacer"></p>
    <p class="url row right"><RedPercent text={show[1]}></RedPercent></p>
</div>

<style>
    .row {
        display: flex;
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
</style>