module.exports = function() {

    var sendAllClients;

    return {
        htmlModifier: function(html) {
            var fs = require("fs");
            var embededJs = fs.readFileSync(__dirname + "/embed.js", "utf8");
            html = html.replace("</body>", "<script>" + embededJs + "</script>");
            return html;
        },
        express: function(app) {
            var expressWs = require('express-ws')(app);

            app.ws('/hot-reload', function(ws, req) {
            });
            var aWss = expressWs.getWss('/hot-reload');

            sendAllClients = function(msg) {
                var msgStr = JSON.stringify(msg);
                aWss.clients.forEach(function (client) {
                    client.send(msgStr);
                });
            };
            //console.log("Websocket ready");
        },
        watch: function(path) {
            var reloadPage = Async.rapidCallAbsorber(function() {
                console.log("reloadPage");
                sendAllClients({action: "reloadPage"});
            });


            var chokidar = require("chokidar");

            chokidar
                .watch(path, {
                    ignored: /[\/\\]\.|\.css|\.scss/,
                    ignoreInitial: true
                })
                .on('all', function(event, path) {
                    reloadPage();
                })
            ;
        },
        watchCss: function(path) {
            var reloadCss = Async.rapidCallAbsorber(function(path) {
                sendAllClients({action: "reloadCss", path: path});
            });

            var chokidar = require("chokidar");

            chokidar
                .watch(path, {
                    ignored: /\.(?!css)[^.]+$/,
                    ignoreInitial: true
                })
                .on('all', function(event, path) {
                    reloadCss(path);
                })
            ;
        }
    };
};