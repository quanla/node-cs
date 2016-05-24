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

    var match = new RegExp("([ \\t]*)" + RegexUtil.escape(lineStart) + "(\r?\n)").exec(content);
    var start = match.index + match[0].length;

    var indent = match[1];
    var lineFeed = match[2];

    var m1 = new RegExp(RegexUtil.escape(lineEnd) + "\r?\n").exec(content);
    var end = m1.index;

    return content.substring(0, start) + indent + Cols.join(lines, "," + lineFeed + indent) + lineFeed + indent + content.substring(end);
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