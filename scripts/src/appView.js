$(function(){
  window.AppView = Backbone.View.extend({
    el: $('#breakout'),

    initialize: function () {
     // perhaps take a string
     // parse it and create views and cells
    },

    addOne: function(cellView) {
      $(this.el).append(cellView.render().el);
    }
  });
});
