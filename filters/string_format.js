function stringFormat(tpt) {
  var formatted = tpt, otherArgs = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, len = otherArgs.length; i < len; i++) {
      formatted = formatted.split('{' + i + '}').join(otherArgs[i]);
  }
  return formatted;
}
module.exports = function() {
  return stringFormat;
};