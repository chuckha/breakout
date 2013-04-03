(function() {
  // Sound setup
  var sounds = {
    brick: new Audio(["sounds/brick_hit.wav"]),
    paddle: new Audio(["sounds/paddle_hit.wav"])
  }

  var mute = true;

  // Play a sound even if the sound is already playing
  function playSound(sound) {
    if (!mute) {
      if (sound.ended) {
        sound.play();
      // If the sound has not ended, seek to the start of the audio and play it
      } else {
        sound.currentTime = 0;
        sound.play();
      }
    }
  }

  // Engine setup
  var engine = window.engine = new glitz.Engine(document.getElementById('canvas'));
  engine.setSize($(window).width(), $(window).height()-5);
  engine.layout.backgroundColor = '#111';

  // Models
  var Game = new glitz.Renderable({
    width: 500,
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
    width: 50,
  };

  var Label = new glitz.Renderable({
    label: "",
    data: "",
    render: function(ctx) {
      ctx.closePath();
      ctx.font = "12px eightbit";
      ctx.fillStyle = "#111";
      ctx.fillText(this.label + this.data, 0, 0);
    }
  });

  var Brick = new glitz.Renderable({
    height: BPROPS.height,
    width: BPROPS.width,
    render: function(ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#F00";
      ctx.fillRect(0,0, this.width, this.height);
    },
    sound: function () {
      playSound(sounds['brick']);
    }
  });

  var Ball = new glitz.Renderable({
    radius: 5,
    dx: 3,
    dy: -3,
    render: function (ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#0F0";
      ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
      ctx.fill();
    },
  });

  var PPROPS = {
    width: 80,
    height: 10
  };

  var Paddle = new glitz.Renderable({
    left: false,
    right: false,
    width: PPROPS.width,
    height: PPROPS.height,
    render: function (ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#444";
      ctx.fillRect(0,0, this.width, this.height);
    },
    sound: function () {
      playSound(sounds['paddle']);
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
      brick = new Brick({x:43 + (1 + BPROPS.width) * j, y:40 + (1 + BPROPS.height) * i});
      bricks.push(brick)
      game.push(brick);
    }
  }

  var ball = new Ball({x:game.width/2, y:game.height - 40});
  var paddle = new Paddle({x:game.width/2 - PPROPS.width/2, y: game.height - 20});
  //var score = new Label({text: "score: ", x: 5, y: 15});
  var lives = new Label({label: "lives: ", x: 5, y: 15, data: "3"})

  game.push(ball);
  game.push(paddle);
  //game.push(score);
  game.push(lives);
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

    var paddle_collision = false
    // ball collides with paddle?
    if (point_rect_collision(bottomx, bottomy, paddle)) {
      paddle_collision = true;
      ball.dy = -ball.dy;
    }
    if (point_rect_collision(leftx, lefty, paddle) 
        || point_rect_collision(rightx, righty, paddle)) {
      paddle_collision = true;
      ball.dx = -ball.dx;
    }
    if (paddle_collision) {
      paddle.sound();
    }
      
    // edge of game collision:
    // left || right side of the game turn the ball around
    if (ball.x - ball.radius  + ball.dx < 0 
        || ball.x + ball.radius + ball.dx > ball.parent.width) {
      ball.dx = -ball.dx;
    }

    // top of the game
    if (ball.y - ball.radius + ball.dy <= 0) {
      ball.dy = -ball.dy;
    }

    // bottom of the game
    // FIXME: Special case, reduce lives here
    if (ball.y + ball.radius >= ball.parent.height) {
      lives.data -= 1;
      ball.dy = -ball.dy;
    }

    // brick collision
    // For each brick
    //  See if the top of the ball has collided
    var collision = false;
    for (i = 0; i < bricks.length; i ++) {
      brick = bricks[i];
      //  See if the left of the ball has collided
      if (point_rect_collision(leftx, lefty, brick)) {
        collision = true;
        ball.dx = -ball.dx;
        break;
      }
      //  See if the right of the ball has collided
      if (point_rect_collision(rightx, righty, brick)) {
        collision = true;
        ball.dx = -ball.dx;
        break;
      }
      if (point_rect_collision(topx, topy, brick)) {
        collision = true;
        ball.dy = -ball.dy;
        break;
      }
      //  See if the bottom of the ball has colided
      if (point_rect_collision(bottomx, bottomy, brick)) {
        collision = true;
        ball.dy = -ball.dy;
        break;
      }
    }
    if (collision) {
      brick.sound();
      brick.remove();
      bricks.splice(i, 1);
    }

    // After the collision has or hasn't taken place
    // Update the location of the ball.
    ball.x += ball.dx;
    ball.y += ball.dy;
  });
})();
