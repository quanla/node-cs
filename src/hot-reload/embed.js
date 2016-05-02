"use strict";

(function() {
    var reloading = false;


    var sk = new WebSocket("ws://localhost:8080/hot-reload");
    sk.onmessage = function (event) {
        if (reloading) {
            return;
        }

        reloading = true;

        window.location.reload();
    }
})();

