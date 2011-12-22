function Entity (options) {
  var that = this;
  this.components = [];
  for (var property in options) {
    if (property == 'components') {
      for (var i=0; i<options[property].length; i++) {
        this.addComponent(options[property][i]);
      }
    } else {
      this[property] = options[property]
    }
  }
  this.addComponent = function (component) {
    this.components.push(new component());
  };
  this.run = function () {
    for(var i=0; i<that.components.length; i++){
      if (that.components[i].update) {
        that.components[i].update(that);
      }
    }
  };
  this.setListeners = function () {
    for(var i=0; i<this.components.length; i++){
      if (this.components[i].setListeners) {
        this.components[i].setListeners(this);
      }
    }
  };
};

function Paddle (options) {
  Entity.call(this, options);
};

Paddle.prototype = new Entity();
