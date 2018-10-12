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
    this.score = 0;

    this.x;
    this.y;
    this.accX = 5;
    this.accY = 7;
    this.velX = 0; //velocity
    this.velY = 0; //velocity
    this.maxVelY = 14;
    this.maxVelX = 6;
    this.drag = 2.4;
    this.width = 16;
    this.height = 100;
    this.fluidMeter = 1; //how much fluid can this paddle produce? (0-1)
    this.strokeWeight = (minStrokeWidth+maxStrokeWidth)/2;
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

    let w = this.width/2;
    let h = this.height/2;
    let x1 = -w+this.x;
    let x2 = w+this.x;
    let y1 = -h+this.y;
    let y2 = h+this.y;
    stroke(255);
    //draw paddle with width and color, increase stroke weight as paddle is closer to center of screen
    if (this.padLeft === false) {
      this.strokeWeight = map(this.x,width,width/2,minStrokeWidth,maxStrokeWidth);
    }
    else {
      this.strokeWeight = map(this.x,0,width/2,minStrokeWidth,maxStrokeWidth);
    }
    strokeWeight(this.strokeWeight);
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
        this.velY -= this.accY;
      }
      if (keyIsDown(this.downKey)) {
        this.velY += this.accY;
      }
      if (keyIsDown(this.leftKey)) {
        this.velX -= this.accX;
      }
      if (keyIsDown(this.rightKey)) {
        this.velX += this.accX;
      }
      //here i apply drag so that the player seems to accelerate more at lower speeds,
      //and less quickly at higher speeds --> creates for a nice ramp of acceleration which feels better
      this.velX = this.velX/(this.drag/1.6);
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
    this.velX = constrain(this.velX,-this.maxVelX,this.maxVelX);
    this.velY = constrain(this.velY,-this.maxVelY,this.maxVelY);
  }

  changePos(){ //changes position based on velocity
    //adds velocity to position
    this.x+=this.velX;
    this.y+=this.velY;

    let w = (this.width/2)+this.strokeWeight/2;
    let h = (this.height/2)+this.strokeWeight/2;

    //constrain x positions based on if the paddle is left or right, constrains y pos identically
    if (this.padLeft === false){ //if right paddle
      this.x = constrain(this.x,(width/2)+w,width-w);
    }
    else{
      this.x = constrain(this.x,w,(width/2)-w);
    }
      this.y = constrain(this.y,h,height-h);
  }

  checkBallCollision(){
    let w = this.width/2;
    let h = this.height/2;
    let r = ball.radius;
    let x = this.x;
    let y = this.y;
    let xx = ball.x;
    let yy = ball.y;

    if (this.r < 200){ //if right paddle
      //if colliding...
      if ((xx < x+w+r)&& (xx > x-w-r-r)){
        if ((yy < y+h+r) && (yy > y-h-r)){
          //if the ball is traveling towards the left, make it travel towards the right
          if (ball.velX < 0){
            ball.velX *=-1;
          }
          ball.velX += this.velX/10; //increase speed of ball based on speed of paddle

          //increase/decrease speed of ball depending on how close the paddle
          //is to the center of the screen (closer = faster)
          let spdInc = map(this.x,0,width/2,.6,1.5);
          print(spdInc);
          ball.velX = ball.velX*spdInc;

          //make sure that the ball is not moving slower than the paddle (or else ball wud go through paddle)
          if (ball.velX < this.velX){
            ball.velX = this.velX;
          }
          //move the ball outside the paddle hitbox
          while ( (ball.x < x+w+r)&& (ball.x > x-w-r-r)
          && (ball.y < y+h+r) && (ball.y > y-h-r) ){
            ball.x += 1;
          }

        }
      }
    }

    if (this.r > 200){ //if right paddle
      //if colliding...
      if ((xx < x+w+r)&& (xx > x-w-r-r)){
        if ((yy < y+h+r) && (yy > y-h-r)){
          //if the ball is traveling towards the left, make it travel towards the right
          if (ball.velX > 0){
            ball.velX *=-1;
          }
          ball.velX += this.velX/10; //increase speed of ball based on speed of paddle

          //increase/decrease speed of ball depending on how close the paddle
          //is to the center of the screen (closer = faster)
          let spdInc = map(this.x,width/2,width,1.5,.6);
          print(spdInc);
          ball.velX = ball.velX*spdInc;

          //make sure that the ball is not moving slower than the paddle (or else ball wud go through paddle)
          if (ball.velX > this.velX){
            ball.velX = this.velX;
          }
          //move the ball outside the paddle hitbox
          while ( (ball.x < x+w+r)&& (ball.x > x-w-r-r)
          && (ball.y < y+h+r) && (ball.y > y-h-r) ){
            ball.x -= 1;
          }

        }
      }
    }
    //ball.velX += this.velX;
    // while(((xx < x+w+r)&& (xx > x-w-r))&&((yy < y+h+r) && (yy > y-h-r))){
    //   ball.x += sin(ball.velX);
    //   w = this.width/2;
    //   h = this.width/2;
    //   r = ball.radius;
    //   x = this.x;
    //   y = this.y;
    //   xx = ball.x;
    //   yy = ball.y;
    // }
  }
}
