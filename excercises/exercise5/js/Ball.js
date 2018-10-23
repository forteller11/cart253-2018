function Ball() {
  this.x;
  this.y;
  this.xHist = []; //history of x positions
  this.yHist = []; //history of y positions
  this.trailLength = 12;
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
}

Ball.prototype.changePosition = function() {
  this.x += this.velX;
  this.y += this.velY;
  this.canvasCollision(); //has the ball collided with the canvas?
  this.addToHistory(this.x, this.y); //store balls postional history for trail drawing

  this.velX = constrain(this.velX, -this.maxVelX, this.maxVelX);

}

Ball.prototype.addToHistory = function(x, y) { //remove oldest ball postion history, add newest ball position history
  this.xHist.splice(0, 1);
  this.yHist.splice(0, 1);

  this.xHist.push(this.x);
  this.yHist.push(this.y);
}

Ball.prototype.reset = function(xDirection) {
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

////////////NEW (now ball increases/decrease size on collsion)
Ball.prototype.display = function() {
  rectMode(RADIUS);
  noStroke();
  //draw coloured ball
  fill(this.r, this.g, this.b);
  //dynamicRadius can change and enlarge if the ball was recently hit
  let dynamicRadius = this.radius*this.sizeFlash;
  rect(this.x, this.y, dynamicRadius,dynamicRadius);
  //draw a white ball which obscures the undlying colored one depending on this.hit
  fill(255, 255, 255, (this.whiteFlash*1) * 255);
  rect(this.x, this.y, dynamicRadius,dynamicRadius);
  //ellipse(this.x,this.y,this.radius,this.radius);
}

//////NEW (now ball trail is tapered)
Ball.prototype.displayTrail = function() { //draw trail of ball's histories
  rectMode(RADIUS);
  noStroke();

  for (let i = 0; i < this.xHist.length; i++) {
    //trail increases alpha based on balls speed,
    //alpha is greatest near the current position of the ball, then it fades to 0
    velocityMagnitude = sqrt(sq(this.velX) + sq(this.velY));
    //increase alpha of trail if it is closer in history to the current ball pos,
    //and if the ball is currently travleing faster
    let trailAlpha = (i/this.trailLength)*10*velocityMagnitude;
    fill(this.r, this.g, this.b, trailAlpha);
    let rad = (this.radius * i) / this.xHist.length; //fades radius to 0 at the end of the for Loop
    let rad2 = map(rad, 0, this.radius, this.radius * 0.6, this.radius)*this.sizeFlash; //setting min radius of trail to 60%
    rect(this.xHist[i], this.yHist[i], rad2, rad2); //drawing trail
  }

}

Ball.prototype.canvasCollision = function() {
  //if ball goes off left then rightpaddle score increases
  if (this.x + (this.radius * 4) < 0) {
    padR.score++;
    padR.scored = .5;
    padR.hit = 1; //fill the scoring paddle with colour
    this.reset(1);
    oscAmbienceFreq += 70; //increases frequency of oscillator

  }
  //if ball goes off right then leftpaddle score increases
  if (this.x - (this.radius * 4) > width) {
    padL.score++;
    padL.scored = .5;
    padL.hit = 1; //fill the scoring paddle with colour
    this.reset(-1);
    oscAmbienceFreq += 70;

  }

  /////////NEWWW now ball makes dynamic change to oscillator on collison w/ceiling/floor, and shrinks
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
Ball.prototype.decrementFlashVars = function() { //decrements this.hit var
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
