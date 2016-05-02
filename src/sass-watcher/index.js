module.exports = function(serverOptions) {

    var compileScss = Async.rapidCallAbsorber(function() {
        var sass = require('node-sass');
        sass.render({file: "./app/scss/style.scss"}, function(error, result) {
            if(!error){
                var fs = require("fs");
                fs.writeFile("./app/css/style.css", result.css);
            } else {
                console.error(error);
            }
        });
    });
    var injectScss = Async.rapidCallAbsorber(function() {
        var glob = require("glob");
        glob("./app/spa/**/*.scss", null, function (er, files) {
            var fs = require("fs");
            files.sort();
            fs.readFile("./app/scss/style.scss", "utf8", function(err, content) {
                content = replaceLinesBetween("// Inject start", "// Inject end", content, Cols.yield(files, function(file) {
                    return "@import \"" + file.replace(/^.\/app/, "..") + "\";";
                }));
                fs.writeFile("./app/scss/style.scss", content);
            });

        });
    });

    function replaceLinesBetween(lineStart, lineEnd, content, lines) {

        var match = new RegExp(RegexUtil.escape(lineStart) + "(\r?\n)").exec(content);
        var start = match.index + match[0].length;

        var lineFeed = match[1];

        var m1 = new RegExp(RegexUtil.escape(lineEnd) + "\r?\n").exec(content);
        var end = m1.index;

        return content.substring(0, start) + Cols.join(lines, lineFeed) + lineFeed + content.substring(end);
    }

    return {
        start: function() {

            var chokidar = require("chokidar");

            chokidar
                .watch(["./app/scss/**/*.*", "./app/spa/**/*.scss"], {
                    ignoreInitial: true
                })
                .on('change', function(event, path) {
                    //console.log("Compiling scss");
                    compileScss();
                })
            ;

            chokidar
                .watch("./app/spa/**/*.scss", {
                    ignoreInitial: true
                })
                .on('add', function(event, path) {
                    injectScss();
                })
                .on('unlink', function(event, path) {
                    injectScss();
                })
            ;
        }
    };
};