<script>
    'use strict';
    let code = "";
    function getCode() {
        let params = new URLSearchParams(window.location.search);
        code = params.get("code");
    }
    getCode();
</script>

<main>
    <p>
        Internal Error!
        <br><br>
        Error Code: {code}
        <br><br>
        Please contact the developer.
    </p>
</main>

<style>
    p {
        text-align: center;
    }
</style>