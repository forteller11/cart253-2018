class Ray{
  constructor(){
    this.x;
    this.y;
    // this.angle = angle;
    // this.vecX = (cos(this.angle) * this.r);
    // this.vecY = (sin(this.angle) * this.r);
    this.vecX;
    this.vecY;
    // this.vecR = sqrt(sq(this.vecX)+sq(this.vecY));
    /*
    x unit vector,
    y unit vectors
    */
  }
  update(){
    this.x = mouseX;
    this.y = mouseY;
    this.vecX = shape[0].vertX[0] - this.x;
    this.vecY = shape[0].vertY[0] - this.y;
    // print(this.x);
    print(this.vecX)
  }

  display(){
    line(this.x,this.y,(this.vecX)+this.x,(this.vecY)+this.y);
    ellipse(mouseX,mouseY,20);
  }

}
