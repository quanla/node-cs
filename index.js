
module.exports = function(serverOptions) {

    require("./src/common-utils");

    function compileScss() {

    }

    return {
        start: function() {
            require("./src/express-server")(serverOptions).start();

            compileScss();
        }
    };
};