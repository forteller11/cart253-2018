class Ray{
  constructor(){
    this.x;
    this.y;
    // this.angle = angle;
    // this.vecX = (cos(this.angle) * this.r);
    // this.vecY = (sin(this.angle) * this.r);
    this.vecX;
    this.vecY;
    this.vexX;
    // this.vecR = sqrt(sq(this.vecX)+sq(this.vecY));
    /*
    x unit vector,
    y unit vectors
    */
  }
  update(){
    //set origin
    this.x = mouseX;
    this.y = mouseY;
    //set target
    this.vecX = shape[0].vertX[0] - this.x;
    this.vecY = shape[0].vertY[0] - this.y;

    this.checkCollision();
    // print(this.x);
    // print(this.vecX)
  }

  checkCollision(){
    //convert point form to y = mx+b
    let raySlope = (this.vecY - this.y)/(this.vecX - this.x);
    let rayB = this.y;

    for (let i = 0; i < shape.length; i ++){
      for (let j = 0; j < shape[i].lines.length; j++){
        let line = shape[i].lines[j];
        let lineSlope = (line.y2-line.y1)/(line.x2 - line.x1);
        let lineB = line.y1;

        //deal with exceptions
        // if ((lineSlope && raySlope) === -0){
        //   print("-ZER000");
        // }
        // if (lineSlope || raySlope === Infinity){
        //   print("INFINITY");
        // }
        // if ((lineSlope || raySlope) === -Infinity){
        //   print("-INFINITY");
        // }

        le

        print(lineSlope);
      }
    }

  }

  display(){
    line(this.x,this.y,(this.vecX)+this.x,(this.vecY)+this.y);
    ellipse(mouseX,mouseY,20);
  }

}
