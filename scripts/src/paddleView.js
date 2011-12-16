$(function(){
  window.PaddleView = Backbone.View.extend({
    tagName: "div",

    render: function () {
      $(this.el).attr('id', 'paddle');
      return this;
    }
  });
});
