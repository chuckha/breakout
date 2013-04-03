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
    dx: 3,
    dy: 3,
    render: function (ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#0F0";
      ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
      ctx.fill();
    },
  });

  var Paddle = new glitz.Renderable({
    width: 80,
    height: 10,
    render: function (ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#444";
      ctx.fillRect(0,0, this.width, this.height);
    }
  });

  var game = new Game({x:300, y:10});

  var i, j;
  var brick;
  var bricks = [];
  for (j = 0; j < 8; j++) {
    for (i = 0; i < 6; i++) {
      brick = new Brick({x:5 + (5 + BPROPS.width) * j, y:5 + (5 + BPROPS.height) * i});
      bricks.push(brick)
      game.push(brick);
    }
  }

  var ball = new Ball({x:game.width/2, y:game.height - 40});
  game.push(ball);
  var paddle = new Paddle({x:0, y: game.height - 20})
  game.push(paddle);
  engine.push(game);

  var paddleLeft = false;
  var paddleRight = false;

  $(document).keydown(function (e) {
    // l moves right
    if (e.which == 76) {
      paddleRight = true;
    }
    // h moves left
    if (e.which == 72) {
      paddleLeft = true;
    }
  }).keyup(function (e) {
    if (e.which == 76) {
      paddleRight = false;
    } else if (e.which == 72) {
      paddleLeft = false;
    }
  });

  engine.loop( function() {
    var topx = ball.x;
    var topy = ball.y - ball.radius;

    var leftx =  ball.x - ball.radius;
    var lefty =  ball.y;

    var rightx = ball.x + ball.radius;
    var righty = ball.y;

    var bottomx = ball.x;
    var bottomy = ball.y + ball.radius;
    // paddle collision:
    if (bottomy >= paddle.y) {
      if (bottomy <= paddle.y + paddle.height) {
        if (bottomx <= paddle.x + paddle.width) {
          if (bottomx >= paddle.x) {
            var normalized_distance_from_center = ((paddle.x + paddle.width/2) - ball.x) / paddle.width/2;
            var reflected_angle = (Math.PI / 4) + 4 * (normalized_distance_from_center);
            var magnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            ball.dx = Math.cos(reflected_angle) * magnitude;
            ball.dy = Math.sin(reflected_angle) * magnitude;
          }
        }
      }
    }
    if (lefty <= (paddle.y + paddle.height)) {
      if (lefty >= paddle.y) {
        if (leftx <= (paddle.x + paddle.width)) {
          if (leftx >= paddle.x) {
            ball.dx *= -1;
          }
        }
      }
    }
    if (righty <= (paddle.y + paddle.height)) {
      if (righty >= paddle.y) {
        if (rightx <= (paddle.x + paddle.width)) {
          if (rightx >= paddle.x) {
            ball.dx *= -1;
          }
        }
      }
    }
    // edge of game collision:
    // left side of the game
    if (ball.x - ball.radius <= 0) {
      ball.dx = ball.dx * -1;
    }
    // right side of the game
    if (ball.x + ball.radius >= ball.parent.width) {
      ball.dx = ball.dx * -1;
    }
    // top of the game
    if (ball.y - ball.radius <= 0) {
      ball.dy = ball.dy * -1;
    }
    // bottom of the game
    if (ball.y + ball.radius >= ball.parent.height) {
      // FIXME: lives -= 1
      ball.dy = ball.dy * -1;
    }
    // brick collision

    for (i = 0; i < bricks.length; i ++) {
      brick = bricks[i];
      if (topy <= (brick.y + brick.height)) {
        if (topy >= brick.y) {
          if (topx <= (brick.x + brick.width)) {
            if (topx >= brick.x) {
              console.log("top");
              brick.remove();
              bricks.splice(i, 1);
              ball.dy = ball.dy * -1;
              break;
            }
          }
        }
      }
      if (lefty <= (brick.y + brick.height)) {
        if (lefty >= brick.y) {
          if (leftx <= (brick.x + brick.width)) {
            if (leftx >= brick.x) {
              console.log("left");
              brick.remove();
              bricks.splice(i, 1);
              ball.dx = ball.dx * -1;
              break;
            }
          }
        }
      }
      if (righty <= (brick.y + brick.height)) {
        if (righty >= brick.y) {
          if (rightx <= (brick.x + brick.width)) {
            if (rightx >= brick.x) {
              console.log("right");
              brick.remove();
              bricks.splice(i, 1);
              ball.dx = ball.dx * -1;
              break;
            }
          }
        }
      }
      if (bottomy <= (brick.y + brick.height)) {
        if (bottomy >= brick.y) {
          if (bottomx <= (brick.x + brick.width)) {
            if (bottomx >= brick.x) {
              console.log("bottom");
              brick.remove();
              bricks.splice(i, 1);
              ball.dy = ball.dy * -1;
              break;
            }
          }
        }
      }
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (paddleLeft) {
      if (paddle.x > 0) {
        paddle.x -= 5;
      }
    }
    if (paddleRight) {
      if (paddle.x + paddle.width < paddle.parent.width) {
        paddle.x += 5;
      }
    }
  });
})();
