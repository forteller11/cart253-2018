/*
a Ray has an origin (this.x,this.y) and a target(x,y) which represents the position of
a unique vertex of a Shape class. It's main job is checking to see if it intersects
with a line within a shape. It does this by itterating through every line in the scene,
coverting the start/endpoints of itself and the line into slope form, and then using
basic algebra to find out where the two functions intersect, it records the shortest point
of intersection (from its origin) in the collidedX,collidedY variables, which are later
used by the light Class to actually draw the light. Rays also calculate and store the
angle of their line (origin --> target).
Rays CAN also have children, parentRays controlled by the light object will each
contain two children which its responsible for updating. parentRays offset its childrens
 targetX,Y by a small angle this is done so there are rays which go past vertexes
  to cast realistic shadows.


*/
class Ray {
  constructor(createChildren) {
    this.x;
    this.y;
    this.r = 0;
    this.g = 0;
    this.b = 0;

    this.targetX; //where the line is pointed (xvec)
    this.targetY; //where the line is pointed (yvec)
    this.collidedX; //closest point of x intersection
    this.collidedY; //closest point of y intersection
    this.collidedRad; //distance to closest point of intersection
    this.collidedH; //h of wall on collision
    this.collidedR; //red of wall on collision
    this.collidedG; //greeb of wall on collision
    this.collidedB; //blue of wall on collision
    this.collidedAlpha; //alpha of wall on collision
    this.intStripeH = [];
    this.intStripeW  = [];
    this.collidedStripeH = [];
    this.collidedStripeW  = [];
    this.angle; //angle
    this.fovAngle1;
    this.fovAngle2;
    this.hasChildren = createChildren; //true or false, does this ray have children?
    this.children = []; //the array where any children will be put
    //if set to create children create two rays who are set NOT to create children.
    if (createChildren === true) {
      this.children[0] = new Ray(false);
      this.children[1] = new Ray(false);
    }

  }
  update() {
    if (this.hasChildren === true) { //if you have children (and are therefore not a child)
      this.checkIntersection(); //sees where the ray intersects with lines, and stores the closest collision
      this.calculateAngle(); //caluclates the angle of the ray (cartesian-->polar)
      this.updateChildren(); //sets offsets children's angle/targetx,y; updates chilldren
      this.display();
    }
  }
  updateChildren() {
    for (let i = 0; i < this.children.length; i++) {
      //offsets angle of children slightly in each direction
      let angleOffset = 0.00001
      if (i === 0) {
        angleOffset = -angleOffset;
      }
      this.children[i].angle = this.angle + angleOffset;
      //sets the new target of children based on their new offset angle
      this.calculateTargetBasedOnAngle(this.angle + angleOffset, i);
      this.children[i].x = this.x;
      this.children[i].y = this.y;
      this.children[i].checkIntersection();
      this.children[i].display();
    }

  }

  checkIntersection() {
    //vars store the closest point(x,y) of collision
    this.collidedX = Infinity;
    this.collidedY = Infinity;
    this.collidedRad = Infinity;

    //transform ray into linear function in slope form (y = mx+b)
    //find slope
    let raySlope = (this.targetY - this.y) / (this.targetX - this.x);
    //find y intercept (or "b")
    let rayB = this.y - (raySlope * this.x);
    //itterate through all lines and check point of collision with ray, store the closest collision
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].lines.length; j++) {

        //convert line to slope form (y = mx+b)
        let line = shape[i].lines[j];
        let lineSlope = (line.y2 - line.y1) / (line.x2 - line.x1);
        let lineB = line.y1 - (lineSlope * line.x1);

        //check to see where ray and line intersect (assuming not parrallel and slope not 0, Infinity,-Infinity)
        //uses basic algebra (isolation, substitution...)
        let simplifyB = lineB - rayB;
        let simplifySlope = raySlope - lineSlope;
        let intersectionX = simplifyB / simplifySlope; //the x location where lines intersects
        let intersectionY = (raySlope * intersectionX) + rayB; //y where lines interesct
        let intersectionH = map(intersectionX,line.x1,line.x2,line.h1,line.h2);
        let intR = line.r; //store intersections r,g,b,a values
        let intG = line.g;
        let intB = line.b;
        let intAlpha = line.alpha;
        //use for?
        this.intStripeH.splice(0,this.intStripeH.length);
        this.intStripeW.splice(0,this.intStripeW.length);
        // console.log(line.stripeH);
        for (let i = 0; i < line.stripeH.length; i ++){
          this.intStripeH[i] = line.stripeH[i];
          this.intStripeW[i] = line.stripeW[i];
          // console.log(line.stripeH[i]);
        }

        //make sure collision happened in front of the ray
        //(because ray is converted to slope form it becomes directionless meaning it will intersect with lines behind it)
        if (((this.targetX - this.x <= 0) && (intersectionX < this.x)) || ((this.targetX - this.x > 0) && (intersectionX > this.x))) {
          //now make sure the collision happanned in between the two end points of the line
          //(instead of inevitably somewhere on the infinite linear function)
          //"c" creates a buffer so the intersection doesn't have to happen exactly on the line to be recognized
          //because of rounding errors of floating point numbers this small buffer is necessary
          let c = 0.0000000001;
          if (line.x1 < line.x2) {
            if ((intersectionX + c >= line.x1) && (intersectionX - c <= line.x2)) {
              if (debugDisplay === true){ //shows where intersections happen if debugMode is on
                stroke(this.r, this.g, this.b,50);
                fill(this.r, this.g, this.b);
                ellipse(intersectionX-(player.x)+width/2,intersectionY-(player.y)+height/2,7);
              }
              //if intersection happend closer than current stored closest collision
              //change collisionX,Y to this be the points of this intersection
              this.makeCollidedShortestIntersection(intersectionX, intersectionY,intersectionH,intR,intG,intB,intAlpha);
            }
          } else if (line.x1 > line.x2) {
            if ((intersectionX - c <= line.x1) && (intersectionX + c >= line.x2)) {
              if (debugDisplay === true){ //shows where intersections happen if debugMode is on
                stroke(this.r, this.g, this.b,50);
                fill(this.r, this.g, this.b);
                ellipse(intersectionX-(player.x)+width/2,intersectionY-(player.y)+height/2,7);
              }
              //if intersection happend closer than current stored closest collision
              //change collisionX,Y to this be the points of this intersection
              this.makeCollidedShortestIntersection(intersectionX, intersectionY,intersectionH,intR,intG,intB,intAlpha);
            }
          }
        }

      }
    }
  }
  makeCollidedShortestIntersection(intersectionX, intersectionY,intersectionH,intR,intG,intB,intAlpha,intStripeNumber) {
    //compares the dist between the ray origin and the intersectionX,Y and collidedX,Y
    //and if intersection is shorter then it changes collision,x,y to be the intersection
    //also store its other properties like (r,g,b,a) color and height
    let collidedRad = sqrt(sq(this.collidedX - this.x) + sq(this.collidedY - this.y));
    let intersectionRad = sqrt(sq(intersectionX - this.x) + sq(intersectionY - this.y));
    if (intersectionRad < collidedRad) {
      this.collidedX = intersectionX;
      this.collidedY = intersectionY;
      this.collidedRad = intersectionRad;
      this.collidedH = intersectionH;
      this.collidedR = intR;
      this.collidedG = intG;
      this.collidedB = intB;
      this.collidedAlpha = intAlpha;
      this.collidedStripeH.splice(0,this.collidedStripeH.length);
      this.collidedStripeW.splice(0,this.collidedStripeW.length);
      // print(this.collidedStripeH);

      for (let i = 0; i < this.intStripeH.length; i ++){
        this.collidedStripeH[i] = this.intStripeH[i];
        this.collidedStripeW[i] = this.intStripeW[i];
      }
      // print(this.collidedStripeH);
    }
  }
  calculateAngle() {
    //calculates the angle of the ray from origin to target
    let radius = sqrt(sq(this.targetX - this.x) + sq(this.targetY - this.y));
    let yVec = this.targetY - this.y;
    let xVec = this.targetX - this.x;
    let newAngle = atan2(yVec, xVec);
    newAngle = map(newAngle, -PI, PI, 0, PI * 2);
    this.angle = newAngle;
    if (debugDisplay === true) { //draws angles if debugMode is on
      noStroke();
      fill(180);
      text(round(this.angle * 1000) / 1000, this.collidedX + 20, this.collidedY);
    }
  }
  calculateTargetBasedOnAngle(angle, index) { //polar-->Cartesian
    let radius = sqrt(sq(this.targetX - this.x) + sq(this.targetY - this.y));
    this.children[index].targetX = (-cos(angle) * radius) + this.x;
    this.children[index].targetY = (-sin(angle) * radius) + this.y;
  }

  calculateThisTargetBasedOnAngle(angle) { //polar-->Cartesian
    let radius = width+(height/2);
    this.targetX = (-cos(angle) * radius) + this.x;
    this.targetY = (-sin(angle) * radius) + this.y;
  }

  display() {
    //if debug mode is on display draws the lines on the rays, colors them
    //according to their angle, and highlights point where the ray collided
    if (debugDisplay === true){
      //calcs colour based on angle
      let mapColor = map(this.angle, 0, TWO_PI * 2, 0, 255);
      this.r = mapColor;
      this.g = 255-mapColor;
      this.b = 200;
      noStroke();
      fill(this.r, this.g, this.b);
      text(round(100 * this.angle)/100, 40, (100 * this.angle) + 50);

        strokeWeight(1);
        stroke(this.r, this.g, this.b, 150);

        if(this.fovAngle1 === true){
          strokeWeight(4)
          stroke(0,255,0);
          line(this.x-(player.x)+width/2, this.y-player.y+(height/2), (this.targetX)-player.x+(width/2), (this.targetY)-player.y+(height/2));
        }
        if(this.fovAngle2 === true){
          strokeWeight(4)
          stroke(255,0,0);
        line(this.x-(player.x)+width/2, this.y-player.y+(height/2), (this.targetX)-player.x+(width/2), (this.targetY)-player.y+(height/2));
        }
      // stroke(this.r, this.g, this.b,255);
      line(this.x-(player.x)+width/2, this.y-player.y+(height/2), (this.collidedX)-player.x+(width/2), (this.collidedY)-player.y+(height/2));
      //post collision stroke
      stroke(this.r, this.g, this.b,20);
      line(this.x-(player.x)+width/2, this.y-player.y+(height/2), (this.targetX)-player.x+(width/2), (this.targetY)-player.y+(height/2));


    }
  }
}
