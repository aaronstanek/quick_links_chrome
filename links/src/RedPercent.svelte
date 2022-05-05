<script>
    export let text;
    let elem;
    let updadePending = false;
    function updateSpan() {
        // elem is defined
        while (elem.lastChild) {
            elem.removeChild(elem.lastChild);
        }
        let sections = text.split("%X");
        elem.appendChild(document.createTextNode(sections[0]));
        for (let i = 1; i < sections.length; ++i) {
            let redText = "%X";
            if (sections[i].length > 0) {
                redText += sections[i][0];
            }
            let redNode = document.createElement("span");
            redNode.style = "color:red";
            redNode.appendChild(document.createTextNode(redText));
            elem.appendChild(redNode);
            elem.appendChild(document.createTextNode(sections[i].slice(1)));
        }
    }
    function callUpdateSpan() {
        if (typeof elem === "undefined") {
            setTimeout(callUpdateSpan,10);
        }
        else {
            updadePending = false;
            updateSpan();
        }
    }
    function callCallUpdateSpan(t) {
        if (!updadePending) {
            updadePending = true;
            callUpdateSpan();
        }
    }
    $: callCallUpdateSpan(text);
</script>

<span bind:this={elem}>
</span>

<style>
</style>