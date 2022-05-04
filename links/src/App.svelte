<script>
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
</script>

<main>
    <span style={"display:"+messageDisplay}><p>{messageValue}</p></span>
    <span style={"display:"+tableDisplay}></span>
</main>

<style>
</style>