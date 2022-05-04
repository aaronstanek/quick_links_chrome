<script>
    let message;
    function update() {
        chrome.storage.local.get(["links"],(result)=>{
            if (chrome.runtime.lastError) {
                message = "An error occurred while loading data.";
            }
            else if (typeof result.links !== "object") {
                message = "No links to show yet.";
            }
            else {
                message = "Data was loaded.";
            }
        });
    }
    update();
</script>

<main>
    <p>{message}</p>
</main>

<style>
</style>