$(function(){
  window.Ball = Backbone.Model.extend({
    moveX: function () {
      var x = this.get('xSpeed');
      var l = this.get('left');
      // if the left position + the (negative) speed (aka next frame)
      // is less than 0, turn it around
      if (l + x < 0  ) {
        x = x * -1;
      // else if the left position + the width is bigger than
      } else if (l + this.get('width') > BREAKOUT_WIDTH) {
        x = x * -1;
      }
      this.set({'xSpeed': x})
      this.set({'left': l + x});
    },
    
    moveY: function () {
      var y = this.get('ySpeed');
      var b = this.get('bottom');
      if (b + this.get('height') > BREAKOUT_HEIGHT) {
        y = y * -1;
      // if the ball falls below the bottom on the next frame
      // turn it around
      } else if (b + y < 0) {
        y = y * -1;
      }
      this.set({'ySpeed': y})
      this.set({'bottom': y + b})
    },

    move: function () {
      this.moveX();
      this.moveY(); 
    },

    defaults: {
      "xSpeed": 8,
      "ySpeed": 4,
      "left": 0,
      "bottom": 0,
      "width": 10,
      "height": 10
    }
  });
});
