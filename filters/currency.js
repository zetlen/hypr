function formatMoney(n, decPlaces, thouSeparator, decSeparator, symbol, symbolIsSuffix, roundUp) {
    var sign, i, j, s, om;
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
    om = Math.pow(10, decPlaces);
    symbol = symbol || "$";
    decSeparator = decSeparator == undefined ? "." : decSeparator;
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
    sign = n < 0 ? "-" : "";
    i = parseInt(n = (Math.round(om * Math.abs(+n || 0)) / om), 10) + "";
    j = (j = i.length) > 3 ? j % 3 : 0;
        s = (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    return sign + (symbolIsSuffix ? s + symbol : symbol + s);
}

var currencyInfo,
    RoundingTypeConst = {
        UpToCurrencyPrecision: 'upToCurrencyPrecision'
    };

module.exports = function(manager) {
    return function(num, symbol) {
        if (!currencyInfo) {
            try {
                currencyInfo = manager.engine.options.locals.siteContext.currencyInfo;
            } catch (e) {
                currencyInfo = {
                    symbol: '$',
                    precision: 2,
                    roundingType: 'upToCurrencyPrecision'
                };
            }
        }
        return formatMoney(num, currencyInfo.precision, null, null, symbol || currencyInfo.symbol, false, currencyInfo.roundingType === RoundingTypeConst.UpToCurrencyPrecision);
    };
};