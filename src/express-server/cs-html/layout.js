function replaceBundles(content, bundle) {

    content = RegexUtil.replaceAll(content, "@Styles\\.Render\\(\"(.+?)\"\\)", function(m) {
        return Cols.join(Cols.yield(bundle[m[1]], function(r) { return  "<link rel=\"stylesheet\" href=\"" + r.replace(/^~/, "") + "\"/>"; }), "\n");
    });

    content = RegexUtil.replaceAll(content, "@Scripts\\.Render\\(\"(.+?)\"\\)", function(m) {
        return Cols.join(Cols.yield(bundle[m[1]], function(r) { return  "<script type=\"text/javascript\" src=\"" + r.replace(/^~/, "") + "\"></script>"; }), "\n");
    });

    return content;
}
function removeComments(content) {
    return content.replace(new RegExp("@\\*(?:.|\r?\n)+?\\*@", "g"), "");
}
function simpleReplaces(content, vars) {
    Cols.eachEntry(vars, function(key, val) {
        if (val) {
            content = content.replace(key, val);
        }
    });
    return content;
}

function replacesAspxCode(content) {
    return content
            .replace(/@using .+?\r?\n/g, "")
            .replace(new RegExp("@\\{(?:.|\r?\n)+?\\}", "g"), "")
        ;
}

var $q = require("q");
function readFile(path) {
    var defer = $q.defer();

    var fs = require("fs");
    fs.readFile(path, 'utf8', function (err, content) {
        defer.resolve(content);
    });
    return defer.promise;
}

module.exports = function(options) {


    function serve() {
        var defer = $q.defer();

        $q.all([readFile(options.file), options.bundle()]).then(function(rets) {
            var htmlContent = rets[0];
            var bundles = rets[1];

            var content = removeComments(htmlContent);
            content = content.replace("@RenderBody()", "");
            content = replaceBundles(content, bundles);
            content = simpleReplaces(content, options.replaces);
            content = replacesAspxCode(content);

            if (options.modifier) {
                content = options.modifier(content);
            }

            defer.resolve(content);

        });

        return defer.promise;
    }




    //// Test
    //serve().then(function(content) {
    //    console.log(content);
    //});

    return function(req, res) {

        serve().then(function(content) {
            res.set("content-type", "text/html; charset=UTF-8");
            res.end(content);
        });
    }
};