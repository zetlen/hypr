function addUrlParam(url, param, value) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(param) + '=' + encodeURIComponent(value);
};
module.exports = function() {
  return addUrlParam;
};
