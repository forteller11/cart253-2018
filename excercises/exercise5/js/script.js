/*****************

Exercise 5
Charly Yan Miller
a game of 2 dimensional pong, with sound!

Challenge 1: method canvasCollision in Ball class deals with updating score
or ball's position and velocity on collision with canvas

Challenge 2: displayScore method in the Paddle class displays the paddles' score
as dotted lines (in the paddle's colour) travelling down the screen (wrapping on
overflow of the canvas)

Challenge 3: the reset method in the ball Class resets the ball's position and sets
a random xvel and yvel directed towards the paddle which most recently won.

Challenge 4: embelished the game visually in a variety of ways: each paddle has its own colour
the ball flashes white on collision b4 becoming the colour of the paddle it most recently
collided with, it also displays a short trail... added sound w/osscilators

Optional Challenges:
added a second dimension,
changed ball's velocity based on the relative AND objective position and velocity of the Paddle
made the balls velocity push the paddle subtly


Credits:
used p5.js references to setup the oscillator p5.sound objects
******************/
let fluidPop = 20;
let fluid = [];
let fluidDisplayThreshold = 1;
let padR; //right paddle
let padL; //let paddle
let horzPaddleIndent = 32; //indent of paddle
let minStrokeWidth = 3;
let maxStrokeWidth = 6;
let ball;
let oscAmbience; //sin wave oscillator
let oscAmbienceFreq = 250; //increases frequency of oscillator on collisions and scores

let oscAdrenaline; //increases freq based on net speed of paddles
let oscAdrenalineFreq = 80; //sets frequency of osilator
let oscAdrenalineAmp = 0.1; //sets frequency of osilator

function setup() {
  createCanvas(800, 800);
  //intiialize right paddle with appropriate key codes and r,g,b values
  padR = new Paddle(38, 40, 37, 39, 77, 232, 97, 76);
  //set appropriate position, give paddle a full fluid-meter and set velocity to 0
  padRReset();

  //intiialize left paddle with corresponding key codes and rgb color values
  padL = new Paddle(87, 83, 65, 68, 69, 80, 164, 229);
  //set appropriate position, give paddle a full fluid-meter and set velocity to 0
  padLReset();

  //intiialize left paddle with corresponding key codes and rgb color values
  ball = new Ball();
  //resets ball pos, color and velocities
  let direction;
  if (random(1) > .5) {
    direction = 1;
  } else {
    direction = -1;
  }
  ball.reset(direction);

  //oscillator which increases frequency on scores and collisions
  oscAmbience = new p5.Oscillator();
  oscAmbience.setType('sin');
  oscAmbience.freq(oscAmbienceFreq);
  oscAmbience.amp(1);
  oscAmbience.start();

  //increases freq and amplitude with paddle speed
  oscAdrenaline = new p5.Oscillator();
  oscAdrenaline.setType('sawtooth');
  oscAdrenaline.freq(oscAdrenalineFreq);
  oscAdrenaline.amp(0);
  oscAdrenaline.start();

}

function draw() {
  background(0);

  //for paddles...
  //move and deal with inputs
  padR.checkBallCollision();
  padL.checkBallCollision();
  padR.accelerate();
  padL.accelerate();
  padR.changePos();
  padL.changePos();
  //display
  padR.flashOnScore(); //fashes screen red/blue on score
  padL.flashOnScore();
  padR.decrHit(); //fashes screen red/blue on score
  padL.decrHit();
  centerLineDisplay(); //draw dotted line down center of screen;
  padR.displayScore(); //dispalys player score
  padL.displayScore();
  padR.displayfillMeter();
  padL.displayfillMeter();
  padR.displayPaddle();
  padL.displayPaddle();
  //changes frequency and amp based of oscillator based off net velocities of paddles
  oscAdrenalineFreq = 1.5 * (abs(padL.velX) + abs(padL.velY) + abs(padR.velX) + abs(padR.velY) + 20);
  oscAdrenalineAmp = .005 * (abs(padL.velX) + abs(padL.velY) + abs(padR.velX) + abs(padR.velY) + abs(ball.velX) + abs(ball.velY));
  oscAdrenaline.amp(oscAdrenalineAmp);
  oscAdrenaline.freq(oscAdrenalineFreq);
  if (oscAmbienceFreq > 75) {
    oscAmbienceFreq *= .98;
  }
  //changes frequency and amp of ossillator
  oscAmbience.freq(oscAmbienceFreq);

  //deal with Ball
  ball.changePosition();
  ball.displayTrail();
  ball.display();
  ball.decrHit();

}

function padRReset() {
  padR.x = width - horzPaddleIndent;
  padR.y = height / 2;
  padR.velX = 0;
  padR.velY = 0;
}

function padLReset() {
  padL.x = horzPaddleIndent;
  padL.y = height / 2;
  padL.velX = 0;
  padL.velY = 0;
}

function centerLineDisplay() {
  //draws dotted line down center of screen
  let xx = width / 2;
  let lineAmount = 40;
  let lineH = height / lineAmount;
  stroke(100);
  strokeWeight(2);
  for (i = 0; i < (lineAmount / 2); i++) {
    let y1 = ((lineH * i) * 2) + (lineH / 2); //
    let y2 = y1 + lineH;
    line(xx, y1, xx, y2);
  }
}
