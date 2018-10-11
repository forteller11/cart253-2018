class Paddle{
  constructor(upKey,downKey,fluidKey,r,g,b){
    //stores key codes to move and shoot fluid from the paddle
    this.upKey = upKey;
    this.downKey = downKey;
    this.fluidKey = fluidKey; //key which shoots fluid
    this.r = r;
    this.g = g;
    this.b = b;

    this.x;
    this.y;
    this.velX = 0; //velocity
    this.velY = 0; //velocity
    this.width = 16;
    this.height = 100;
    this.fluidMeter = 1; //how much fluid can this paddle produce? (0-1)
    this.strokeWeight = 4;
  }
  displayFluidMeter(){
    //fills in the paddle repsenting how much fluidMeter the paddle has;
    let w = this.width/2;
    let h = this.height/2;
    let x1 = -w+this.x;
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

}
