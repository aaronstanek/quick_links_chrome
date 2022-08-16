<script>
    'use strict';
    let memo;
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
    function clickToCopy() {
        navigator.clipboard.writeText(linkTable).then(
            ()=>{
                // clipboard set
                memo.style.display = "block";
                memo.innerHTML = "Copied to clipboard!";
            },
            ()=>{
                // clipboard not set
                memo.style.display = "block";
                memo.innerHTML = "Failed to copy to clipboard";
            }
        );
    }
</script>

<main>
    <button on:click={clickToCopy}>Copy to clipbord</button>
    <p bind:this={memo} class="memo"></p>
    <p>{linkTable}</p>
</main>

<style>
    .memo {
        display: hidden;
    }
</style>