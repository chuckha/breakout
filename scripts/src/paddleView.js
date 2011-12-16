$(function(){
  window.PaddleView = Backbone.View.extend({
    initialize: function () {
      this.model.bind('change', this.render, this);
    },
    
    tagName: "input",

    id: 'paddle',

    events: {
      "keydown": "move",
      "change": "render" 
    },

    move: function (e) {
      if (e.keyCode === 37) {
        this.model.moveLeft();
      } else if (e.keyCode === 39){
        this.model.moveRight();
      }
    },
  
    render: function () {
      $(this.el)
        .css('bottom', this.model.get('bottom'))
        .css('left', this.model.get('left'))
        .css('width', this.model.get('width'));
      return this;
    }
  });
});
