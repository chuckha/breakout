(function() {
  // A testing level
  var level0 = [
    [0,0,0,0,0,1,0]
  ];
  // A basic level
  var level1 = [
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1]
  ];
  // The hacker school level!
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
  var levels = [level1, level2];
  var currentLevel = 0;

  var BRICKCOLOR = [
    "#f00",
    "#000",
    "#0f0"
  ];

  // Brick properties
  var BPROPS = {
    height: 15,
    width: 50,
  };

  // Paddle properties
  var PPROPS = {
    width: 80,
    height: 10
  };

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
    },
    getAllByType: function (type) {
      var objects = [];
      for (var i =0, len = this.length; i < len; i++) {
        if (this[i]._type === type) {
          objects.push(this[i]);
        }
      }
      return objects;
    }
  });

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

  var Brick = new glitz.Renderable({
    height: BPROPS.height,
    width: BPROPS.width,
    color: "#000",
    render: function(ctx) {
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.fillRect(0,0, this.width, this.height);
    },
    sound: function () {
      playSound(sounds['brick']);
    },
    collision: function (obj) {
      var side = ballRectCollision(obj, this);
      if (side !== undefined) {
        this.sound();
        this.remove();
      }
    }
  });

  var Ball = new glitz.Renderable({
    maxSpeed: Math.sqrt(32),
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
    collision: function (obj) {
      // implies always colliding with
      var side = ballRectCollision(this, obj);
      if (Brick.Array === obj.constructor || Wall.Array === obj.constructor){
        if (side === "left") {
          this.dx = -this.dx;
          this.x -= 1;
        } else if (side === "right") {
          this.dx = -this.dx;
          this.x += 1;
        } else if (side === "top") {
          this.dy = -this.dy;
          this.y -= 1;
        } else if (side === "bottom") {
          this.dy = -this.dy;
          this.y += 1;
        }
      } else if (Paddle.Array === obj.constructor) {
          if (side === "left") {
          this.dx = -this.dx;
          this.x -= 1;
        } else if (side === "right") {
          this.dx = -this.dx;
          this.x += 1;
        } else if (side === "top") {
          var midpointOfPaddle = obj.x + (obj.width/2);
          var distanceFromCenter = this.x + this.radius - midpointOfPaddle;
          var ratioAwayFromCenter = distanceFromCenter/(obj.width/2);
          var newX = 6 * ratioAwayFromCenter;
          var newY = Math.sqrt(Math.abs(this.maxSpeed * this.maxSpeed - newX * newX));
          this.dy = -newY;
          this.dx = newX;
          this.y -= 1;
        } else if (side === "bottom") {
          this.dy = -this.dy;
          this.y += 1;
        }
      }
    },
    outOfBounds: function () {
      return this.y + this.radius >= this.parent.height;
    },
    tick: function () {
      this.x += this.dx;
      this.y += this.dy;
    },
    init: function () {
      var self = this;
      self.x = game.width/2;
      self.y = game.height - 40;
      self.dx = 0;
      self.dy = 0;
      window.setTimeout(function() {
        self.dx = 4;
        self.dy = -4;
      }, 1000);
    }
  });

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
    init: function () {
      this.x = game.width/2 - PPROPS.width/2;
      this.y = game.height - 20;
    },
    sound: function () {
      playSound(sounds['paddle']);
    },
    collision: function(obj) {
      var side = ballRectCollision(obj, this);
      if (side !== undefined) {
        if (Ball.Array === obj.constructor) {
          this.sound();
        } else if (Wall.Array === obj.constructor) {
          if (side === "right") {
            this.left = false; 
          } else if (side === "left") {
            this.right = false;
          }
        }
      }
    },
    tick: function () {
      if (this.left) {
        if (this.x > 0) {
          this.x -= 5;
        }
      }
      if (this.right) {
        if (this.x + this.width < this.parent.width) {
          this.x += 5;
        }
      }
    }
  });

  var Wall = new glitz.Renderable({
    render: function () {}
  });

  // Game instance setup
  var game = new Game({x:300, y:10});
  engine.push(game);
  var ball,
      paddle,
      lives,
      title,
      start,
      instructions1, instructions2,
      goal,
      gameObjects;

  function startScreen() {
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
    var startScreenObjects = [title, start, instructions1, instructions2, goal];
    setupScene(startScreenObjects);
    engine.loop(function () {});
    $(document).on('keydown', function(e) {
      if (e.which == 32) {
        engine.unregisterAnimation();
        teardownScene(startScreenObjects);
        goal.remove();
        $(document).off('keydown');
        playScreen(levels[currentLevel]);
      }
    });
  }

  function buildLevel(level) {
    var numRows, i;
    for (numRows=0; numRows < level.length; numRows++) {
      for (i=0; i < level[numRows].length; i++) {
        if (level[numRows][i] != 0) {
          brick = new Brick({
            color: BRICKCOLOR[level[numRows][i]],
            x: 43 + (1 + BPROPS.width) * i, 
            y: 40 + (1 + BPROPS.height) * numRows
          });
          game.push(brick);
        }
      }
    }
  }

  lives = new Label({label: "lives: ", x: 5, y: 15, data: 3});
  function playScreen(level) {
    buildLevel(level);

    ball = new Ball();
    paddle = new Paddle();
    leftWall = new Wall({x: -20, y:0, width: 20, height:game.height});
    rightWall = new Wall({x: game.width, y: 0, width: 20, height: game.height});
    topWall = new Wall({x: 0, y: -20, width: game.width, height: 20});

    gameObjects = [ball, paddle, lives, leftWall, rightWall, topWall];
    setupScene(gameObjects);

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
    startGame();
  };

  function gameOverScreen() {
    var gameOver = new Label({label: "game over", size: "50px", x: 25, y: game.height/2});
    setupScene([gameOver]);
  }

  function winScreen() {
    var win = new Label({label: "Congratulations", size: "31px", x: 25, y: game.height/4});
    setupScene([win]);
  }

  // Rect must have the following properties:
  //     x, y, width, height
  function pointRectCollision(x, y, rect) {
    return (y <= rect.y + rect.height)
      && (y >= rect.y)
      && (x <= rect.x + rect.width)
      && (x >= rect.x);
  };
// undefined for no collision
// or the side that collided on
  function ballRectCollision(ball, rect) {
    var topx = ball.x;
    var topy = ball.y - ball.radius;

    var leftx =  ball.x - ball.radius;
    var lefty =  ball.y;

    var rightx = ball.x + ball.radius;
    var righty = ball.y;

    var bottomx = ball.x;
    var bottomy = ball.y + ball.radius;
    if (pointRectCollision(leftx, lefty, rect)) {
      return "right";
    } else if (pointRectCollision(rightx, righty, rect)) {
      return "left";
    } else if (pointRectCollision(topx, topy, rect)) {
      return "bottom";
    } else if (pointRectCollision(bottomx, bottomy, rect)) {
      return "top";
    }
  }

  function gameLoop() {
    paddle.tick();

    ball.collision(paddle);
    paddle.collision(ball);
    paddle.collision(leftWall);
    paddle.collision(rightWall);
      
    // bottom of the game
    if (ball.outOfBounds()) {
      lives.data -= 1;
      if (lives.data == 0) {
        teardownScene(gameObjects.concat(engine.filter(Brick)));
        gameOverScreen();
        engine.unregisterAnimation();
      } else {
        ball.init();
        paddle.init();
      }
    }

    // ball and sides of game
    var walls = engine.filter(Wall);
    for (var i = 0; i < walls.length; i++) {
      ball.collision(walls[i]);
    }

    // brick collision
    // For each brick
    //  See if the top of the ball has collided
    var bricks = engine.filter(Brick);
    for (var i = 0; i < bricks.length; i ++) {
      bricks[i].collision(ball);
      ball.collision(bricks[i]);
    }

    bricks = engine.filter(Brick);
    if (bricks.length == 0 && lives.data > 0) {
      teardownScene(gameObjects);
      engine.unregisterAnimation();
      if (currentLevel === levels.length - 1) {
        winScreen();
      } else {
        playScreen(levels[++currentLevel]);
      }
    }

    ball.tick();
  }

  // Main game loop
  function startGame() {
    engine.loop(gameLoop);
  };

  startScreen();
})();
