
module.exports = function(serverOptions) {

    require("./src/common-utils");

    serverOptions.baseDir = serverOptions.baseDir || ".";
    serverOptions.port = serverOptions.port || 8080;

    return {
        start: function() {
            var express = require("express");

            var app = express();



            app.get("/", require("./src/cs-html/layout")({
                bundle: require("./src/cs-html/bundle")(),
                replaces: {
                    "@MvcApplication.WebsiteHost": "pct.prototype1.io"
                }
            }));
            app.use(express.static(serverOptions.baseDir));


            var server = app.listen(serverOptions.port, function () {
            });
        }
    };
};