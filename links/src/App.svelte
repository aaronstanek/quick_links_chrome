<script>
    import Table from "./Table.svelte";
    let linkTableLocked = false;
    let linkTable = "Loading";
    function updateLinkTable() {
        chrome.storage.local.get(["links"],(result)=>{
            if (chrome.runtime.lastError) {
                linkTable = "An error occurred while loading data.";
            }
            else if (typeof result.links !== "object") {
                linkTable = {};
            }
            else {
                linkTable = result.links;
            }
        });
    }
    updateLinkTable();
    let messageDisplay = "none";
    let messageValue = "";
    let tableDisplay = "none";
    $: whatToShow(linkTable);
    function whatToShow(lt) {
        if (typeof lt === "string") {
            messageDisplay = "inline";
            messageValue = lt;
            tableDisplay = "none";
        }
        else {
            messageDisplay = "none";
            messageValue = "";
            tableDisplay = "inline";
        }
    }
    function trashClicked(key) {
        let show = [key.split("\x1F")[0]];
        if (typeof linkTable[key] === "undefined") {
            return;
        }
        let right = linkTable[key].split("\x1E")[0].split("\x1F");
        for (let i = 1; i < right.length; i += 2) {
            show.push("/%X");
            show.push(right[i]);
        }
        if (confirm("Delete link? : "+show.join(""))) {
            delete linkTable[key];
            linkTable = linkTable;
            chrome.storage.local.set({links:linkTable});
        }
    }
</script>

<main>
    <span style={"display:"+messageDisplay}><p>{messageValue}</p></span>
    <span style={"display:"+tableDisplay}><Table linkTable={linkTable} trash={trashClicked}></Table></span>
</main>

<style>
</style>