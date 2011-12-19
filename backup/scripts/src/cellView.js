$(function(){
  window.CellView = Backbone.View.extend({
    // Each cell is represented by a div.
    tagName: "div",

    className: "cell",

    render: function () {
      $(this.el).addClass('class-' + this.model.get('health'));
      return this; 
    }
  });
});
