class Player {
  constructor(x, y, angle) {
    this.upKey = 87;
    this.downKey = 83;
    this.leftKey = 65;
    this.rightKey = 68;
 //whether to visualize pseudo3D
    this.x = x;
    this.y = y;
    this.k = 0;

    this.angle = angle;
    this.angularIncrement = (this.pov / 30) + (PI/60);

    this.vel = 0;
    this.velX = 0;
    this.velY = 0;
    this.drag = 0.95;
    this.velIncrement = 1;
    this.pov = PI + 0.0001; //angle of perspective
    this.povIncrement = 0.08;
    this.povAngle1 = this.angle - (this.pov / 2); //start of cone
    this.povAngle2 = this.angle + (this.pov / 2); //end of cone
    this.radius = 20;

    this.parentRay = [];
    //create one parentRay for every vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].vertNumber; j++) {
        this.parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j], true);
        k++;
      }
    }
    //create pov rays
    this.parentRay[k] = new Ray(100, 100, true);
    this.parentRay[k + 1] = new Ray(100, 100, true);

  }
  update() {
    this.changeAngle();
    this.input();
    this.changePos();

    this.updateRays();
    this.selectionSort();
    if (threeDisplay === true) {
      this.visualizeRays();
    }
    this.display();

  }

  visualizeRays() {
    /*This displays the "light", it connects the dots between all the the rays,
    and then fills in the space inbetween. It starts at the ray with the smallest angle
    and works its way up to the ray with the largest angle. */

    let angleDiffNet = 0;
    let fadeHeightDist = width*1.2; //dist from player to wall at which wall is height 0
    let maxHeight = height / 2; //what height is wall when player is on top of wall
    let minHeight = 0;

    let wHist = 0;
    let index = 0;
    // print(this.parentRay);
    while (this.parentRay[index].povAngle1 === false) {
      index++;
    }
    // print("startingI: " + index);
    // print("length of array: " + this.parentRay.length);
    let maxStroke = width/3000;
    let minStroke = width/3000;

    while (this.parentRay[index].povAngle2 === false)  {
      // print("loop:" + index);
      let v0;
      let v1;
      let v2;
      let v3;

      let aDiff0;
      let aDiff1;
      let aDiff2;
      if (index < this.parentRay.length - 1) { //wrap
        // print("if");
        v0 = this.parentRay[index].children[0];
        v1 = this.parentRay[index];
        v2 = this.parentRay[index].children[1];
        v3 = this.parentRay[index + 1].children[0];

        aDiff0 = abs(v1.angle - v0.angle);
        aDiff1 = abs(v2.angle - v1.angle);
        aDiff2 = abs(v3.angle - v2.angle);
      } else {
        // print("else");
        let iFinal = this.parentRay.length - 1;
        v0 = this.parentRay[iFinal].children[0];
        v1 = this.parentRay[iFinal];
        v2 = this.parentRay[iFinal].children[1];
        v3 = this.parentRay[0].children[0];

        aDiff0 = abs(v1.angle - v0.angle);
        aDiff1 = abs(v2.angle - v1.angle);
        aDiff2 = abs((v3.angle + TWO_PI) - v2.angle);
      }

      index++;
      if (index >= this.parentRay.length) { //wrap
        index = 0;
        // print("overflow:");
      }

      if (debugDisplay === true) {
        stroke(255, 150, 0, 150);
        strokeWeight(3);
        line(v1.x, v1.y, v1.targetX, v1.targetY);
      }


      let hBase = height / 2;
      //base height
      let dist0 = map(v0.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      dist0 = constrain(dist0, minHeight, height);
      let dist1 = map(v1.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      dist1 = constrain(dist1, minHeight, height);
      let dist2 = map(v2.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      dist2 = constrain(dist2, minHeight, height);
      let dist3 = map(v3.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      dist3 = constrain(dist3, minHeight, height);
      //top height
      let hOff0 = (dist0 * v0.collidedH);
      let hOff1 = (dist1 * v1.collidedH);
      let hOff2 = (dist2 * v2.collidedH);
      let hOff3 = (dist3 * v3.collidedH);

      let opacityFill = map((v1.collidedRad), 0, fadeHeightDist, 1.5, 0);
      let w0 = map(aDiff0, 0, this.pov, 0, width);
      let w1 = map(aDiff1, 0, this.pov, 0, width);
      let w2 = map(aDiff2, 0, this.pov, 0, width);
      // rect(wHist, hBase+hOff1, wHist + w, hBase-hOff1);
      fill(v1.collidedR*opacityFill, v1.collidedG*opacityFill, v1.collidedB*opacityFill, 255);
      let sW = map((v1.collidedRad), 0, fadeHeightDist, maxStroke, minStroke);
      strokeWeight(sW);
      stroke(v1.collidedR, v1.collidedG, v1.collidedB, 255);
      noStroke();
      beginShape();
      vertex(wHist, hBase - hOff0); //topleft
      vertex(wHist + w0, hBase - hOff1);
      vertex(wHist + w0 + w1, hBase - hOff2);

      vertex(wHist + w0 + w1, hBase + dist1);
      vertex(wHist + w0, hBase + dist2);
      vertex(wHist, hBase + dist0); //botleft
      endShape();

      sW = map((v3.collidedRad), 0, fadeHeightDist, maxStroke, minStroke);
      strokeWeight(sW);
      stroke(v3.collidedR, v3.collidedG, v3.collidedB, 255);
      noStroke();
      opacityFill = map((v3.collidedRad), 0, fadeHeightDist, 1.5, 0)
      fill(v3.collidedR*opacityFill, v3.collidedG*opacityFill, v3.collidedB*opacityFill, 255);
      beginShape();
      vertex(wHist + w0 + w1, hBase - hOff2);
      vertex(wHist + w0 + w1 + w2, hBase - hOff3); //topright
      vertex(wHist + w0 + w1 + w2, hBase + dist3); //botright
      vertex(wHist + w0 + w1, hBase + dist2);
      endShape();
      wHist += w0 + w1 + w2;
    }
    // print("out:" + index);


  }
  updateRays() {
    /* set every parentRay (ray with children) target to a unique vertex in the scene,
    set its origin to the light's origin, update the ray */
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].vertNumber; j++) {
        this.parentRay[k].x = this.x;
        this.parentRay[k].y = this.y;
        this.parentRay[k].targetX = shape[i].vertX[j];
        this.parentRay[k].targetY = shape[i].vertY[j];
        this.parentRay[k].povAngle1 = false;
        this.parentRay[k].povAngle2 = false;
        this.parentRay[k].update();
        k++;
      }
    }
    this.povAngle1 = this.angle - (this.pov / 2) + PI; //start of cone;
    if (this.povAngle1 < 0) { //make PI from -pi,pi to 0,two_pi
      this.povAngle1 = TWO_PI + this.povAngle1;
    }
    if (this.povAngle1 > TWO_PI) { //make PI from -pi,pi to 0,two_pi
      this.povAngle1 = this.povAngle1 - TWO_PI;
    }

    this.povAngle2 = this.angle + (this.pov / 2) + PI; //end of cone
    if (this.povAngle2 < 0) { //make PI from -pi,pi to 0,two_pi
      this.povAngle2 = TWO_PI + this.povAngle2;
    }
    if (this.povAngle2 > TWO_PI) { //make PI from -pi,pi to 0,two_pi
      this.povAngle2 = this.povAngle2 - TWO_PI;
    }

    //create pov rays and set their angle
    this.parentRay[k].x = this.x;
    this.parentRay[k].y = this.y;
    this.parentRay[k].povAngle1 = true;
    this.parentRay[k].povAngle2 = false;
    this.parentRay[k].calculateThisTargetBasedOnAngle(this.povAngle1);
    this.parentRay[k].update();

    //create pov rays and set their angle
    this.parentRay[k + 1].x = this.x;
    this.parentRay[k + 1].y = this.y;
    this.parentRay[k + 1].povAngle1 = false;
    this.parentRay[k + 1].povAngle2 = true;
    this.parentRay[k + 1].calculateThisTargetBasedOnAngle(this.povAngle2);
    this.parentRay[k + 1].update();

  }
  input() {
    if (keyIsDown(this.upKey)) {
      this.velX += cos(this.angle) * this.velIncrement;
      this.velY += sin(this.angle) * this.velIncrement;
    }
    if (keyIsDown(this.downKey)) {
      this.velX += cos(this.angle + PI) * this.velIncrement;
      this.velY += sin(this.angle + PI) * this.velIncrement;
    }
    if (keyIsDown(this.leftKey)) {
      this.velX += cos(this.angle - HALF_PI) * this.velIncrement;
      this.velY += sin(this.angle - HALF_PI) * this.velIncrement;
    }
    if (keyIsDown(this.rightKey)) {
      this.velX += cos(this.angle + HALF_PI) * this.velIncrement;
      this.velY += sin(this.angle + HALF_PI) * this.velIncrement;
    }


  }
  changeAngle() {
    this.angularIncrement = (this.pov / 45) + (PI/120);
    if (keyIsDown(LEFT_ARROW)) {
      this.angle -= this.angularIncrement;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.angle += this.angularIncrement;
    }
    if (this.angle < -PI) { //make pi stay within a range of two_pi
      this.angle += TWO_PI;
    }
    if (this.angle > PI) { //make pi stay within a range of two_pi
      this.angle -= TWO_PI;
    }
    if (this.angle < 0) { //make PI from -pi,pi to 0,two_pi
      this.angle = TWO_PI + this.angle;
    }

    if (keyIsDown(UP_ARROW)) {
      this.pov -= this.povIncrement;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.pov += this.povIncrement;
    }
    this.pov = constrain(this.pov, .01, TWO_PI - .01);
    // print(this.angle);
    // this.angle = atan2(mouseY - this.y, mouseX - this.x);
    // this.angle = map(mouseX,0,width,0,TWO_PI);
  }
  changePos() {
    this.velX = this.velX * this.drag;
    this.velY = this.velY * this.drag;

    this.x += this.velX;
    this.y += this.velY;
  }
  display() {
    if (twoDisplay === true){
      stroke(255);
      fill(51);
      strokeWeight(4);
      ellipse(this.x, this.y, this.radius * 2);
      line(this.x, this.y, this.x + (cos(this.angle) * this.radius), this.y + (sin(this.angle) * this.radius));
    }
  }
  selectionSort() {
    /*selectionSort parentRay array by their angles... It basically cycles through
    the array and finds the smallest value and puts it at the start of the array, then
    itterates through the array again but starts at index 1, finds the smallest value
    and puts it at index one, now it starts at index 2....
     (this really should be at least an insertion-sort algorithim because selection-sort
     always takes the same amount of calculations even if the array is already sorted,
      but it is slightly harder to implement) */
    for (let i = 0; i < this.parentRay.length; i++) {
      let smallestValue = Infinity;
      let smallestValueIndex;
      for (let j = i; j < this.parentRay.length; j++) {
        //cycle through this.parentRay[], find index of smallest value
        if (this.parentRay[j].angle < smallestValue) {
          smallestValueIndex = j;
          smallestValue = this.parentRay[j].angle;
        }
        //once at end of the arthis.parentRay, swap this.parentRay index i with smallest this.parentRay...
        if (j === this.parentRay.length - 1) {
          let parentRayStore = this.parentRay[i];
          this.parentRay[i] = this.parentRay[smallestValueIndex];
          this.parentRay[smallestValueIndex] = parentRayStore;
        }
        //then increment i and repeat until parentRay[] is sorted...
      }
    }
  }

}
