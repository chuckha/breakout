function Component () {
};

function Input () {
  Component.call(this);
};

Input.prototype = new Component();

function Graphic () {
  Component.call(this);
};

Graphic.prototype = new Component();

function Physics () {
  Component.call(this);
};

Physics.prototype = new Component();
