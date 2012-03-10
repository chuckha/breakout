/* jslint */
var SPACING = 2;

var BRICK_WIDTH = 61.6;
var BRICK_HEIGHT = 10;

var PADDLE_WIDTH = 40;
var PADDLE_HEIGHT = 10;

var BALL_WIDTH = 10;
var BALL_HEIGHT = 10;

var game;

var Rect = function (x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w || BRICK_WIDTH;
  this.h = h || BRICK_HEIGHT;
};

var pointInRect = function (x, y, rect) {
  if (x >= rect.x && x < rect.x + rect.w &&
      y >= rect.y && y < rect.y + rect.h) {
    return true;
  }
  else {
    return false;
  }
};

var rectIntersect = function (rect1, rect2) {
  if (pointInRect(rect2.x, rect2.y, rect1) ||
      pointInRect(rect2.x + rect2.w, rect2.y, rect1) ||
      pointInRect(rect2.x, rect2.y + rect2.h, rect1) ||
      pointInRect(rect2.x + rect2.w, rect2.y + rect2.h, rect1)) {
        return true;
  }
  else {
    return false;
  }
};

var reverseX = function (ball) {
  return ball.dx * -1;
};

var reverseY = function (ball) {
  return ball.dy * -1;
};

var updateBall = function (c) {
  // collide right of canvas
  if (c.x >= window.Breakout.WIDTH - c.w) {
    c.dx = reverseX(c);
  }
  // collide left of canvas
  else if (c.x <= 0 + c.w) {
    c.dx = reverseX(c);
  }
  // collide bottom of canvas
  // FIXME score - 1
  if (c.y >= window.Breakout.HEIGHT - c.h) {
    c.dy = reverseY(c);
  }
  // collide top of canvas
  else if (c.y <= 0) {
    c.dy = reverseY(c);
  }
  c.x = c.x + c.dx;
  c.y = c.y + c.dy;
  return c;
};

var drawRect = function (ctx, x, y, w, h) {
  ctx.fillStyle = "rgb(200, 200, 100)";
  ctx.fillRect(x, y, w, h);
};

var clear = function (ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

// FIXME: add ball
var drawGame = function (ctx, gameData) {
  var brickList = gameData.bricks,
      paddle = gameData.paddle,
      ball = gameData.ball,
      i;

  /* draw the bricks */
  for (i=0; i<brickList.length; i++) {
    drawRect(ctx, brickList[i].x, brickList[i].y, brickList[i].w, brickList[i].h);
  }
  
  /* draw the paddle */
  drawRect(ctx, paddle.x, paddle.y, paddle.w, paddle.h);

  /* draw the ball */
  drawRect(ctx, ball.x, ball.y, ball.w, ball.h);
};

var gameBricks = [
/* row 1 */
  [SPACING * 1 + BRICK_WIDTH * 0, SPACING * 1 + BRICK_HEIGHT * 0],
  [SPACING * 2 + BRICK_WIDTH * 1, SPACING * 1 + BRICK_HEIGHT * 0],
  [SPACING * 3 + BRICK_WIDTH * 2, SPACING * 1 + BRICK_HEIGHT * 0],
  [SPACING * 4 + BRICK_WIDTH * 3, SPACING * 1 + BRICK_HEIGHT * 0],
  [SPACING * 5 + BRICK_WIDTH * 4, SPACING * 1 + BRICK_HEIGHT * 0],
/* row 2 */
  [SPACING * 1 + BRICK_WIDTH * 0, SPACING * 2 + BRICK_HEIGHT * 1],
  [SPACING * 2 + BRICK_WIDTH * 1, SPACING * 2 + BRICK_HEIGHT * 1],
  [SPACING * 3 + BRICK_WIDTH * 2, SPACING * 2 + BRICK_HEIGHT * 1],
  [SPACING * 4 + BRICK_WIDTH * 3, SPACING * 2 + BRICK_HEIGHT * 1],
  [SPACING * 5 + BRICK_WIDTH * 4, SPACING * 2 + BRICK_HEIGHT * 1],
/* row 3 */
  [SPACING * 1 + BRICK_WIDTH * 0, SPACING * 3 + BRICK_HEIGHT * 2],
  [SPACING * 2 + BRICK_WIDTH * 1, SPACING * 3 + BRICK_HEIGHT * 2],
  [SPACING * 3 + BRICK_WIDTH * 2, SPACING * 3 + BRICK_HEIGHT * 2],
  [SPACING * 4 + BRICK_WIDTH * 3, SPACING * 3 + BRICK_HEIGHT * 2],
  [SPACING * 5 + BRICK_WIDTH * 4, SPACING * 3 + BRICK_HEIGHT * 2]
];

var createBricks = function (brickData) {
  var i, list = [];
  for (i=0; i<brickData.length; i++) {
    var r = new Rect(brickData[i][0], brickData[i][1]);
    list.push(r);
  }
  return list;
};

var mouseDown = false;

window.onmousedown = function (e) {
  mouseDown = true;
};

window.onmouseup = function (e) {
  mouseDown = false;
};

window.onmousemove = function (e) {
  if (mouseDown) {
    var game = document.getElementById('game');
    // If we are outside the canvas
    if (e.srcElement == document.body) {
      // To the left
      if (e.offsetX <= game.offsetLeft) {
        // Put the paddle at the far left
        game.paddle.x = 0;
      }
      // To the right
      else if (e.offsetX > game.offsetLeft + window.Breakout.WIDTH - game.paddle.w) {
        // Put the paddle on the far right
        game.paddle.x = Breakout.WIDTH - game.paddle.w;
      }
    }
    // We are in the canvas
    else if (e.offsetX >= window.Breakout.WIDTH - game.paddle.w) {
      game.paddle.x = window.Breakout.WIDTH - game.paddle.w;
    }
    else {
      // Follow the mouse
      game.paddle.x = e.offsetX;
    }
  }
};

var setUp = function () {
  game.bricks = createBricks(gameBricks);
  game.paddle = new Rect(0, 460, PADDLE_WIDTH, PADDLE_HEIGHT);
  game.ball = new Rect(50, 50, BALL_WIDTH, BALL_HEIGHT);
  game.ball.dx = 7;
  game.ball.dy = 5;
};

var gameLoop = function () {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var i;
  clear(ctx);
  game.ball = updateBall(game.ball);
  // Check collision with all the bricks
  for (i=0; i<game.bricks.length; i++) {
    if (rectIntersect(game.bricks[i], game.ball)) {
      game.bricks.splice(i, 1);
      game.ball.dy = reverseY(game.ball);
    }
  }
  // Check paddle collision
  if (rectIntersect(game.paddle, game.ball)) {
    game.ball.dy = reverseY(game.ball);
  }
  drawGame(ctx, game);
};

setUp();
setInterval(gameLoop, 30);

//var rect = new Rect(SPACING, SPACING);
//var rect2 = new Rect(rect.x + rect.w + SPACING, SPACING);
//var rect3 = new Rect(rect2.x + rect2.w + SPACING, SPACING);
//var rect4 = new Rect(rect3.x + rect3.w + SPACING, SPACING);
//var rect5 = new Rect(rect4.x + rect4.w + SPACING, SPACING);
//
//drawRect(ctx, rect.x, rect.y, rect.w, rect.h);
//drawRect(ctx, rect2.x, rect2.y, rect2.w, rect2.h);
//drawRect(ctx, rect3.x, rect3.y, rect3.w, rect3.h);
//drawRect(ctx, rect4.x, rect4.y, rect4.w, rect4.h);
//drawRect(ctx, rect5.x, rect5.y, rect5.w, rect5.h);
