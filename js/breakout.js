(function() {
  var level0 = [
    [0,0,0,0,0,0,1]
  ];
  var level1 = [
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1]
  ];
  var level2 = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1],
    [1,0,2,1,2,1,0,1],
    [1,0,1,1,1,1,0,1],
    [1,0,1,2,2,1,0,1],
    [1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1],
    [1,1,1,1,1,1,1,1]
  ];
  var levels = [level2];
  var currentLevel = 0;
  // Sound setup
  var sounds = {
    brick: new Audio(["sounds/brick_hit.wav"]),
    paddle: new Audio(["sounds/paddle_hit.wav"])
  }

  var mute = false;

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

  function setupScene(objects) {
    for (var i=0, len=objects.length; i < len; i++) {
      game.push(objects[i]);
    }
  }

  function teardownScene(objects) {
    for (var i=0, len=objects.length; i < len; i++) {
      objects[i].remove();
    }
    $(document).off('keydown').off('keyup');
  }

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
    size: "12px",
    render: function(ctx) {
      ctx.closePath();
      ctx.font = this.size + " eightbit";
      ctx.fillStyle = "#111";
      ctx.fillText(this.label + this.data, 0, 0);
    }
  });

  var Brick1 = new glitz.Renderable({
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
  var Brick2 = new glitz.Renderable({
    height: BPROPS.height,
    width: BPROPS.width,
    render: function(ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#000";
      ctx.fillRect(0,0, this.width, this.height);
    },
    sound: function () {
      playSound(sounds['brick']);
    }
  });
  var Brick3 = new glitz.Renderable({
    height: BPROPS.height,
    width: BPROPS.width,
    render: function(ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "#0F0";
      ctx.fillRect(0,0, this.width, this.height);
    },
    sound: function () {
      playSound(sounds['brick']);
    }
  });

  var BrickTypes = [
    Brick1,
    Brick2,
    Brick3,
  ];

  var Ball = new glitz.Renderable({
    max_speed: Math.sqrt(32),
    radius: 5,
    dx: 4,
    dy: -4,
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
  engine.push(game);
  var ball;
  var paddle;
  var sound;
  var lives;
  var i, j;
  var brick;
  var bricks = [];
  var title;
  var start;
  var instructions1, instructions2;
  var goal;
  var start_screen_objects, game_objects;

  function start_screen() {
    title = new Label({label: "bricks", size: "80px", x: 35, y: game.height/4}); 
    start = new Label({label: "press the space bar to play", size: "15px", x: 65, y: game.height/2});
    goal = new Label({
      label: "Goal: Break all the bricks",
      size: "12px",
      x: 100,
      y: game.height/2 + 50
    });
    instructions1 = new Label({
      label: "Press the left and right arrows",
      size: "12px",
      x: 75,
      y: game.height/2 + game.height/4
    });
    instructions2 = new Label({
      label: "to move the paddle",
      size: "12px",
      x: 140,
      y: instructions1.y + 20
    });
    start_screen_objects = [title, start, instructions1, instructions2, goal];
    setupScene(start_screen_objects);
    engine.loop(function () {});
    $(document).on('keydown', function(e) {
      if (e.which == 32) {
        engine.unregisterAnimation();
        teardownScene(start_screen_objects);
        goal.remove();
        $(document).off('keydown');
        play_screen(levels[currentLevel]);
      }
    });
  }

  function build_level(level) {
    var num_rows, i;
    for (num_rows=0; num_rows < level.length; num_rows++) {
      for (i=0; i < level[num_rows].length; i++) {
        if (level[num_rows][i] != 0) {
          brick = new BrickTypes[level[num_rows][i]]({x:43 + (1 + BPROPS.width) * i, y: 40 + (1 + BPROPS.height) * num_rows});
          bricks.push(brick);
          game.push(brick);
        }
      }
    }
  }

  lives = new Label({label: "lives: ", x: 5, y: 15, data: 3});
  function play_screen(level) {
    console.log(engine);
    build_level(level);

    ball = new Ball({x:game.width/2, y:game.height - 40});
    paddle = new Paddle({x:game.width/2 - PPROPS.width/2, y: game.height - 20});
    //var score = new Label({text: "score: ", x: 5, y: 15});

    game_objects = [ball, paddle, lives];

    setupScene(game_objects);
    //game.push(score);

    // FIXME: set false on things like lose focus
    // Set the key listening functions
    // on each frame that paddle.<dir> is true, move the paddle <dir>
    $(document).on('keydown', function (e) {
      // l moves right
      if (e.which == 39) {
        paddle.right = true;
      }
      // h moves left
      if (e.which == 37) {
        paddle.left = true;
      }
    }).on('keyup', function (e) {
      if (e.which == 39) {
        paddle.right = false;
      } else if (e.which == 37) {
        paddle.left = false;
      }
    });
    start_game();
  };

  function game_over_screen() {
    var game_over = new Label({label:"game over", size: "50px", x:25, y:game.height/2});
    setupScene([game_over]);
  }

  // Rect must have the following properties:
  //     x, y, width, height
  function point_rect_collision(x, y, rect) {
    return (y <= rect.y + rect.height)
      && (y >= rect.y)
      && (x <= rect.x + rect.width)
      && (x >= rect.x)
  };

  function game_loop() {
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

    var paddle_collision = false;
    // ball collides with paddle?
    if (point_rect_collision(bottomx, bottomy, paddle)) {
      var midpoint_of_paddle = paddle.x + (paddle.width/2);
      var distance_from_center = bottomx - midpoint_of_paddle;
      var ratio_away_from_center = distance_from_center/(paddle.width/2);
      var new_x = 6 * ratio_away_from_center;
      var new_y = Math.sqrt(Math.abs(ball.max_speed * ball.max_speed - new_x * new_x));
      paddle_collision = true;
      ball.dy = -new_y;
      ball.dx = new_x;
      ball.y -= 1;
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
    if (ball.y + ball.radius >= ball.parent.height) {
      lives.data -= 1;
      if (lives.data == 0) {
        teardownScene(game_objects.concat(bricks));
        game_over_screen();
        engine.unregisterAnimation();
      } else {
        ball.x = game.width/2;
        ball.y = game.height - 40;
        ball.dx = 0;
        ball.dy = 0;
        paddle.x = game.width/2 - PPROPS.width/2;
        paddle.y = game.height - 20;
        window.setTimeout(function() {
          ball.dx = 4;
          ball.dy = -4;
        }, 1000);
      }
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
        ball.x += 1;
        break;
      }
      //  See if the right of the ball has collided
      if (point_rect_collision(rightx, righty, brick)) {
        collision = true;
        ball.dx = -ball.dx;
        ball.x -= 1;
        break;
      }
      if (point_rect_collision(topx, topy, brick)) {
        collision = true;
        ball.dy = -ball.dy;
        ball.y += 1;
        break;
      }
      //  See if the bottom of the ball has colided
      if (point_rect_collision(bottomx, bottomy, brick)) {
        collision = true;
        ball.dy = -ball.dy;
        ball.y -= 1;
        break;
      }
    }
    if (collision) {
      brick.sound();
      brick.remove();
      bricks.splice(i, 1);
      if (bricks.length == 0) {
        teardownScene(game_objects);
        engine.unregisterAnimation();
        // FIXME: Teardown!
        play_screen(levels[++currentLevel]);
      }
    }

    // After the collision has or hasn't taken place
    // Update the location of the ball.
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  // Main game loop
  function start_game() {
    engine.loop(game_loop);
  };

  start_screen();
})();
