$(function(){
  window.CellView = Backbone.View.extend({
    tagName: "div",

    className: "cell",

    template: _.template($('#cell-template').html()),
    
    render: function () {
     $(this.el).html(this.template(this.model.toJSON()));
     return this; 
    }
  });
});
