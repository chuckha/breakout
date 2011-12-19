function Vector (i, j) {
  this.i = i;
  this.j = j;
};

function Point (x, y) {
  this.x = x;
  this.y = y;
};

function Speed (xSpeed, ySpeed) {
  this.x = xSpeed;
  this.y = ySpeed;
};

function Component () {
};

function Input () {
  Component.call(this);
};

Input.prototype = new Component();

function Graphic () {
  Component.call(this);
};

Graphic.prototype = new Component();

function Physics () {
  Component.call(this);
};

Physics.prototype = new Component();

function Entity () {
  var that = this
  this.components = [];
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
  this.position = null;
  this.width = null;
  this.height = null;
  this.ctx = null;
  this.color = null;
  this.speed = null;
  this.MAX_WIDTH = null;
  this.MAX_HEIGHT = null;
};

function PaddleInput () {
  Input.call(this);
  this.setListeners = function (entity) {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode == 65) {
        entity.speed.x = -5;
      } else if (event.keyCode == 83) {
        entity.speed.x = 5;
      }
    });
    document.addEventListener('keyup', function (event) {
      if (event.keyCode == 65) {
        entity.speed.x = 0;
      } else if (event.keyCode == 83) {
        entity.speed.x = 0;
      }
    });
  };
};

PaddleInput.prototype = new Input();

function PaddleGraphic () {
  Graphic.call(this);
  this.update = function (entity) {
    entity.ctx.fillStyle = entity.color;  
    entity.ctx.fillRect(entity.position.x, entity.position.y, 
                        entity.width, entity.height);  
  };
};

PaddleGraphic.prototype = new Graphic();

function PaddlePhysics () {
  Physics.call(this);
  this.update = function (entity) {
    entity.position.x = entity.position.x + entity.speed.x;
    entity.position.y = entity.position.y + entity.speed.y;
    if (entity.position.x < 0) {
      entity.position.x = 0;
    } else if (entity.position.x > entity.MAX_WIDTH - entity.width){
      entity.position.x = entity.MAX_WIDTH - entity.width;
    }
  };
};

PaddlePhysics.prototype = new Physics();

function Paddle () {
  Entity.call(this);
};

Paddle.prototype = new Entity();

window.onload = function () {
  window.HEIGHT = 400;
  window.WIDTH = 500;
  var canvas = document.getElementById('game');  
  canvas.setAttribute('height', HEIGHT);
  canvas.setAttribute('width', WIDTH);
  var ctx = canvas.getContext('2d');  

  window.p = new Paddle();
  p.addComponent(PaddleInput);
  p.addComponent(PaddlePhysics);
  p.addComponent(PaddleGraphic);
  p.ctx = ctx;
  p.MAX_WIDTH = WIDTH;
  p.MAX_HEIGHT = HEIGHT;
  p.color = "rbg(0,0,0)";
  p.width = 40;
  p.height = 10;
  p.position = new Point(0, HEIGHT - p.height - 10);
  p.speed = new Speed(0, 0);
  p.setListeners();

  id = window.setInterval(function () {
    ctx.clearRect(0,0,WIDTH, HEIGHT);
    p.run();
  }, 17);
};
