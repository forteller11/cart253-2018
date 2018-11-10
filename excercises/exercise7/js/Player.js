class Player {
  constructor(x, y, angle) {
    this.upKey = 38;
    this.downKey = 40;
    this.leftKey = 37;
    this.rightKey = 39;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.angularIncrement = PI/10;
    this.vel = 0;
    this.drag = 0.95;
    this.angularDrag = 0.85;
    this.radius = 20;
    this.velIncrement = 1;
    this.maxVel = 0;
  }
  update(){
    this.input();
    this.changePos();
    this.display();
  }
   input() {

      if (keyIsDown(this.upKey)) {
        this.vel += this.velIncrement;
      }
      if (keyIsDown(this.downKey)) {
      this.vel -= this.velIncrement
      }
      if (keyIsDown(this.leftKey)) {
        this.angle -= this.angularIncrement;
      }
      if (keyIsDown(this.rightKey)) {
        this.angle += this.angularIncrement;
      }
      print(round(this.vel));

this.vel = this.vel * this.drag;
this.x += cos(this.angle)*this.vel;
this.y += sin(this.angle)*this.vel;

}
changePos(){
  // let xVec = cos(this.angle)*this.vel;
  // let yVec = sin(this.angle)*this.vel;
  let xVec = cos(this.angle)*this.vel;
  let yVec = sin(this.angle)*this.vel;
  this.x += xVec;
  this.y += yVec;
}
  display(){
    stroke(255);
    fill(51);
    strokeWeight(4);
    ellipse(this.x,this.y,this.radius*2);
    line(this.x,this.y,this.x+(cos(this.angle)*this.radius),this.y+(sin(this.angle)*this.radius));
  }

}
