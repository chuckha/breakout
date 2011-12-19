entity
  attach component
  detach component

component
  startup
  update
  shutdown


BREAKOUT
========
Paddle Entity
  - Input Component
  - Graphics Component
  - Physics Component



Components
==========
Input:
/* expects
 * velocity
 */
  reference to entity
PaddleInput:
  on keydown left (velocity)
  on keydown right (velocity)move ri
  on keyup left stop move left
  on keyup right stop move right

Graphics:
/* expects
 *  w (width)
 *  h (height)
 *  x (x-coordinate position)
 *  y (y-coordinate position)
 */
  reference to entity
PaddleGraphics:
  update rect (x, y, w, h)
BallGraphics:
  update circ (x, y, r)
BrickGraphics:
  update rect (x, y, w, h)

Physics:
/* expects
 * x 
 * y
 * velocity
 */
  reference to entity
PaddlePhysics:
  update (x, y, velocity)
BallPhysics:
  update (x, y, veolocity)

