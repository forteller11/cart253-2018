class Paddle{
  constructor(upKey,downKey,leftKey,rightKey,fluidKey,r,g,b){
    //stores key codes to move and shoot fluid from the paddle
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.fluidKey = fluidKey; //key which shoots fluid
    this.r = r;
    this.g = g;
    this.b = b;
    this.padLeft; //is this the left paddle?

    this.x;
    this.y;
    this.acc = 2.5;
    this.velX = 0; //velocity
    this.velY = 0; //velocity
    this.maxVel = 6;
    this.drag = 1.8;
    this.width = 16;
    this.height = 100;
    this.fluidMeter = 1; //how much fluid can this paddle produce? (0-1)
    this.strokeWeight = 4;
  }
  displayFluidMeter(){
    //fills in the paddle repsenting how much fluidMeter the paddle has;
    let w = this.width/2;
    let h = this.height/2;
    let x1 = -w +this.x;
    let x2 = w+this.x;
    let y1 = -h+this.y; //top of paddle
    let y2 = h+this.y; //bottom of paddle
    //map the 0-1 value of the fluidMeter to the bottom and top of the paddle;
    let y1Dynamic = map(this.fluidMeter,0,1,y2,y1);

    rectMode(CORNERS);
    noStroke();
    fill(this.r,this.g,this.b);
    rect(x1,y2,x2,y1Dynamic);
  }

  displayPaddle(){
    //draw paddle with width and color
    strokeWeight(this.strokeWeight);
    let w = this.width/2;
    let h = this.height/2;
    let x1 = -w+this.x;
    let x2 = w+this.x;
    let y1 = -h+this.y;
    let y2 = h+this.y;
    stroke(255);
    line(x1,y1,x2,y1);
    line(x2,y1,x2,y2);
    line(x2,y2,x1,y2);
    line(x1,y2,x1,y1);

  }

  accelerate(){
    //check for inputs and change velocity accordingly
    if ( (keyIsDown(this.upKey)) ||
    (keyIsDown(this.downKey)) ||
    (keyIsDown(this.rightKey)) ||
    (keyIsDown(this.leftKey)) )
    {
      if (keyIsDown(this.upKey)) {
        this.velY -= this.acc;
      }
      if (keyIsDown(this.downKey)) {
        this.velY += this.acc;
      }
      if (keyIsDown(this.leftKey)) {
        this.velX -= this.acc;
      }
      if (keyIsDown(this.rightKey)) {
        this.velX += this.acc;
      }
      //here i apply drag so that the player seems to accelerate more at lower speeds,
      //and less quickly at higher speeds --> creates for a nice ramp of acceleration which feels better
      this.velX = this.velX/(this.drag/1.4);
      this.velY = this.velY/(this.drag/1.4);
  }
  //if not currently accelerate apply more drag so that the player
  //does not seem "floaty" and stops rather quickly
  else {
    //apply drag
    this.velX = this.velX/this.drag;
    this.velY = this.velY/this.drag;

  }

    //constrain velocities
    this.velX = constrain(this.velX,-this.maxVel,this.maxVel);
    this.velY = constrain(this.velY,-this.maxVel,this.maxVel);
  }

  changePos(){ //changes position based on velocity
    //adds velocity to position
    this.x+=this.velX;
    this.y+=this.velY;

    let w = (this.width/2)+this.strokeWeight/2;
    let h = (this.height/2)+this.strokeWeight/2;

    //constrain x positions based on if the paddle is left or right, constrains y pos identically
    if (this.padLeft === true){ //if right paddle
      this.x = constrain(this.x,(width/2)+w,width-w);
    }
    else{
      this.x = constrain(this.x,w,(width/2)-w);
    }
      this.y = constrain(this.y,h,height-h);

  }
}
