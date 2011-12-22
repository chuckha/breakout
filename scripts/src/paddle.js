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
