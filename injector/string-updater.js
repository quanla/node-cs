require("../src/common-utils");

function StringUpdater(string) {
    var changes = [];
    
    this.addReplace = function(start, end, content) {
        changes.push({
            start: start,
            end: end,
            content: content,
        });
    };

    this.applyChanges = function() {
        changes.sort(Cols.sortBy(function(change) { return -change.start;}));
        var newString = string;
        for (var i = 0; i < changes.length; i++) {
            var change = changes[i];
            newString = newString.substring(0, change.start) + change.content + newString.substring(change.end);
        }
        return newString;
    };
}

module.exports = {
    StringUpdater: StringUpdater
};