class Ray {
  constructor(targetX, targetY, createChildren) {
    this.x;
    this.y;
    // this.angle = angle;
    // this.vecX = (cos(this.angle) * this.r);
    // this.vecY = (sin(this.angle) * this.r);

    this.targetX = targetX; //where the line is pointed (xvec)
    this.targetY = targetY; //where the line is pointed (yvec)
    this.collidedX; //closest point of x intersection
    this.collidedY; //closest point of y intersection
    this.angle; //angle
    this.children = [];
    this.hasChildren; //true or false, does this ray have children?
    this.debug = false;
    if (createChildren === true) {
      this.hasChildren = true;
      this.children[0] = new Ray(targetX, targetY, false);
      this.children[1] = new Ray(targetX, targetY, false);

    } else {
      this.hasChildren = false;
    }

  }
  update() {
    if (this.hasChildren === true) { //if you have children (and are therefore not a child)
      this.checkIntersection();
      this.calculateAngle();
      this.updateChildren();
    }
  }
  updateChildren() {
      for (let i = 0; i < this.children.length; i++) {
        //offsets angle slightly each direction
        let angleOffset = .00001
        if (i === 0) {
          angleOffset = -angleOffset;
        }

        this.children[i].angle = this.angle + angleOffset;
        // print(i+":"+this.angle);
        this.calculateTargetBasedOnAngle(this.angle+angleOffset,i);
        this.children[i].x = this.x;
        this.children[i].y = this.y;
        this.children[i].checkIntersection();
        this.children[i].display();
      }

  }

  checkIntersection() {
    //check if not infinit, parrellel, 0

    //convert point form to y = mx+b
    //find slope
    this.collidedX = Infinity;
    this.collidedY = Infinity;
    let raySlope = (this.targetY - this.y) / (this.targetX - this.x);

    //find y intercept
    let rayB = this.y - (raySlope * this.x);

    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].lines.length; j++) {

        // let line = shape[i].lines[j];
        let line = shape[i].lines[j];
        let lineSlope = (line.y2 - line.y1) / (line.x2 - line.x1);
        let lineB = line.y1 - (lineSlope * line.x1);

        //check to where ray and line intersect
        let simplifyB = lineB - rayB;
        let simplifySlope = raySlope - lineSlope;
        let intersectionX = simplifyB / simplifySlope; //the x location where lines intersects
        let intersectionY = (raySlope * intersectionX) + rayB; //y where lines interesct

        stroke(255, 255, 255, 50);
        //make sure only recognizes intersections which happen in the direction of the ray
        if (((this.targetX - this.x <= 0) && (intersectionX < this.x)) || ((this.targetX - this.x > 0) && (intersectionX > this.x))) {
          //check to see if collsion happened within confines of line (and not infinite funciton)
          let c = 0.0000000001; //creates a buffer so the intersection doesn't have to happen exactly on the line to be recognized
          if (line.x1 < line.x2) {
            if ((intersectionX + c >= line.x1) && (intersectionX - c <= line.x2)) {
              // ellipse(intersectionX,intersectionY,10);
              //change collidedX,Y to the intersection's X,Y's are closer to the ray origin
              this.makeCollidedShortestIntersection(intersectionX, intersectionY);
            }
          } else if (line.x1 > line.x2) {
            if ((intersectionX - c <= line.x1) && (intersectionX + c >= line.x2)) {
              if (this.debug === true) {
                ellipse(intersectionX, intersectionY, 10);
              }
              //change collidedX,Y to the intersection's X,Y's are closer to the ray origin
              this.makeCollidedShortestIntersection(intersectionX, intersectionY);
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
  makeCollidedShortestIntersection(intersectionX, intersectionY) {
    //compares the dist between the ray origin and the two vectors,
    //and if intersection is shorter then it makes collidedX,y the intersection's x,y
    let collidedR = sqrt(sq(this.collidedX - this.x) + sq(this.collidedY - this.y));
    let intersectionR = sqrt(sq(intersectionX - this.x) + sq(intersectionY - this.y));
    if (intersectionR < collidedR) {
      this.collidedX = intersectionX;
      this.collidedY = intersectionY;
    }
  }
  calculateAngle() {
    //calculates the angle of the ray from origin to target
    let radius = sqrt(sq( this.targetX-this.x) + sq(this.targetY-this.y));
    let yVec = this.targetY - this.y;
    let xVec = this.targetX - this.x;
    let newAngle = atan2(yVec, xVec);
    newAngle = map(newAngle, -PI, PI, 0, PI * 2);
    this.angle = newAngle;
    noStroke();
    fill(180);
    if (this.debug === true){
      text(round(this.angle * 10000) / 10000, this.collidedX + 20, this.collidedY);
    }
  }
  calculateTargetBasedOnAngle(angle,index) {
    let radius = sqrt(sq(this.targetX - this.x) + sq(this.targetY - this.y));
    // let vecX = this.targetX - this.x;
    // let vecY = this.targetY - this.y;
    this.children[index].targetX = (-cos(angle)*radius)+this.x;
    this.children[index].targetY = (-sin(angle)*radius)+this.y;
    // strokeWeight(30);
    // stroke(0);
    // line(this.x,this.y,this.targetX,this.targetY);
    // angleMode(DEGREES);


  }

  display() {
    strokeWeight(2);
    let mapColor = map(this.angle,0,TWO_PI*2,0,255);
    noStroke();
    fill(mapColor,(255-mapColor),255);
    text(this.angle,40,(100*this.angle)+50);
    if (this.hasChildren == true){
      strokeWeight(1);
      stroke(mapColor,(255-mapColor),200,255);
    } else {
      strokeWeight(1);
      stroke(mapColor,(255-mapColor),200,50);
    }

    line(this.x, this.y, (this.collidedX), (this.collidedY));


    stroke(255,100,0);
    ellipse(this.x, this.y, 20);
    ellipse(this.targetX, this.targetY, 10);

    //display children
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].display();
    }
  }

}
