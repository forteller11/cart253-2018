class Ray{
  constructor(targetX,targetY){
    this.x;
    this.y;
    // this.angle = angle;
    // this.vecX = (cos(this.angle) * this.r);
    // this.vecY = (sin(this.angle) * this.r);

    this.targetX = targetX; //where the line is pointed (xvec)
    this.targetY = targetY; //where the line is pointed (yvec)
    this.collidedX; //closest point of x intersection
    this.collidedY; //closest point of y intersection
    this.a; //angle
    // this.vecR = sqrt(sq(this.vecX)+sq(this.vecY));
    /*
    x unit vector,sssss
    y unit vectors
    */
  }
  update(){
    //set origin
    this.x = mouseX;
    this.y = mouseY;
    // this.targetX = 0;
    this.checkIntersection();
    this.calculateAngle();


  }

  checkIntersection(){
    //check if not infinit, parrellel, 0

    //convert point form to y = mx+b
    //find slope
    this.collidedX = Infinity;
    this.collidedY = Infinity;
    let raySlope = (this.targetY - this.y)/(this.targetX - this.x);

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

        stroke(255,255,255,50);
        //make sure only recognizes intersections which happen in the direction of the ray
        if (((this.targetX-this.x<= 0) && (intersectionX < this.x)) || ((this.targetX-this.x > 0) && (intersectionX > this.x))){
          //check to see if collsion happened within confines of line (and not infinite funciton)
          let c = 0.0000000001; //creates a buffer so the intersection doesn't have to happen exactly on the line to be recognized
          if (line.x1 < line.x2) {
            if ( (intersectionX+c >= line.x1) && (intersectionX-c <= line.x2) ){
              // ellipse(intersectionX,intersectionY,10);
              //change collidedX,Y to the intersection's X,Y's are closer to the ray origin
              this.makeCollidedShortestIntersection(intersectionX,intersectionY);
            }
          } else if (line.x1 > line.x2) {
            if ( (intersectionX-c <= line.x1) && (intersectionX+c >= line.x2) ){
              ellipse(intersectionX,intersectionY,10);
              //change collidedX,Y to the intersection's X,Y's are closer to the ray origin
              this.makeCollidedShortestIntersection(intersectionX,intersectionY);
            }
          }
        }



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

  makeCollidedShortestIntersection(intersectionX,intersectionY){
    //compares the dist between the ray origin and the two vectors,
    //and if intersection is shorter then it makes collidedX,y the intersection's x,y
    let collidedR = sqrt(sq(this.collidedX-this.x)+sq(this.collidedY-this.y));
    let intersectionR = sqrt(sq(intersectionX-this.x)+sq(intersectionY-this.y));
    if (intersectionR < collidedR){
      this.collidedX = intersectionX;
      this.collidedY = intersectionY;
    }
  }

  calculateAngle(){
    let radius = sqrt( sq(this.targetX-this.x) + sq(this.targetY-this.y) );
    this.angle = asin( (this.targetY-this.y)/radius);
     print(this.angle);
  }

  display(){
    strokeWeight(2);
    stroke(255,100,0);
    line(this.x,this.y,(this.collidedX),(this.collidedY));
    ellipse(this.x,this.y,20);
    ellipse(this.targetX,this.targetY,10);
  }

}
