var swig = require('swig');
var inherits = require('inherits');
var EE = require('events').EventEmitter;
var Template = require('./template');

var filters = [
  'currency',
  'divisibleby',
  'add_url_param',
  'slugify',
  'truncatewords',
  'string_format',
  'findwhere',
  'prop',
  'get_product_attribute',
  'get_product_attribute_value'
];

var HyprManager = function(context) {
  var self = this;
  var cache = this.cache = {};
  EE.apply(this, arguments);
  this.loader = swig.loaders.memory(context.templates, '/');
  this.engine = new swig.Swig({
    cache: {
      get: function(key) {
        return cache[key];
      },
      set: function(key, value) {
        cache[key] = value;
      }
    },
    locals: context.locals,
    loader: this.loader
  });

  filters.forEach(function(name) {
    self.engine.setFilter(name, require('./filters/' + name)(self));
  });

};
inherits(HyprManager, EE);

var methods = {
  getTemplate: function (path) {
    var lpath = path.toLowerCase(),
        tpt = this.cache[lpath],
        tptText;
    if (!tpt) {
      tptText = this.loader.load(lpath);
      if (!tptText) {
        throw new ReferenceError("HyprLive template \"" + lpath + "\" not found!");
      } else {
        tpt = this.engine.compile(tptText, {
          filename: lpath
        });
      }
    }
    return new Template(tpt, lpath, this);
  },
  render: function(template, obj) {
    this.emit('beforerender', template.tpl, obj, template.path);
    var evaluated = template.tpl(obj, template.path);
    this.emit('afterrender', template.tpl, obj, template.path, evaluated);
    return evaluated;
  },
  evaluate: function(tptText, obj) {
    var tpl = this.cache[tptText];
    // cache with the entire template string as the key
    // seems ugly but has no obvious downsides
    if (!tpl) {
      tpl = this.engine.compile(tptText, {
        filename: tptText
      });
    }
    return this.render(new Template(tpl, tptText, this), obj);
  }
};

Object.keys(methods).forEach(function(name) {
  HyprManager.prototype[name] = methods[name];
});

module.exports = HyprManager;