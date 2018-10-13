class Ball {
  constructor(){
  this.x;
  this.y;
  this.xHist = []; //history of x positions
  this.yHist = []; //history of y positions
  this.trailLength = 8;
  this.maxVelX = 19;
  this.velX = 0;
  this.velY = 0;
  this.radius = 8;
  //rgb values
  this.r = 255;
  this.g = 255;
  this.b = 255;
  this.timer = 0;
  }

  changePosition(){
    this.x += this.velX;
    this.y += this.velY;
    this.canvasCollision(); //has the ball collided with the canvas?
    this.addToHistory(this.x,this.y); //store balls postional history for trail drawing

    this.velX = constrain(this.velX,-this.maxVelX,this.maxVelX);

  }

  addToHistory(x,y){ //remove oldest ball postion history, add newest ball position history
    this.xHist.splice(0,1);
    this.yHist.splice(0,1);

    this.xHist.push(this.x);
    this.yHist.push(this.y);
  }

  reset(xDirection){
    //resets pos, color and velocity of ball
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.x = width/2;
    this.y = height/2+(random(-width/3,width/3));
    //x direction is either 1 or -1 depending on which paddle won
    this.velX = random(2,3)*xDirection;
    this.velY = random(-2,2);

    //fill array at start of game to trailLength
    for (let i = 0; i < this.trailLength; i++){
      this.xHist[i] = this.x;
      this.yHist[i] = this.y;

      this.xHist[i] = this.x;
      this.yHist[i] = this.y;
    }
  }

  display(){
    rectMode(RADIUS);
    noStroke();
    fill(this.r,this.g,this.b);
    rect(this.x,this.y,this.radius,this.radius);
    //ellipse(this.x,this.y,this.radius,this.radius);
  }

  displayTrail(){ //draw trail of ball's histories
    rectMode(RADIUS);
    noStroke();
    for (let i = 0; i < this.xHist.length; i ++){
      //trail increases alpha based on balls speed,
      //alpha is greatest near the current position of the ball, then it fades to 0
      fill(this.r,this.g,this.b,i*(abs((ball.velX+ball.velY)*15)/this.trailLength));
      rect(this.xHist[i],this.yHist[i],this.radius,this.radius);
    }
    //ellipse(this.x,this.y,this.radius,this.radius);
  }

  canvasCollision(){
    //if ball goes off left then rightpaddle score increases
    if  (this.x+(this.radius*4) < 0){
      padR.score ++;
      this.reset(1);
    }
    //if ball goes off right then leftpaddle score increases
    if (this.x-(this.radius*4) > width){
      padL.score ++;
      this.reset(-1);
    }

    if ((this.y+this.radius > height) || (this.y-this.radius < 0)){
      this.x = constrain(this.x,0,height);
      this.velY = this.velY*-1;
    }
  }

}
