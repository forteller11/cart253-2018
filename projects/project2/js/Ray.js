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

    this.targetX = shape[0].vertX[0];
    this.targetY = shape[0].vertY[0];
    // this.vecX = this.x+20;
    // this.vecY = this.y+30;

    this.checkIntersection();
    // print(this.x);
    // print(this.vecX)
  }

  checkIntersection(){
    //check if not infinit, parrellel, 0

    //convert point form to y = mx+b
    //find slope

    let raySlope = (this.targetY - this.y)/(this.targetX - this.x);

    print(raySlope);
    //find y intercept
    let rayB = this.y-(raySlope*this.x);

    for (let i = 0; i < shape.length; i ++){
      for (let j = 0; j < shape[i].lines.length; j++){

        // let line = shape[i].lines[j];
        let line = shape[i].lines[j];
        let lineSlope = (line.y2-line.y1)/(line.x2 - line.x1);
        let lineB = line.y1-(lineSlope*line.x1);

        //check to where ray and line intersect
        let simplifyB = lineB - rayB;
        let simplifySlope = raySlope - lineSlope;
        let intersectionX = simplifyB/simplifySlope; //the x location where lines intersects
        let intersectionY = (raySlope*intersectionX)+rayB; //y where lines interesct

        //check to see if collsion happened within confines of line (and not infinite funciton)
        if (line.x1 <= line.x2) {
          if ( (intersectionX >= line.x1) && (intersectionX <= line.x2) ){
            ellipse(intersectionX,intersectionY,10);
          }
        } else if (line.x1 > line.x2) {
          if ( (intersectionX <= line.x1) && (intersectionX >= line.x2) ){
            ellipse(intersectionX,intersectionY,10);
          }
        }
        // if (line.x2 < line.x1) {
        //   if (line.x1 > intersectionX > line.x2){
        //     ellipse(intersectionX,intersectionY,10);
        //   }
        // }

        // ellipse(intersectionX,intersectionY,10);

        // //draw linear functions (for debugging)
        // for (let i = 0; i < width; i ++){
        //   stroke(255);
        //   strokeWeight(1);
        //   point(i,(lineSlope*i)+lineB);
        //   stroke(255,255,0);
        //   point(i,(raySlope*i)+rayB);
        // }


      }
    }

  }

  display(){
    strokeWeight(2);
    stroke(255,100,0);
    line(this.x,this.y,(this.targetX),(this.targetY));
    ellipse(this.x,this.y,20);
  }

}
