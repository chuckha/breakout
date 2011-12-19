$(function(){
  window.AppView = Backbone.View.extend({
    el: $('#breakout'),

    initialize: function () {
      $(this.el)
        .css('width', BREAKOUT_WIDTH + "px")
        .css('height', BREAKOUT_HEIGHT + "px");
     // perhaps take a string
     // parse it and create views and cells
    },

    addObject: function(view) {
      $(this.el).append(view.render().el);
    }
  });
});
