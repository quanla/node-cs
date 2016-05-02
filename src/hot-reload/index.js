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
                sendAllClients({action: "reloadPage"});
            });

            var reloadCss = Async.rapidCallAbsorber(function() {
                sendAllClients({action: "reloadCss"});
            });


            var chokidar = require("chokidar");

            chokidar
                .watch(path, {
                    //ignored: /[\/\\]\./,
                    ignoreInitial: true
                })
                .on('all', function(event, path) {
                    reloadPage();
                })
            ;
        }
    };
};