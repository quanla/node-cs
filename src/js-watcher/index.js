module.exports = function(serverOptions) {


    function jsInjector(injectJsPoint) {
        var glob = require("glob");
        return function() {
            var intoFile = "./" + injectJsPoint.bundleFile;

            glob("./" + injectJsPoint.dir + "/**/*.js", null, function (er, files) {
                var fs = require("fs");
                files.sort();
                fs.readFile(intoFile, "utf8", function(err, content) {
                    var newContent = replaceLinesBetween("// Inject" + (injectJsPoint.injectName ? " " + injectJsPoint.injectName : "") + " start", "// Inject" + (injectJsPoint.injectName ? " " + injectJsPoint.injectName : "") + " end", content, Cols.yield(files, function(file) {
                        return "\"" + file.replace(/^.\//, "~/") + "\"";
                    }));
                    if (newContent != content) {
                        fs.writeFile(intoFile, newContent);
                    }
                });

            });
        };
    }

    function replaceLinesBetween(lineStart, lineEnd, content, lines) {

        var match = new RegExp("([ \\t]*)" + RegexUtil.escape(lineStart) + "(\r?\n)").exec(content);
        var start = match.index + match[0].length;

        var indent = match[1];
        var lineFeed = match[2];

        var m1 = new RegExp(RegexUtil.escape(lineEnd) + "\r?\n").exec(content);
        var end = m1.index;

        return content.substring(0, start) + indent + Cols.join(lines, "," + lineFeed + indent) + lineFeed + indent + content.substring(end);
    }


    var ngAnnotate = require("ng-annotate");
    function annotateJsFile(path) {
        var fs = require("fs");
        fs.readFile("./" + path, "utf8", function(err, content) {
            var annotatedContent = ngAnnotate(content, { map: false, remove: true, add: true }).src;
            if (StringUtil.isNotEmpty(annotatedContent) && annotatedContent != content) {
                console.log("Annotated " + path);
                fs.writeFile("./" + path, annotatedContent);
            }
        });
    }

    return {
        start: function() {

            var chokidar = require("chokidar");

            serverOptions.injectJs.forEach(function(injectJsPoint, index) {
                var injectJs = Async.rapidCallAbsorber(jsInjector(injectJsPoint));

                chokidar
                    .watch("./" + injectJsPoint.dir + "/**/*.js", {
                        ignoreInitial: true
                    })
                    .on('add', function(event, path) {
                        injectJs();
                    })
                    .on('unlink', function(event, path) {
                        injectJs();
                    })
                    .on('change', function(path, stats) {
                        annotateJsFile(path);
                    })
                ;
                setTimeout(injectJs, index * 200);
            });
        }
    };
};