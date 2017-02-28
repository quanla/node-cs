require("../../common-utils");

exports.csHtml = function(options) {

    var bundle = require("./bundle")();

    var replaces = {};
    options.replaces.forEach(function(r) {
        replaces[r.from] = r.to;
    });

    return require("./layout")({
        file: "./" + options.file,
        bundle: bundle,
        replaces: replaces
    });
};