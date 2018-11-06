/*****************

Project 2
Charly Yan Miller
a game of 2 dimensional pong -- and some lights.

Overview of Design:
In many ways this project is simply an aesthetic change (upgrade?) to exercise 5 which was
a game of 2D PONG where the velocity of the ball as result of a collision with a paddle depended on
the current paddle velocity and how close to the center of the screen the paddle was
on collision.
Originally light had a more mechanical rather than aesthetic role to play, I was
thinking players would be able to manipulate lights by hitting switches with balls
or their own bodie, and also lights would have fall-off and therefore when
the ball wasn't near any light-sources the ball would be effectively invisble and players would
have to keep track of the balls velocity mentally...
However in the final version due to programmatic shortcomings lights have come to play
a princpally aesthetic role in the game. At the start of the game there are 6 light-sources "Bulbs"
and every time a player scores the lights change colours and a light turns off,
once there is only one light the score turns all the lights back on, and changes
the way they move about the canvas.

Overview of Code:
Basically there are two types of objects with deal with lights, there is the Shape
and Line class who serve to act as obstacles for light to be blocked by and cause shadows.
Then there are the Ray, Light and Bulb class who cast out "rays" in all directions
and are interupted by the Shape/Line classes...
Shape/Line:
The shape class's job is to store and move a set of points, it then creates instances
of the Line class which are each asigned two of these points so that the lines form
an enclosed shape around the verts.
Ray/Light/Bulb:
the Ray is a infinite line that checks collision with all lines in the scene and stores
the nearest collision.
the Light class is responsible for creating a ray pointed in at every vert in the scene,
updating the rays, sorting the rays according to their angle, and then drawing a
line between the nearest collision point of every ray and filling this area in, effectively
creating a single light-source.
the Bulb class stores several lights evenly spread out around its x/y position, the
Bulb class's purpose is to create soft shadows.

Script Overview:



Credits:
Used developer Nick Liow's toturial on 2D ray casting/lighting "Sight and Light"
almost all the ideas of how to create 2D lighting system were taken from this toturial,
actual code-level implementation details were not used.
https://ncase.me/sight-and-light/
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
let bulbPop = 6;
const debugDisplay = false;
let covers = [];
let theta = 0;
let lightColorR = 0;
let lightColorG = 0;
let lightColorB = 0;
let netScore = 0;
let startScreen = true;
//imgs
let imgTitle;
let imgBorder1;
let imgBorder2;
let imgBorder3;
let imgBorder4;
let imgVignette;

function preload() {
  imgTitle = loadImage('images/title.png');
  imgVignette = loadImage('images/vignette.png');
}

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

  //create Bulbs (with lights, rays, childRays), randomly set the bulb's movetype
  let moveType = round(random(6));
  for (let i = 0; i < bulbPop; i++) {
    bulb[i] = new Bulb(lightColorR, lightColorG, lightColorB, 255 / (bulbPop), 10, 50, moveType);
    bulb[i].x = (width / bulbPop) * (i + .5);
  }

  // initialize oscillator which increases frequency on scores and collisions
  oscAmbience = new p5.Oscillator();
  oscAmbience.setType('sin');
  oscAmbience.freq(0);
  oscAmbience.amp(0);
  oscAmbience.start();
}

function draw() {
  if (keyIsPressed && (startScreen = true)) { //allows start screen to be bypassed
    startScreen = false;
    oscAmbience.freq(oscAmbienceFreq);
  }
  if (startScreen === true) { //start-screen...
    background(21);
    image(imgTitle, 0, 0);
  } else { //post start-screen
    background(51);
    if (netScore === 0) {
      let lightIncrement = 8;
      lightColorR += lightIncrement;
      lightColorG += lightIncrement;
      lightColorB += lightIncrement;
    }

    //update paddle/ball
    padR.flashOnScore();
    padL.flashOnScore();
    padR.update();
    padL.update();
    ball.update();

    //shape
    for (let i = 0; i < shape.length; i++) {
      shape[i].update();
    }

    //make bulb color the global light color, update and display bulbs
    for (let i = 0; i < bulb.length; i++) {
      bulb[i].r = lightColorR;
      bulb[i].g = lightColorG;
      bulb[i].b = lightColorB;
      bulb[i].update();
      //the bulbs display will be obscured by the displayFIll of the light class,
      //however this is intentional and creates aless even, ore organic look
      bulb[i].display();
    }

    ball.displayTrail(); //displays a trail behind the ball
    centerLineDisplay(); //draw dotted line down center of screen;
    padL.displayScore(); //displays paddle's score as dotted lines
    padR.displayScore();

    //sound, increases pitch on ball collisions
    oscAmbienceFreq *= .98;
    oscAmbienceFreq = constrain(oscAmbienceFreq, 100, 200);
    oscAmbience.amp(1);
    oscAmbience.freq(oscAmbienceFreq);

    //display vignette (200x200 for performance, scaled to canvas-size)
    image(imgVignette, 0, 0, width, height);
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
//randomizes global color of lights by randomly choosing from a 10 color pallettes
function lightColorRandomize() {
  let r = random(1);
  let rThreshold = 0;
  let rThresholdIncrement = 0.1;
  if (r >= rThreshold) { //purple
    lightColorR = 190;
    lightColorG = 170;
    lightColorB = 255;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //cyan
    lightColorR = 120;
    lightColorG = 255;
    lightColorB = 255;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //green
    lightColorR = 150;
    lightColorG = 255;
    lightColorB = 200;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //lime 5
    lightColorR = 200;
    lightColorG = 255;
    lightColorB = 65;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //pale yellow
    lightColorR = 230;
    lightColorG = 255;
    lightColorB = 135;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //hard yellow
    lightColorR = 255;
    lightColorG = 235;
    lightColorB = 60;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //orange
    lightColorR = 255;
    lightColorG = 181;
    lightColorB = 80;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //red
    lightColorR = 255;
    lightColorG = 80;
    lightColorB = 80;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //magenta
    lightColorR = 255;
    lightColorG = 105;
    lightColorB = 207;
    rThreshold += rThresholdIncrement;
  }
  if (r >= rThreshold) { //blue
    lightColorR = 90;
    lightColorG = 205;
    lightColorB = 255;
    rThreshold += rThresholdIncrement;
  }

}

function centerLineDisplay() {
  //draws dotted line down center of screen
  let xx = width / 2;
  let lineAmount = 40;
  let lineH = height / lineAmount;
  stroke(random(25), random(25), random(25), 50);
  strokeWeight(3);
  for (let i = 0; i < (lineAmount / 2); i++) {
    let y1 = ((lineH * i) * 2) + (lineH / 2); //
    let y2 = y1 + lineH;
    line(xx, y1, xx, y2);
  }
}
