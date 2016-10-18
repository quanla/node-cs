require("./src/common-utils");

module.exports = function(serverOptions) {

    //if (serverOptions.compileScss == null) {
    //    serverOptions.compileScss = [{
    //        from: "app/scss/style.scss",
    //        to: "app/css/style.css",
    //        watches: ["app/scss"],
    //        appScss: "app/spa"
    //    }];
    //}
    //
    //if (serverOptions.injectJs == null) {
    //    serverOptions.injectJs = [{
    //        bundleFile: "App_Start/BundleConfig.cs",
    //        dir: "app/spa"
    //    }];
    //}

    return {
        start: function(prepareApp) {
            return require("./src/express-server")(serverOptions).start(prepareApp);




            //require("./src/sass-watcher")(serverOptions).start();
            //require("./src/js-watcher")(serverOptions).start();
        }
    };
};