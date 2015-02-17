var findWhere = require('./findwhere')();
function getProductAttribute(product, attributeName) {
  return findWhere(product.properties.concat(product.options), 'attributeFQN', attributeName);
}
module.exports = function() {
  return getProductAttribute;
}