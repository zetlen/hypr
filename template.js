var HyprLiveTemplate = function(tpl, path, manager) {
    this.tpl = tpl;
    this.path = path;
    this.manager = manager;
};

HyprLiveTemplate.prototype.render = function(obj) {
  return this.manager.render(this, obj); 
};

module.exports = HyprLiveTemplate;