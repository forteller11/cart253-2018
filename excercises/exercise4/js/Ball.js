class Ball {
  constructor() {
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
    this.hit = 0;
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
    rect(this.x, this.y, this.radius, this.radius);
    //draw a white ball which obscures the undlying colored one depending on this.hit
    fill(255, 255, 255, this.hit * 255);
    rect(this.x, this.y, this.radius, this.radius);
    //ellipse(this.x,this.y,this.radius,this.radius);
  }

  displayTrail() { //draw trail of ball's histories
    rectMode(RADIUS);
    noStroke();
    for (let i = 0; i < this.xHist.length; i++) {
      //trail increases alpha based on balls speed,
      //alpha is greatest near the current position of the ball, then it fades to 0
      fill(this.r, this.g, this.b, i * (abs((ball.velX + ball.velY) * 15) / this.trailLength));
      let rad = (this.radius*i)/this.xHist.length; //fades radius to 0 at the end of the for Loop
      let rad2 = map(rad,0,this.radius,this.radius*0.6,this.radius); //setting min radius of trail to 60%
      rect(this.xHist[i], this.yHist[i], rad2, rad2);
    }
    //ellipse(this.x,this.y,this.radius,this.radius);
  }

  canvasCollision() {
    //if ball goes off left then rightpaddle score increases
    if (this.x + (this.radius * 4) < 0) {
      padR.score++;
      padR.scored = .5;
      padR.hit = 1; //fill the scoring paddle with colour
      this.reset(1);
      oscAmbienceFreq += 80; //increases frequency of oscillator

    }
    //if ball goes off right then leftpaddle score increases
    if (this.x - (this.radius * 4) > width) {
      padL.score++;
      padL.scored = .5;
      padL.hit = 1; //fill the scoring paddle with colour
      this.reset(-1);
      oscAmbienceFreq += 80;

    }
    //if ball hits ceiling or floor of canvas
    if ((this.y + this.radius > height) || (this.y - this.radius < 0)) {
      this.y = constrain(this.y, 0, height);
      this.velY = this.velY * -1;
      oscAmbienceFreq += 20; //increases frequency of oscillator
    }
  }

  decrHit() { //decrements this.hit var
    //this.hit is set to one on collison w/ball
    if (this.hit > 0) {
      this.hit -= 0.15;
    }
  }

}
