$(function(){
  window.Paddle = Backbone.Model.extend({
    defaults: {
      width: 50,
      left: 0,
      bottom: 10
    },

    moveLeft: function () {
      var x = this.get('left');
      if (x > 0) {
        x = x - 10;
      }
      this.set({'left': x});
    },
  
    moveRight: function () {
      var x = this.get('left');
      if (x < 520) {
        x = x + 10;
      }
      this.set({'left': x});
    }
  });
});
