$(function(){
  window.BallView = Backbone.View.extend({
    initialize: function () {
      this.model.bind('change', this.render, this);
    },

    tagName: 'div',

    id: 'ball',

    render: function () {
      $(this.el)
        .css('bottom', this.model.get('bottom'))
        .css('left', this.model.get('left'))
        .css('width', this.model.get('width'));
      return this;
    }
  });
});
