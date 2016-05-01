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


module.exports = function(options) {

    var $q = require("q");

    function serve() {
        var defer = $q.defer();

        var fs = require("fs");
        fs.readFile("./Views/Shared/_Layout.cshtml", 'utf8', function (err,content) {
            if (err) {
                return console.log(err);
            }

            content = removeComments(content);
            content = content.replace("@RenderBody()", "");
            content = replaceBundles(content, options.bundle);

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