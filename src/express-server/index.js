
module.exports = function(serverOptions) {
    serverOptions.baseDir = serverOptions.baseDir || ".";
    serverOptions.port = serverOptions.port || 8080;

    var hotReload = require("./hot-reload")();

    var bundle = require("./cs-html/bundle")();

    function addStartPoints(app) {

        for (var i = 0; i < serverOptions.startPoints.length; i++) {
            var startPoint = serverOptions.startPoints[i];

            var layoutExpress = require("./cs-html/layout")({
                file: "./" + startPoint.file,
                bundle: bundle,
                replaces: {
                    "@MvcApplication.WebsiteHost": serverOptions.apiHost
                },
                modifier: hotReload.htmlModifier
            });

            app.get(startPoint.url || "/", layoutExpress);
        }
    }

    return {
        start: function() {
            var express = require("express");

            var app = express();

            addStartPoints(app);

            app.use(express.static(serverOptions.baseDir));
            hotReload.express(app);

            hotReload.watch();
            hotReload.watchCss("app/css/style.css");

            var server = app.listen(serverOptions.port, function () {
                console.log("Server running on " + serverOptions.port);
            });
        }
    };
};