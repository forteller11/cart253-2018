// Ball
//
// A class to define how a ball behaves. Including bouncing on the top
// and bottom edges of the canvas, going off the left and right sides,
// and bouncing off paddles.

// Ball constructor
//
// Sets the properties with the provided arguments
function Ball(size,speed) {
  this.x;
  this.y;
  this.vx;
  this.vy;
  this.size = size;
  this.speed = speed;
  this.reset(0); //random xvec towards random side
}

// update()
//
// Moves according to velocity, constrains y to be on screen,
// checks for bouncing on upper or lower edgs, checks for going
// off left or right side.
Ball.prototype.update = function () { //NEW spelled "function" and update correctly
  // Update position with velocity
  this.x += this.vx; //New made velocity add to position
  this.y += this.vy;

  // Constrain y position to be on screen
  this.y = constrain(this.y,0,height-this.size);

  // Check for touching upper or lower edge and reverse velocity if so
  if (this.y === 0 || this.y + this.size === height) { //NEW replaced "=" with "==="
    this.vy = -this.vy;
  }
}

// isOffScreen()
//
// Checks if the ball has moved off the screen and, if so, returns true.
// Otherwise it returns false.
Ball.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0) { //NEW spelled "if" statement correctly, changed && to ||
    this.reset(1);
  } else if (this.x > width) {
    this.reset(-1);
  }
}

// display()
//
// Draw the ball as a rectangle on the screen
Ball.prototype.display = function () {
  rect(this.x,this.y,this.size,this.size); //NEW added appropriate paramters for rect function
}

// handleCollision(paddle)
//
// Check if this ball overlaps the paddle passed as an argument
// and if so reverse x velocity to bounce
Ball.prototype.handleCollision = function(paddle) { //NEW removed extra brackets, NEW spelt protoype correctly
  // Check if the ball overlaps the paddle on x axis
  if (this.x + this.size > paddle.x && this.x < paddle.x + paddle.w) {
    // Check if the ball overlaps the paddle on y axis
    if (this.y + this.size > paddle.y && this.y < paddle.y + paddle.h) {
      // If so, move ball back to previous position (by subtracting current velocity)
      this.x -= this.vx;
      this.y -= this.vy;
      // Reverse x velocity to bounce
      this.vx = -this.vx; //NEW actually reversed x velocity on "bounce"
    }
  }
}

// reset()
//
// Set position back to the middle of the screen
Ball.prototype.reset = function (dir) { //NEW properly named reset function
  this.x = width/2;
  this.y = height/2;
  if (dir > 0) { //if dir is pos then travel towards travel
      this.vx = random(2,this.speed);
  } else if (dir<0) { //if dir is neg then travel towards left
    this.vx = random(-this.speed,-2);
  } else { //if dir === 0 then xvel goes towards random side
    this.vx = random(2,this.speed);
    if (random(1) > .5){
      this.vx *= -1;
    }
  }
  this.vy = random(-this.speed,this.speed);
}
