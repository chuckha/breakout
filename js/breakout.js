(function() {
  // Engine setup
  var engine = window.engine = new glitz.Engine(document.getElementById('canvas'));
  engine.setSize($(window).width(), $(window).height()-5);
  engine.layout.backgroundColor = '#111';

  // Models
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
    left: false,
    right: false,
    width: 80,
    height: 10,
    render: function (ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#444";
      ctx.fillRect(0,0, this.width, this.height);
    }
  });

  // Game instance setup
  var game = new Game({x:300, y:10});
  var i, j;
  var brick;
  var bricks = [];
  // FIXME: make a JSON object that can represent the layout of bricks for more than one level.
  for (j = 0; j < 8; j++) {
    for (i = 0; i < 6; i++) {
      brick = new Brick({x:5 + (5 + BPROPS.width) * j, y:5 + (5 + BPROPS.height) * i});
      bricks.push(brick)
      game.push(brick);
    }
  }

  var ball = new Ball({x:game.width/2, y:game.height - 40});
  var paddle = new Paddle({x:0, y: game.height - 20})

  game.push(ball);
  game.push(paddle);
  engine.push(game);

  // Set the key listening functions
  // on each frame that paddle.<dir> is true, move the paddle <dir>
  $(document).keydown(function (e) {
    // l moves right
    if (e.which == 76) {
      paddle.right = true;
    }
    // h moves left
    if (e.which == 72) {
      paddle.left = true;
    }
  }).keyup(function (e) {
    if (e.which == 76) {
      paddle.right = false;
    } else if (e.which == 72) {
      paddle.left = false;
    }
  });


  // Rect must have the following properties:
  //     x, y, width, height
  function point_rect_collision(x, y, rect) {
    return (y <= rect.y + rect.height)
      && (y >= rect.y)
      && (x <= rect.x + rect.width)
      && (x >= rect.x)
  };

  // Main game loop
  engine.loop( function() {

    if (paddle.left) {
      if (paddle.x > 0) {
        paddle.x -= 5;
      }
    }
    if (paddle.right) {
      if (paddle.x + paddle.width < paddle.parent.width) {
        paddle.x += 5;
      }
    }

    // Define points on the ball
    var topx = ball.x;
    var topy = ball.y - ball.radius;

    var leftx =  ball.x - ball.radius;
    var lefty =  ball.y;

    var rightx = ball.x + ball.radius;
    var righty = ball.y;

    var bottomx = ball.x;
    var bottomy = ball.y + ball.radius;

    // ball collides with paddle?
    if (point_rect_collision(bottomx, bottomy, paddle))
      ball.dy *= -1;
    if (point_rect_collision(leftx, lefty, paddle))
      ball.dx *= -1;
    if (point_rect_collision(rightx, righty, paddle))
      ball.dx *= -1;
      
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
    // For each brick
    //  See if the top of the ball has collided
    for (i = 0; i < bricks.length; i ++) {
      brick = bricks[i];
      if (point_rect_collision(topx, topy, brick)) {
        brick.remove();
        bricks.splice(i, 1);
        ball.dy *= -1;
        break;
      }
      //  See if the bottom of the ball has colided
      if (point_rect_collision(bottomx, bottomy, brick)) {
        brick.remove();
        bricks.splice(i, 1);
        ball.dy *= -1;
        break;
      }
      //  See if the left of the ball has collided
      if (point_rect_collision(leftx, lefty, brick)) {
        brick.remove();
        bricks.splice(i, 1);
        ball.dx *= -1;
        break;
      }
      //  See if the right of the ball has collided
      if (point_rect_collision(rightx, righty, brick)) {
        brick.remove();
        bricks.splice(i, 1);
        ball.dx *= -1;
        break;
      }
    }

    // After the collision has or hasn't taken place
    // Update the location of the ball.
    ball.x += ball.dx;
    ball.y += ball.dy;
  });
})();
