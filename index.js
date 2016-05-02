
module.exports = function(serverOptions) {

    require("./src/common-utils");

    return {
        start: function() {
            require("./src/express-server")(serverOptions).start();

            require("./src/sass-watcher")(serverOptions).start();
            require("./src/js-watcher")(serverOptions).start();
        }
    };
};