<script>
    'use strict';
    let linkTable = "Loading";
    function updateLinkTable() {
        chrome.storage.local.get(["links"],(result)=>{
            if (chrome.runtime.lastError) {
                linkTable = "An error occurred while loading data.";
            }
            else if (typeof result.links !== "object") {
                // create default linkTable in case
                // that there is none available
                linkTable = JSON.stringify({});
            }
            else {
                linkTable = JSON.stringify(result.links);
            }
        });
    }
    updateLinkTable();
</script>

<main>
    <p>{linkTable}</p>
</main>

<style>
</style>