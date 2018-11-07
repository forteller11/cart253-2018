/*
has stwo shape classes, one whose verts = the 4 corners of the ball, the other whose
4 verts = the 4 corners of the canvas.
on every point the ball calls the this.score() function which dims a bulb in the scene,
randomizes the lights' colors, and changes the movementType of all bulbs every 6 points...
Besides that the ball class's code is fundementallythe same from exercise 5;
*/

class Ball {
  constructor() {
    this.x;
    this.y;
    this.xHist = []; //history of x positions
    this.yHist = []; //history of y positions
    this.trailLength = 20;
    this.maxVelX = 19;
    this.velX = 0;
    this.velY = 0;
    this.radius = 8;
    //rgb values
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.timer = 0;
    this.whiteFlash = 0; //determines whether the ball is white due to recent collision (0-1), 1 = 100% white
    this.sizeFlash = 1; //determines % graphical size of ellipse based relative to its radius (1 = 100%)

    let offset = 0.0001; //added to the angle offset of verts so no line ever has a slope of 0,Infinity or -Infinity

    //shape in the size of the ball
    this.shape = new Shape(this.x, this.y, 0, 4);
    shape.push(this.shape); //add to global shape array so shapes can updated at the same time
    for (let j = 0; j < this.shape.vertNumber; j++) { //set pos of vertexes
      this.shape.vertR[j] = this.radius + 2;
      this.shape.vertAOff[j] = (TWO_PI / this.shape.vertNumber * j) + QUARTER_PI + offset;
    }
    this.shape.update();
    this.shape.display();

    //shape in with the dimensions of the canvas
    this.canvasShape = new Shape(this.x, this.y, 0, 4);
    shape.push(this.canvasShape);//add to global shape array so shapes can updated at the same time
    for (let j = 0; j < this.shape.vertNumber; j++) { //set pos of vertexes
      this.canvasShape.vertR[j] = sqrt(sq(width / 2) + sq(height / 2));
      this.canvasShape.vertAOff[j] = (TWO_PI / this.canvasShape.vertNumber * j) + QUARTER_PI + offset;
    }

  }

  update() {

    this.changePosition();
    // this.updateOscillator();
    // this.displayTrail();
    // this.display();
    this.shape.x = this.x;
    this.shape.y = this.y;
    for (let j = 0; j < this.shape.vertNumber; j++) { //set pos of vertexes
      this.shape.vertR[j] = this.radius * this.sizeFlash;
    }




    this.decrementFlashVars();

    this.canvasShape.x = width / 2;
    this.canvasShape.y = height / 2;

  }
  changePosition() {
    this.x += this.velX;
    this.y += this.velY;
    this.canvasCollision(); //has the ball collided with the canvas?
    this.addToHistory(this.x, this.y); //store balls postional history for trail drawing

    this.velX = constrain(this.velX, -this.maxVelX, this.maxVelX);

  }

  addToHistory(x, y) { //remove oldest ball postion history, add newest ball position history
    this.xHist.splice(0, 1);
    this.yHist.splice(0, 1);

    this.xHist.push(this.x);
    this.yHist.push(this.y);
  }

  reset(xDirection) {
    //resets pos, color and velocity of ball
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.sizeFlash = .1;
    this.x = width / 2;
    this.y = height / 2 + (random(-width / 3, width / 3));
    //x direction is either 1 or -1 depending on which paddle won
    this.velX = random(2, 3) * xDirection;
    this.velY = random(-2, 2);

    //fill array at start of game to trailLength
    for (let i = 0; i < this.trailLength; i++) {
      this.xHist[i] = this.x;
      this.yHist[i] = this.y;

      this.xHist[i] = this.x;
      this.yHist[i] = this.y;
    }
  }

  display() {
    rectMode(RADIUS);
    noStroke();
    //draw coloured ball
    fill(this.r, this.g, this.b);
    //dynamicRadius can change and enlarge if the ball was recently hit
    let dynamicRadius = this.radius * this.sizeFlash;
    rect(this.x, this.y, dynamicRadius, dynamicRadius);
    //draw a white ball which obscures the undlying colored one depending on this.hit
    fill(255, 255, 255, (this.whiteFlash * 1) * 255);
    rect(this.x, this.y, dynamicRadius, dynamicRadius);
    //ellipse(this.x,this.y,this.radius,this.radius);
  }


  displayTrail() { //draw trail of ball's histories
    rectMode(RADIUS);
    noStroke();

    for (let i = 0; i < this.xHist.length; i++) {
      //trail increases alpha based on balls speed,
      //alpha is greatest near the current position of the ball, then it fades to 0
      let velocityMagnitude = sqrt(sq(this.velX) + sq(this.velY));
      //increase alpha of trail if it is closer in history to the current ball pos,
      //and if the ball is currently travleing faster
      let trailAlpha = (i / this.trailLength) * 10 * velocityMagnitude;
      fill(0,0,0, trailAlpha/6);
      let rad = (this.radius * i) / this.xHist.length; //fades radius to 0 at the end of the for Loop
      rect(this.xHist[i], this.yHist[i], rad-1, rad-1); //drawing trail
      rect(this.xHist[i], this.yHist[i], rad+0, rad+0); //drawing trail
      rect(this.xHist[i], this.yHist[i], rad+1, rad+1); //drawing trail
      rect(this.xHist[i], this.yHist[i], rad-2, rad-2); //drawing trail
      rect(this.xHist[i], this.yHist[i], rad-3, rad-3); //drawing trail
      rect(this.xHist[i], this.yHist[i], rad-4, rad-4); //drawing trail
    }

  }

  score(){
    if (netScore === bulbPop -1) {
      netScore = 0;
      //every point remove lapha of one light
      let moveType = round(random(6));
      for (let i = 0; i < bulb.length; i ++){
        bulb[i].alpha = 255/bulb.length;
        bulb[i].moveType = moveType;
      }
    }
    if (bulb.length > 1){
      bulb[netScore].alpha = 0;
    }
    netScore ++;
    lightColorRandomize();
  }
  canvasCollision() {

    //if ball goes off left then rightpaddle score increases
    if (this.x + (this.radius * 4) < 0) {
      padR.score++;
      this.score();
      padR.scored = .5;
      padR.hit = 1; //fill the scoring paddle with colour
      this.reset(1);
      oscAmbienceFreq += 70; //increases frequency of oscillator

    }
    //if ball goes off right then leftpaddle score increases
    if (this.x - (this.radius * 4) > width) {
      padL.score++;
      padL.scored = .5;
      this.score();
      padL.hit = 1; //fill the scoring paddle with colour
      this.reset(-1);
      oscAmbienceFreq += 70;


    }


    //if ball hits ceiling or floor of canvas
    if ((this.y + this.radius > height) || (this.y - this.radius < 0)) {
      this.y = constrain(this.y, this.radius, height - this.radius);
      this.velY = this.velY * -1;
      let changeInOscFreq = abs(ball.velY) * 10; //more change if the ball is traveling faster vertically
      oscAmbienceFreq += changeInOscFreq; //increases frequency of oscillator
      this.sizeFlash -= .3; //shrink the ball graphics on collison w/canvas ceiling/floor
    }
  }

  //////NEW return various graphic-related vars to given numbers
  decrementFlashVars() { //decrements this.hit var
    //this.hit is set to one on collison w/ball
    if (this.whiteFlash > 0) {
      this.whiteFlash -= 0.15;
    }
    if (this.sizeFlash > 1.1) {
      this.sizeFlash *= 0.96;
    }
    if (this.sizeFlash < .99) {
      this.sizeFlash *= 1.2;
    }
  }
}
