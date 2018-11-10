class Player {
  constructor(x, y, angle) {
    this.upKey = 87;
    this.downKey = 83;
    this.leftKey = 65;
    this.rightKey = 68;
    this.x = x;
    this.y = y;

    this.angle = angle;
    this.angularIncrement = PI/30;

    this.vel = 0;
    this.velX = 0;
    this.velY = 0;
    this.drag = 0.95;
    this.velIncrement = 1;

    this.radius = 20;


  }
  update(){
    this.changeAngle();
    this.input();
    this.changePos();
    this.display();

  }
   input() {
      if (keyIsDown(this.upKey)) {
        this.velX += cos(this.angle)*this.velIncrement;
        this.velY += sin(this.angle)*this.velIncrement;
      }
      if (keyIsDown(this.downKey)) {
        this.velX += cos(this.angle+PI)*this.velIncrement;
        this.velY += sin(this.angle+PI)*this.velIncrement;
      }
      if (keyIsDown(this.leftKey)) {
        this.velX += cos(this.angle-HALF_PI)*this.velIncrement;
        this.velY += sin(this.angle-HALF_PI)*this.velIncrement;
      }
      if (keyIsDown(this.rightKey)) {
        this.velX += cos(this.angle+HALF_PI)*this.velIncrement;
        this.velY += sin(this.angle+HALF_PI)*this.velIncrement;
      }

}
changeAngle(){
  this.angle = atan2(mouseY-this.y,mouseX-this.x);
  // this.angle = map(mouseX,0,width,0,TWO_PI);
}
changePos(){
  this.velX = this.velX * this.drag;
  this.velY = this.velY * this.drag;

  this.x += this.velX;
  this.y += this.velY;
}
  display(){
    stroke(255);
    fill(51);
    strokeWeight(4);
    ellipse(this.x,this.y,this.radius*2);
    line(this.x,this.y,this.x+(cos(this.angle)*this.radius),this.y+(sin(this.angle)*this.radius));
  }

}
