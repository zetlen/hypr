var prop = require('./prop')();
var getProductAttribute = require('./get_product_attribute')();
function getProductAttributeValue(product, attributeName, attributeValue) {
    var attr = getProductAttribute(product, attributeName), values, value;
    if (attr) {
        values = prop(attr, 'values', true);
        if (values) {
            value = values[0];
            return prop(value, 'stringValue', true) || prop(value, 'value', true)
        }
    }
    return '';
}
module.exports = function() {
    return getProductAttributeValue;
}