module.exports = function(serverOptions) {

    var injectJs = Async.rapidCallAbsorber(function() {
        var glob = require("glob");
        var intoFile = "./App_Start/BundleConfig.cs";

        glob("./app/spa/**/*.js", null, function (er, files) {
            var fs = require("fs");
            files.sort();
            fs.readFile(intoFile, "utf8", function(err, content) {
                content = replaceLinesBetween("// Inject start", "// Inject end", content, Cols.yield(files, function(file) {
                    return "\"" + file.replace(/^.\//, "~/") + "\"";
                }));
                fs.writeFile(intoFile, content);
            });

        });
    });

    function replaceLinesBetween(lineStart, lineEnd, content, lines) {

        var match = new RegExp("([ \\t]*)" + RegexUtil.escape(lineStart) + "(\r?\n)").exec(content);
        var start = match.index + match[0].length;

        var indent = match[1];
        var lineFeed = match[2];

        var m1 = new RegExp(RegexUtil.escape(lineEnd) + "\r?\n").exec(content);
        var end = m1.index;

        return content.substring(0, start) + indent + Cols.join(lines, "," + lineFeed + indent) + lineFeed + indent + content.substring(end);
    }

    return {
        start: function() {

            var chokidar = require("chokidar");

            chokidar
                .watch("./app/spa/**/*.js", {
                    ignoreInitial: true
                })
                .on('add', function(event, path) {
                    injectJs();
                })
                .on('unlink', function(event, path) {
                    injectJs();
                })
            ;
            injectJs();
        }
    };
};