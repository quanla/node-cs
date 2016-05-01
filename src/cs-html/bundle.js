module.exports = function(path) {
    path = path || "./App_Start/BundleConfig.cs";

    var fs = require("fs");
    var content = fs.readFileSync(path, "utf8");


    //console.log(content);

    var bundles = {};
    var type = "";

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

    return bundles;
};