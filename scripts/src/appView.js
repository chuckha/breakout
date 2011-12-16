$(function(){
  window.AppView = Backbone.View.extend({
    el: $('#breakout'),

    initialize: function () {
     // perhaps take a string
     // parse it and create views and cells
    },

    addObject: function(view) {
      $(this.el).append(view.render().el);
    }
  });
});
