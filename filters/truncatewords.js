function truncateWords (str, num) {
  var words = str.split(' ');
  str = words.slice(0, num).join(' ');
  if (words.length > num) str += " ...";
  return str;
};
module.exports = function(manager) {
  return truncateWords;
};