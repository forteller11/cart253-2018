class Player {
  constructor(x, y, angle) {
    this.upKey = 87;
    this.downKey = 83;
    this.leftKey = 65;
    this.rightKey = 68;
    this.threeDisplay = true; //whether to visualize pseudo3D
    this.x = x;
    this.y = y;
    this.k = 0;

    this.angle = angle;
    this.angularIncrement = PI / 30;

    this.vel = 0;
    this.velX = 0;
    this.velY = 0;
    this.drag = 0.95;
    this.velIncrement = 1;
    this.pov = TWO_PI; //angle of perspective
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
    this.parentRay[k] = new Ray(1, 1, true);
    this.parentRay[k + 1] = new Ray(1, 1, true);

  }
  update() {
    this.changeAngle();
    this.input();
    this.changePos();

    this.updateRays();
    this.selectionSort();
    if (this.threeDisplay === true) {
      this.visualizeRays();
    }
    this.display();

  }

  visualizeRays() {
    /*This displays the "light", it connects the dots between all the the rays,
    and then fills in the space inbetween. It starts at the ray with the smallest angle
    and works its way up to the ray with the largest angle. */

    let angleDiffNet = 0;
    let fadeHeightDist = width; //dist from player to wall at which wall is height 0
    let maxHeight = height / 2; //what height is wall when player is on top of wall

    // let wHist = round(map(this.angle, -PI, PI, width, 0));
    // wHist = wHist + width / 2;
    // if (wHist > width) {
    //   wHist = wHist - width;
    // }
    let wHist = 0;
let index = 0;
// print(this.parentRay);
while (this.parentRay[index].povAngle1 === false){
  index++;
}
  print("startingI: "+index);
  print("length of array: "+this.parentRay.length);
    while ( (this.parentRay[index].povAngle2 === false) ) {
      print("loop");
        index++;

        if (index >= this.parentRay.length){
          index = 0;
        }

      //   let v0 = this.parentRay[index].children[0];
      //   let v1 = this.parentRay[index];
      //   let v2 = this.parentRay[index].children[1];
      //   let v3 = this.parentRay[index + 1].children[0];
      //   index++;
      //
      //
      // let aDiff0 = v1.angle - v0.angle;
      // let aDiff1 = v2.angle - v1.angle;
      // let aDiff2 = v3.angle - v2.angle;
      //
      // let hBase = height / 2;
      // let hTune = 1;
      // let dist0 = map(v0.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      // dist0 = constrain(dist0, 0, height);
      // let dist1 = map(v1.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      // dist1 = constrain(dist1, 0, height);
      // let dist2 = map(v2.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      // dist2 = constrain(dist2, 0, height);
      // let dist3 = map(v3.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      // dist3 = constrain(dist3, 0, height);
      //
      // let hOff0 = (dist0 * v1.collidedH) * hTune;
      // let hOff1 = (dist1 * v1.collidedH) * hTune;
      // let hOff2 = (dist2 * v1.collidedH) * hTune;
      // let hOff3 = (dist3 * v1.collidedH) * hTune;
      //
      // let opacityFill = map((v1.collidedRad), 0, fadeHeightDist, 255, 0);
      // let w0 = map(aDiff0, 0, this.pov, 0, width);
      // let w1 = map(aDiff1, 0, this.pov, 0, width);
      // let w2 = map(aDiff2, 0, this.pov, 0, width);
      // // rect(wHist, hBase+hOff1, wHist + w, hBase-hOff1);
      // fill(v1.collidedR, v1.collidedG, v1.collidedB, opacityFill);
      // let sW = map((v1.collidedRad), 0, fadeHeightDist, width / 500, width / 1500);
      // strokeWeight(sW);
      // stroke(v1.collidedR, v1.collidedG, v1.collidedB, 255);
      // beginShape();
      // vertex(wHist, hBase - hOff0); //topleft
      // vertex(wHist + w0, hBase - hOff1);
      // vertex(wHist + w0 + w1, hBase - hOff2);
      // vertex(wHist + w0 + w1 + w2, hBase - hOff3); //topright
      // vertex(wHist + w0 + w1 + w2, hBase + hOff3); //botright
      // vertex(wHist + w0 + w1, hBase + hOff2);
      // vertex(wHist + w0, hBase + hOff1);
      // vertex(wHist, hBase + hOff0); //botleft
      // endShape();
      // wHist += w0 + w1 + w2;

    }
    print('OUT');
    // let iFinal = this.parentRay.length - 1;
    // let v0 = this.parentRay[iFinal].children[0];
    // let v1 = this.parentRay[iFinal];
    // let v2 = this.parentRay[iFinal].children[1];
    // let v3 = this.parentRay[0].children[0];
    //
    // let aDiff0 = v1.angle - v0.angle;
    // let aDiff1 = v2.angle - v1.angle;
    // let aDiff2 = (v3.angle + TWO_PI) - v2.angle;
    //
    // let hBase = height / 2;
    // let hTune = 1;
    // let dist0 = map(v0.collidedRad, 0, fadeHeightDist, maxHeight, 0);
    // dist0 = constrain(dist0, 0, height);
    // let dist1 = map(v1.collidedRad, 0, fadeHeightDist, maxHeight, 0);
    // dist1 = constrain(dist1, 0, height);
    // let dist2 = map(v2.collidedRad, 0, fadeHeightDist, maxHeight, 0);
    // dist2 = constrain(dist2, 0, height);
    // let dist3 = map(v3.collidedRad, 0, fadeHeightDist, maxHeight, 0);
    // dist3 = constrain(dist3, 0, height);
    //
    // let hOff0 = (dist0 * v1.collidedH) * hTune;
    // let hOff1 = (dist1 * v1.collidedH) * hTune;
    // let hOff2 = (dist2 * v1.collidedH) * hTune;
    // let hOff3 = (dist3 * v1.collidedH) * hTune;
    //
    // let opacityFill = map((v1.collidedRad), 0, width, 255, 0);
    // let w0 = map(aDiff0, 0, TWO_PI, 0, width);
    // let w1 = map(aDiff1, 0, TWO_PI, 0, width);
    // let w2 = map(aDiff2, 0, TWO_PI, 0, width);
    // // rect(wHist, hBase+hOff1, wHist + w, hBase-hOff1);
    // fill(v1.collidedR, v1.collidedG, v1.collidedB, opacityFill)
    // beginShape();
    //
    // vertex(wHist, hBase - hOff0); //topleft
    // vertex(wHist + w0, hBase - hOff1);
    // vertex(wHist + w0 + w1, hBase - hOff2);
    // vertex(wHist + w0 + w1 + w2, hBase - hOff3); //topright
    // vertex(wHist + w0 + w1 + w2, hBase + hOff3); //botright
    // vertex(wHist + w0 + w1, hBase + hOff2);
    // vertex(wHist + w0, hBase + hOff1);
    // vertex(wHist, hBase + hOff0); //botleft
    // endShape();
    // wHist += w0 + w1 + w2;
    //connect last to first
    // let v1 = this.parentRay[0];
    // let v2 = this.parentRay[this.parentRay.length - 1];
    // let aDiff = TWO_PI - (v2.angle - v1.angle);
    // // print("heyy" + aDiff);
    // let w = map(aDiff, 0, TWO_PI, 0, width);
    // rectMode(CORNERS);
    // fill(0);
    // rect(wHist, 50, wHist + w, 100);
    // print("angleDif: w" + angleDiffNet);


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
    this.parentRay[k].calculateThisTargetBasedOnAngle(this.povAngle1);
    this.parentRay[k].update();

    //create pov rays and set their angle
    this.parentRay[k + 1].x = this.x;
    this.parentRay[k + 1].y = this.y;
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
    this.pov = constrain(this.pov, .01, TWO_PI);
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
    stroke(255);
    fill(51);
    strokeWeight(4);
    ellipse(this.x, this.y, this.radius * 2);
    line(this.x, this.y, this.x + (cos(this.angle) * this.radius), this.y + (sin(this.angle) * this.radius));
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
