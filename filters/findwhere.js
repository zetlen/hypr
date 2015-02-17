var prop = require('./prop')();
function findWhere(list, k, v, caseSensitive) {
    var length = list.length;
    var o;
    for (var i = 0; i < length; i++) {
        o = prop(list[i], k, caseSensitive);
        if (typeof o !== "undefined" && ((caseSensitive && o === v) || o.toString().toLowerCase() === v.toString().toLowerCase())) return list[i];
    }
}
module.exports = function() {
  return findWhere;
};