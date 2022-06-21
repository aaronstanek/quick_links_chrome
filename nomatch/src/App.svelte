<script>
    'use strict';
    let link = "";
    function getLink() {
        let params = new URLSearchParams(window.location.search);
        link = params.get("link");
    }
    getLink();
</script>

<main>
    <p>
        Unable to find the quick link:
        <br><br>
        {link}
        <br><br>
        <a href={"../links/index.html?create="+encodeURIComponent(link)}>Click here to create it.</a>
    </p>
</main>

<style>
    p {
        text-align: center;
    }
</style>