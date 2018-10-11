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
    this.width = 8;
    this.height = 50;
    this.fluidMeter = 1; //how much fluid can this paddle produce? (0-1)
  }

  displayPaddle(){
    //draw paddle with width and color
    strokeWeight(6);
    //rectMode(CENTER);
    //rect(this.x,this.y,this.width*2,this.height*2);
    let x1 = -this.width+this.x;
    let x2 = this.width+this.x;
    let y1 = -this.height+this.y;
    let y2 = this.height+this.y;
    stroke(this.r,this.g,this.b);
    stroke(255);
    line(x1,y1,x2,y1);
    line(x2,y1,x2,y2);
    line(x2,y2,x1,y2);
    line(x1,y2,x1,y1);

  }
}
