var trimRE = /^\s+|\s+$/g,
    invalidCharsRE = /[^a-z0-9 -]/g,
    collapseWhitespaceRE = /\s+/g,
    collapseDashRE = /-+/g,
    accentREs = [],
    accentFrom = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;".split(''),
    accentTo = "aaaaeeeeiiiioooouuuunc------".split('');

for (var i = 0, l = accentFrom.length; i < l; i++) {
    accentREs[i] = new RegExp(accentFrom[i], 'g');
}

function slugify(str) {
    str = str.toString().replace(trimRE,'').toLowerCase();

    for (var j=0, k=accentFrom.length ; j<k ; j++) {
        str = str.replace(accentREs[j], accentTo[j]);
    }

    str = str.replace(invalidCharsRE, '-') // remove invalid chars
      .replace(collapseWhitespaceRE, '-') // collapse whitespace and replace by -
      .replace(collapseDashRE, '-'); // collapse dashes

    return str;
}
module.exports = function() {
    return slugify;
};