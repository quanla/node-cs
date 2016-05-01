module.exports = function() {



    return {
        htmlModifier: function(html) {
            //console.log(html);
            return html;
        },
        express: function(req, res, next) {
            console.log(123123);
            next();
        },
        watch: function(path) {
            var reload = Async.rapidCallAbsorber(function() {
                console.log("Reloading @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            });


            var chokidar = require("chokidar");

            chokidar
                .watch(path, {
                    //ignored: /[\/\\]\./,
                    ignoreInitial: true
                })
                .on('all', function(event, path) {
                    //console.log(event, path);
                    reload();
                })
            ;
        }
    };
};