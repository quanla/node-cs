
module.exports = function(serverOptions) {

    require("./src/common-utils");

    serverOptions.baseDir = serverOptions.baseDir || ".";
    serverOptions.port = serverOptions.port || 8080;

    return {
        start: function() {
            var express = require("express");

            var app = express();


            var hotReload = require("./src/hot-reload")();
            var layoutExpress = require("./src/cs-html/layout")({
                bundle: require("./src/cs-html/bundle")(),
                replaces: {
                    "@MvcApplication.WebsiteHost": serverOptions.apiHost
                },
                modifier: hotReload.htmlModifier
            });

            app.get("/", layoutExpress);
            app.use(express.static(serverOptions.baseDir));
            hotReload.express(app);

            hotReload.watch("app");

            var server = app.listen(serverOptions.port, function () {
                console.log("Server running on " + serverOptions.port);
            });
        }
    };
};