"use strict";

(function() {
    var reloading = false;


    var sk = new WebSocket("ws://localhost:8080/hot-reload");
    sk.onmessage = function (event) {
        if (reloading) {
            return;
        }

        var data = JSON.parse(event.data);
        if (data.action == "reloadPage") {
            reloading = true;

            window.location.reload();
        } else {
            reloading = true;

            window.location.reload();
        }

    }
})();

