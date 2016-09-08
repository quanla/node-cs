/**
 * Sample usage:
 *
require("./node-cs/injector/bundle-config")({
    bundleFile: "App_Start/BundleConfig.cs",
    injectPoints: [
        {
            dir: "app/angular",
            injectName: "front-end"
        },
        {
            dir: "Areas/Management/app/angular",
            injectName: "back-end"
        }
    ]
});

*/

function replaceLinesBetween(lineStart, lineEnd, content, lines) {
    var stringUpdater = new (require("./string-updater").StringUpdater)(content);

    var regExpStart = new RegExp("([ \\t]*)" + RegexUtil.escape(lineStart) + "(\r?\n)", "g");
    var regExpEnd = new RegExp(RegexUtil.escape(lineEnd) + "\r?\n", "g");
    for (var match ; match = regExpStart.exec(content); ) {
        var start = match.index + match[0].length;

        var indent = match[1];
        var lineFeed = match[2];

        var m1 = regExpEnd.exec(content);
        var replaceEnd = m1.index;

        var afterLineEndEnd = replaceEnd + lineEnd.length;
        var needEndComma = /\S/.test(content.substring(afterLineEndEnd, content.indexOf(")", afterLineEndEnd)));

        stringUpdater.addReplace(start, replaceEnd, indent + Cols.join(lines, "," + lineFeed + indent) + (needEndComma ? ",":"") + lineFeed + indent);
    }

    return stringUpdater.applyChanges();
}


module.exports = function(options) {

    var chokidar = require("chokidar");


    function jsInjector(injectJsPoint) {
        var glob = require("glob");
        return function() {
            var intoFile = "./" + options.bundleFile;

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

    options.injectPoints.forEach(function(injectJsPoint, index) {
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
        ;
        setTimeout(injectJs, index * 200);
    });
};