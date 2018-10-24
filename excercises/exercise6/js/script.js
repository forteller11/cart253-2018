/*

Exercise 6
Charly Yan Miller
fixed(ish?) PONG


*/

// Variable to contain the objects representing our ball and paddles
var bal;
var leftPaddle;
var rightPaddle;

// setup()
//
// Creates the ball and paddles
function setup() {
  createCanvas(640,480); //NEW fixed so that createCanvas function is called
  noStroke();
  // Create a ball
  ball = new Ball(10,5);
  // Create the right paddle with UP and DOWN as controls
  //NEW set a more reasonable this.w value, reversed upKey/downKey paramters
  rightPaddle = new Paddle(width-10,height/2,10,60,10,DOWN_ARROW,UP_ARROW);
  // Create the left paddle with W and S as controls
  // Keycodes 83 and 87 are W and S respectively
  //////////New closed brackets on constructor, reversed upKey/downKey parameters.
  leftPaddle = new Paddle(0,height/2,10,60,10,83,87);

} /////////NEW closed curly brackets of setup(){} function

// draw()
//
// Handles input, updates all the elements, checks for collisions
// and displays everything.
function draw() {
  background(0);

  leftPaddle.handleInput();
  rightPaddle.handleInput();

  ball.update();
  leftPaddle.update();
  rightPaddle.update();

  ball.isOffScreen();

  ball.handleCollision(leftPaddle);
  ball.handleCollision(rightPaddle);

  ball.display();
  leftPaddle.display();
  rightPaddle.display(); //NEW closed paramters of display method
}
