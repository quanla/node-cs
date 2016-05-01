module.exports = function(path) {
    path = path || "./App_Start/BundleConfig.cs";


    var $q = require("q");
    return function() {

        var defer = $q.defer();
        require("fs").readFile(path, "utf8", function(err, content) {

            //console.log(content);

            var bundles = {};

            RegexUtil.each("var (.+?) = new (?:StyleBundle|ScriptBundle)\\(\"(.+?)\"\\);", content, function(match) {
                var bundleVarName = match[1];
                var bundleName = match[2];

                var dec = new RegExp(bundleVarName + "\\.Include\\(([^)]+?)\\);").exec(content)[1];

                var list = [];
                RegexUtil.each(new RegExp("^\\s+\"(.+?)\"", "mg"), dec, function(m3) {
                    list.push(m3[1].replace(/^~\//, ""));
                });
                bundles[bundleName] = list;
            });

            defer.resolve(bundles);
        });



        return defer.promise;
    };
};