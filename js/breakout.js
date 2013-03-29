(function() {
  var engine = window.engine = new glitz.Engine(document.getElementById('canvas'));
  engine.setSize($(window).width(), $(window).height()-5);
  engine.layout.backgroundColor = '#111';

  var Game = new glitz.Renderable({
    width: 365,
    height: 500,
    render: function(ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, this.width, this.height);
    }
  });

  var BPROPS = {
    height: 15,
    width: 40,
  };

  var Brick = new glitz.Renderable({
    height: BPROPS.height,
    width: BPROPS.width,
    render: function(ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#F00";
      ctx.fillRect(0,0, this.width, this.height);
    }
  });

  var Ball = new glitz.Renderable({
    radius: 5,
    dx: '+1',
    dy: '-1',
    render: function (ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#0F0";
      ctx.arc(5, 5, this.radius, 0, Math.PI*2, false);
      ctx.fill();
    }
  });

  var game = new Game({x:300, y:10});

  var i, j;
  var brick;
  for (j = 0; j < 8; j++) {
    for (i = 0; i < 6; i++) {
      brick = new Brick({x:5 + (5 + BPROPS.width) * j, y:5 + (5 + BPROPS.height) * i});
      game.push(brick);
    }
  }
  var numBricks = i * j;

  var ball = new Ball({x:game.width/2, y:game.height-20});
  game.push(ball);
  engine.push(game);

  !function loop () {
    ball.animate([
        {to: {x: ball.dx, y: ball.dy}, duration: 0, done: loop},
    ]);

    // Collision:
    // left side of the game
    if (ball.x - 1 <= 0) {
      ball.dx = '+1';
    }
    // right side of the game
    if (ball.x + 11 >= ball.parent.width) {
      ball.dx = '-1';
    }
    // top of the game
    if (ball.y - 1 <= 0) {
      ball.dy = '+1';
    }
    // bottom of the game
    if (ball.y + 11 >= ball.parent.height) {
      // FIXME: lives -= 1
      ball.dy = '-1';
    }
    // brick collision
    for (i = 0; i < numBricks; i ++) {
      brick = game[i];
      if (ball.y < brick.y + brick.height && ball.y > brick.y) {
        if (ball.x > brick.x && ball.x < (brick.x + brick.width)) {
          brick.remove();
          numBricks -= 1;
          ball.dy = '+1';
        }
      }
    }
    
  }();

})();
