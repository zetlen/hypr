var swig = require('swig');
var inherits = require('inherits');
var EE = require('events').EventEmitter;

var filters = {
  currency: require('./filters/currency'),
  divisibleby: require('./filters/divisibleby'),
  add_url_param: require('./filters/add_url_param'),
  slugify: require('./filters/slugify'),
  truncatewords: require('./filters/truncatewords'),
  string_format: require('./filters/string_format'),
  findwhere: require('./filters/findwhere'),
  prop: require('./filters/prop'),
  get_product_attribute: require('./filters/get_product_attribute'),
  get_product_attribute_value: require('./filters/get_product_attribute_value')
};

var HyprManager = function(context) {
  var self = this;
  EE.apply(this, arguments);

  if (!context) {
    throw new Error('Hypr requires a context to be set');
  }
  this.context = context;
  
  this.engine = new swig.Swig({
    cache: this.cache || 'memory',
    locals: this.context.locals,
    loader: this.loader || swig.loaders.memory(context.templates, '/')
  });

  Object.keys(filters).forEach(function(name) {
    self.engine.setFilter(name, filters[name](self));
  });

};
inherits(HyprManager, EE);

HyprManager.prototype.evaluate = function(tptText, obj) {
  return this.engine.render(tptText, { locals: obj });    
};

HyprManager.prototype.createLoader = function(name) {
  return swig.loaders[name].apply(swig.loaders, [].slice.call(arguments, 1));
}


module.exports = HyprManager;