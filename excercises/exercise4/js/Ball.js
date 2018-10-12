class Ball {
  constructor(){
  this.x;
  this.y;
  this.xHist = []; //history of x positions
  this.yHist = []; //history of y positions
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
    this.checkCanvasCollision();
    //check for collisions
  }

  reset(){
    //resets pos and velocity of ball
      this.x = width/2;
      this.y = height/2+(random(-width/3,width/3));
      this.velX = random(-8,-4);
      this.velY = random(-2,2);
  }

  display(){
    rectMode(RADIUS);
    noStroke();
    fill(this.r,this.g,this.b);
    rect(this.x,this.y,this.radius,this.radius);
    //ellipse(this.x,this.y,this.radius,this.radius);
  }

  checkCanvasCollision(){
    //if ball goes off left then rightpaddle score increases
    if  (this.x+(this.radius*4) < 0){
      padR.score ++;
      this.reset();
    }
    //if ball goes off right then leftpaddle score increases
    if (this.x-(this.radius*4) > width){
      padL.score ++;
      this.reset();
    }

    if ((this.y+this.radius > height) || (this.y-this.radius < 0)){
      this.x = constrain(this.x,0,height);
      this.velY = this.velY*-1;
    }
  }

}
