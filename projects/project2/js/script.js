/*****************

Exercise 5
Charly Yan Miller
a game of 2 dimensional pong, with extra visual flourish and pre ES6 obj-oriented programming.

Objects:
I used pre ES6 object-oriented paradigms/syntax

Collsiion changes:
made collsions more robust --> now collisions are independant of paddle-side (left or right),
now paddles know from which direction a collision happened and can push balls into their
own court with the back of thier paddle (before collisions with back of the paddle did not behave realistically)
now balls MORE realistically collide with the tops and bottoms of paddles

Visual Changes:
- gave the fill of paddles a new animation (now it's size continually decreases instead of the opacity slowly fading out)
now the fill of paddles actually reflects the force o collision with a ball.
On collision w/ball the stroke of the paddle increases based on the force of collision

- new ball animations: breifly increase the size of ball on collision w/paddle
 decreases size of ball on collison w/ceiling/floor
ball trails now taper slighly

- now the pitch that is added to the ambientOsccilator on collisions changes
 with the force of said collison


Credits:
used p5.js references to setup the oscillator p5.sound objects
******************/

let padR; //right paddle
let padL; //let paddle
let horzPaddleIndent = 32; //indent of paddle
let minStrokeWidth = 3;
let maxStrokeWidth = 6;
let ball;
let oscAmbience; //sin wave oscillator
let oscAmbienceFreq = 250; //increases frequency of oscillator on collisions and scores
let shape = [];
let bulb = [];
let debugDisplay = false;
let covers = [];
// let canvasShape;

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

  // //shape
  // for (let i = 0; i < 1; i ++){
  //   covers[i] = new Shape(0, 0, 0, 4);
  //   shape.push(covers[i]);
  //   for (let j = 0; j < covers.vertNumber; j++) { //set pos of vertexes
  //     covers[i].vertR[j] = this.radius+2;
  //     covers[i].vertAOff[j] = (TWO_PI/covers.vertNumber*j) + QUARTER_PI +random(-0.0001,0.0001);
  //   }
  //   covers[i].update();
  //   covers[i].display();
  // }

  //oscillator which increases frequency on scores and collisions
  oscAmbience = new p5.Oscillator();
  oscAmbience.setType('sin');
  oscAmbience.freq(oscAmbienceFreq);
  oscAmbience.amp(1);
  oscAmbience.start();

  print(shape);

  //light
  for (let i = 0; i < 1; i ++){
    bulb[i] = new Bulb(255,255,0,255,10,15);
  }
}

function draw() {
  background(0);
  // canvasShape.x = width/2;
  // canvasShape.y = height/2;
  // canvasShape.update();
  // canvasShape.display();

  padR.flashOnScore();
  padL.flashOnScore();

  centerLineDisplay(); //draw dotted line down center of screen;
  padR.update();
  padL.update();

  //deal with Ball
  ball.update();

  //shape
  for (let i = 0; i < shape.length; i ++){
    // for (let j = 0; j < covers.vertNumber; j++) { //set pos of vertexes
    //   covers[i].vertR[j] = this.radius+2;
    //   covers[i].vertAOff[j] = (TWO_PI/covers.vertNumber*j) + QUARTER_PI +random(-0.0001,0.0001);
    // }
    shape[i].update();
    // shape[i].display();
  }

  //sound
  oscAmbienceFreq *= .98;
  oscAmbienceFreq = constrain(oscAmbienceFreq, 75, 200);
  oscAmbience.freq(oscAmbienceFreq);

  for (let i = 0; i < bulb.length; i ++){
    bulb[i].x = width/2;
    bulb[i].y = height/2;
    bulb[i].update();
  }

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
