function prop(o, pn, caseSensitive) {
  if (o) {
    if (caseSensitive) return o[pn];
    pn = pn.toLowerCase();
    for (var k in o) {
      if (pn === k.toLowerCase()) return o[k];
    }
  }
  return '';
}
module.exports = function() {
  return prop;
};