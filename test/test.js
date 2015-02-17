/*global describe, it */
'use strict';
var expect = require('chai').expect;
var HyprManager = require('../').Manager;
var Hypr = new HyprManager({
  templates: {},
  locals: {}
});

var MozuProduct = require('./fixture/product.json');

describe('manager', function() {
  it('evaluates scripts in place', function() {
    expect(Hypr.evaluate('herpa derpa derp')).to.equal('herpa derpa derp');
    expect(Hypr.evaluate('{% for num in list %}{% if not forloop.first %}, {% endif %}numba {{ num }}{% endfor %}', { list: [9, 9, 1] })).to.equal('numba 9, numba 9, numba 1');
  });
});

describe('builtin filters', function() {
  it('has a currency filter that formats currency (currently US only)', function() {
      expect(Hypr.evaluate('{{ dolla|currency }}', { dolla: 3 })).to.equal('$3.00');
      expect(Hypr.evaluate('{{ dolla|currency }}', { dolla: 3.0002 })).to.equal('$3.00');
      expect(Hypr.evaluate('{{ dolla|currency("USD ") }}', { dolla: 3.0002 })).to.equal('USD 3.00');
      expect(Hypr.evaluate('{{ dolla|currency }}', { dolla: 3000000 })).to.equal('$3,000,000.00');
  });
  it('has a divisibleby filter that returns true if the number is divisible by the argument', function() {
      var tpt2 = '{% if n|divisibleby(2) %}{{ n }}{% else %}no{% endif %}';
      var tpt3 = '{% if n|divisibleby(3) %}{{ n }}{% else %}no{% endif %}';
      expect(Hypr.evaluate(tpt2, { n: 4 })).to.equal('4');
      expect(Hypr.evaluate(tpt2, { n: 5 })).to.equal('no');
      expect(Hypr.evaluate(tpt3, { n: 5 })).to.equal('no');
      expect(Hypr.evaluate(tpt3, { n: 6 })).to.equal('6');
  });
  it('has an add_url_param filter that adds a parameter intelligently to a url', function() {
      var url = 'http://example.com/',
          urlWithQuery = url + '?one=two',
          urlWithTwoQueries = urlWithQuery + '&three=four',
          ctx = {
            url1: url,
            url2: urlWithQuery,
            url3: urlWithTwoQueries
          };
      expect(Hypr.evaluate('{{ url1|add_url_param("sortBy","derp desc") }}', ctx)).to.equal('http://example.com/?sortBy=derp%20desc');
      expect(Hypr.evaluate('{{ url2|add_url_param("sortBy","derp asc") }}', ctx)).to.equal('http://example.com/?one=two&amp;sortBy=derp%20asc');
      expect(Hypr.evaluate('{{ url3|add_url_param("sortBy","flerp asc") }}', ctx)).to.equal('http://example.com/?one=two&amp;three=four&amp;sortBy=flerp%20asc');
  });
  it('has a slugify filter that turns strings into url-suitable slugs', function() {
      var stpt = '{{ s|slugify }}';
      expect(Hypr.evaluate(stpt, { s: 'ábso,lutely!' })).to.equal('abso-lutely-');
  });
  it('has a truncatewords filter that truncates strings by word count and adds an ellipsis', function() {
      expect(Hypr.evaluate('{{ d|truncatewords(5) }}', { d: 'One two three four' } )).to.equal('One two three four');
      expect(Hypr.evaluate('{{ d|truncatewords(5) }}', { d: 'One two three four five six' })).to.equal('One two three four five ...');
  });
  it('has a string_format filter that interpolates an arbitrary number of vars into a format string', function() {
      expect(Hypr.evaluate('{{ f|string_format(y) }}', { f: '{0}', y: '1' })).to.equal('1');
      expect(Hypr.evaluate('{{ f|string_format(x,y,z) }}', { f: '{0} {1}{{2}}', x: 'What', y: 'is', z: 'this' })).to.equal('What is{this}');
  });
  it('has a prop filter that gets the property of an object, used at the end of filter chains, case insensitive by default', function() {
      expect(Hypr.evaluate('{{ list|first|prop("name") }}', { list: [{ name: 'Nigel' }, { name: 'David' }] })).to.equal('Nigel');
      expect(Hypr.evaluate('{{ list|first|prop("Name") }}', { list: [{ name: 'Nigel' }, { name: 'David' }] })).to.equal('Nigel');
      expect(Hypr.evaluate('{{ list|first|prop("Name") }}', { list: [{ name: 'Nigel' }, { name: 'David' }] })).to.equal('Nigel');
      expect(Hypr.evaluate('{{ list|first|prop("Name", true) }}', { list: [{ name: 'Nigel' }, { Name: 'David' }] })).to.equal('');
  });
  it('has a findwhere filter that gets the member of a collection that has a certain property value', function() {
      expect(Hypr.evaluate('{{ list|findwhere("Name","david")|prop("instrument") }}', { list: [{ name: 'Nigel', instrument: 'lead guitar' }, { name: 'David', instrument: 'rhythm guitar' }] })).to.equal('rhythm guitar');
      expect(Hypr.evaluate('{{ list|findwhere("Name","david", true)|prop("instrument") }}', { list: [{ name: 'Nigel', instrument: 'lead guitar' }, { name: 'David', instrument: 'rhythm guitar' }] })).to.equal('');
  });
  it('has a get_product_attribute filter that gets an attribute on a mozu runtime product', function() {
      var tpt1 = '{{ p|get_product_attribute("tenant~manufacturer")|prop("values")|first|prop("stringValue") }}';
      expect(Hypr.evaluate(tpt1, { p: MozuProduct })).to.equal('Seismic Audio');
      var tpt2 = '{{ p|get_product_attribute("tenant~product-crosssell")|prop("values")|first|prop("stringValue") }}';
      expect(Hypr.evaluate(tpt2, { p: MozuProduct })).to.equal('Speaker-Stand');
      var tpt3 = '{{ p|get_product_attribute("tenant~additional-handling")|prop("values")|first|prop("value") }}';
      expect(Hypr.evaluate(tpt3, { p: MozuProduct })).to.equal('false');
  });
  it('has a get_product_attribute_value filter that gets the first value of an attribute on a mozu runtime product', function() {
      var tpt1 = '{{ p|get_product_attribute_value("tenant~manufacturer") }}';
      expect(Hypr.evaluate(tpt1, { p: MozuProduct })).to.equal('Seismic Audio');
      var tpt2 = '{{ p|get_product_attribute_value("tenant~product-crosssell") }}';
      expect(Hypr.evaluate(tpt2, { p: MozuProduct })).to.equal('Speaker-Stand');
      var tpt3 = '{{ p|get_product_attribute_value("tenant~additional-handling") }}';
      expect(Hypr.evaluate(tpt3, { p: MozuProduct })).to.equal('false');
      var tpt4 = '{% if p|get_product_attribute_value("tenant~additional-handling") %}Has Handling{% endif %}';
      expect(Hypr.evaluate(tpt4, { p: MozuProduct })).to.equal('');
      var tpt5 = '{% if p|get_product_attribute_value("tenant~true-thing") %}Has True Thing{% endif %}';
      expect(Hypr.evaluate(tpt5, { p: MozuProduct })).to.equal('Has True Thing');
  });
});