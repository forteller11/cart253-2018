class Player {
  constructor(x, y, angle) {

    this.upKey = 87;
    this.downKey = 83;
    this.leftKey = 65;
    this.rightKey = 68;
    //whether to visualize pseudo3D
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.updateListener();
    this.angularIncrement = (this.fov / 30) + (PI / 60);

    this.vel = 0;
    this.velX = 0;
    this.velY = 0;
    this.drag = 0.95; //multiplies velocities by drag every frame
    this.velIncrement = 65; //the magnitude of the vector to add to the x,y componenets (velx,velly) on input
    this.fov = PI + 0.0001; //field of view
    this.fovIncrement = 0.08;
    this.fovAngle1; //starting angle of fov
    this.fovAngle2; //end angle of fov
    this.radius = 20; //for display purposes only

    this.parentRay = [];
    //create one parentRay for every vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].vertNumber; j++) {
        this.parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j], true);
        k++;
      }
    }
    //create two extra rays to be used to designate the beginning and end of the FOV.
    this.parentRay[k] = new Ray(100, 100, true);
    this.parentRay[k + 1] = new Ray(100, 100, true);

  }
  update() {
    this.changeAngle();
    this.input();
    this.changePos();
    this.updateRays();
    this.selectionSort(); //old method
    if (threeDisplay === true) {
      this.visualizeRays();
    }
    if (twoDisplay === true) {
      this.display();
    }
    this.updateListener();

  }

  changeAngle() {
    //make the increment of the angle increase as fov increases
    this.angularIncrement = (this.fov / 45) + (PI / 120);
    //turn counterclockwise
    if (keyIsDown(LEFT_ARROW)) {
      this.angle -= this.angularIncrement;
    }
    //turn clockwise
    if (keyIsDown(RIGHT_ARROW)) {
      this.angle += this.angularIncrement;
    }
    if (this.angle < -PI) { //make angle stay within a range of -pi to pi (wraps the value)
      this.angle += TWO_PI;
    }
    if (this.angle > PI) { //make angle stay within a range of -pi to pi (wraps the value)
      this.angle -= TWO_PI;
    }
    if (this.angle < 0) { //make angle from a range of -pi to pi to 0 to two_pi
      this.angle = TWO_PI + this.angle;
    }

    if (keyIsDown(UP_ARROW)) { //decrease fov
      this.fov -= this.fovIncrement;
    }
    if (keyIsDown(DOWN_ARROW)) { //increase fov
      this.fov += this.fovIncrement;
    }
    //make sure fov stays within 0 to two_pi, and that fov is never perfectly two_pi or 0 (because that would cause bugs)
    this.fov = constrain(this.fov, .01, TWO_PI - .01);
  }

  input() {
    if (keyIsDown(this.upKey)) { //add a vector in direction player is facing to the player's x,y velocity.
      this.velX += cos(this.angle) * this.velIncrement;
      this.velY += sin(this.angle) * this.velIncrement;
    }
    if (keyIsDown(this.downKey)) { //add a vector in the opposite direction the player is facing to the player's x,y velocity.
      this.velX += cos(this.angle + PI) * this.velIncrement;
      this.velY += sin(this.angle + PI) * this.velIncrement;
    }
    if (keyIsDown(this.leftKey)) { //add a vector to the left of the direction the player is facing to the player's x,y velocity.
      this.velX += cos(this.angle - HALF_PI) * this.velIncrement;
      this.velY += sin(this.angle - HALF_PI) * this.velIncrement;
    }
    if (keyIsDown(this.rightKey)) { //add a vector to the right of the direction the player is facing to the player's x,y velocity.
      this.velX += cos(this.angle + HALF_PI) * this.velIncrement;
      this.velY += sin(this.angle + HALF_PI) * this.velIncrement;
    }
  }

  changePos() {
    //apply drag to velocitieS
    this.velX = this.velX * this.drag;
    this.velY = this.velY * this.drag;
    //add velocity to position
    this.x += this.velX;
    this.y += this.velY;
  }

  updateRays() {
    /* set every parentRay (ray with children) target to a unique vertex in the scene,
    set its origin to the light's origin, update the ray */
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].vertNumber; j++) {
        this.parentRay[k].x = this.x; //set origin of ray
        this.parentRay[k].y = this.y;
        this.parentRay[k].targetX = shape[i].vertX[j]; //set target of ray
        this.parentRay[k].targetY = shape[i].vertY[j];
        this.parentRay[k].fovAngle1 = false; //you're not an ray representing the start of the fov
        this.parentRay[k].fovAngle2 = false; //you're not an ray representing the end of the fov
        this.parentRay[k].update(); //check collision with all lines in the scene
        k++;
      }
    }
    //set the two remaining rays (because there are 2 more than their are verts in the scene)
    //to be the min and max angle of the fov
    this.fovAngle1 = this.angle - (this.fov / 2) + PI; //start of fov;
    if (this.fovAngle1 < 0) { //wrap the angle around back to two_pi if the rays angle becomes less than 0
      this.fovAngle1 = TWO_PI + this.fovAngle1;
    }
    if (this.fovAngle1 > TWO_PI) { //wrap the ray angle around it goes beyond two_pi
      this.fovAngle1 = this.fovAngle1 - TWO_PI;
    }

    this.fovAngle2 = this.angle + (this.fov / 2) + PI; //end of cone
    if (this.fovAngle2 < 0) { //wrap the angle around back to two_pi if the rays angle becomes less than 0
      this.fovAngle2 = TWO_PI + this.fovAngle2;
    }
    if (this.fovAngle2 > TWO_PI) { //wrap the ray angle around it goes beyond two_pi
      this.fovAngle2 = this.fovAngle2 - TWO_PI;
    }
    //set vars of ray representing start of fov


    this.parentRay[k].x = this.x; //origin
    this.parentRay[k].y = this.y;
    this.parentRay[k].calculateThisTargetBasedOnAngle(this.fovAngle1); //polar to cartesian determination of target
    this.parentRay[k].fovAngle1 = true; //tell it that it's the start of the fov
    this.parentRay[k].fovAngle2 = false;
    this.parentRay[k].update(); //check collision with all lines in the scene
    //set vars of ray representing end start of fov
    this.parentRay[k + 1].x = this.x; //origin
    this.parentRay[k + 1].y = this.y;
    this.parentRay[k + 1].calculateThisTargetBasedOnAngle(this.fovAngle2); //polar to cartesian determination of target
    this.parentRay[k + 1].fovAngle1 = false;
    this.parentRay[k + 1].fovAngle2 = true; //tell it that it's the end of the fov
    this.parentRay[k + 1].update(); //check collision with all lines in the scene

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

  visualizeRays() {
    /*This displays the "light", it connects the dots between all the the rays,
    and then fills in the space inbetween. It starts at the ray with the smallest angle
    and works its way up to the ray with the largest angle. */


    //dist from player to wall at which wall is minHeight
    let maxHeight = height / 1.9; //what height is wall when player is on top of wall
    let minHeight = height / 400; //min height of wall when player dist from wall is larger than fadeHeightDist
    let horizon = height / 2; //where the horizon line is on the screen
    let maxStroke = width / 300;
    let minStroke = width / 300;

    let wHist = 0;
    let index = 0;
    // cycle through array of rays until you find the ray designated as the start of the fov
    while (this.parentRay[index].fovAngle1 === false) {
      index++;
    }
    //cycle through array (wrapping if need be) and draw rays until you find the ray designated as the end of the fov
    while (this.parentRay[index].fovAngle2 === false) {
      //v0-ray3 will be a shorthand for rays
      let ray0;
      let ray1;
      let ray2;
      let ray3;

      let angleDiff0;
      let angleDiff1;
      let angleDiff2;
      if (index < this.parentRay.length - 1) { // if the loop DOESNT wrap the next itteration
        //set ids so that as ray# increases so do the rays' angle
        ray0 = this.parentRay[index].children[0];
        ray1 = this.parentRay[index];
        ray2 = this.parentRay[index].children[1];
        ray3 = this.parentRay[index + 1].children[0];
        //calculate the difference in angle between each ray and its neighbors
        angleDiff0 = ray1.angle - ray0.angle;
        angleDiff1 = ray2.angle - ray1.angle;
        angleDiff2 = ray3.angle - ray2.angle;
      } else { //will the loop wrap next itteration
        //set ids so that the ray with the largest angle (ray0,1,2) connect to the ray with the smallest angle (ray3)
        let iFinal = this.parentRay.length - 1;
        ray0 = this.parentRay[iFinal].children[0];
        ray1 = this.parentRay[iFinal];
        ray2 = this.parentRay[iFinal].children[1];
        ray3 = this.parentRay[0].children[0];
        //calculate the difference in angle between each ray and its neighbors
        angleDiff0 = (ray1.angle - ray0.angle);
        angleDiff1 = (ray2.angle - ray1.angle);
        //account for the fact that 2PI and 0 should be treated as the same angle
        angleDiff2 = ((ray3.angle + TWO_PI) - ray2.angle);
      }

      //itterate through the array (for Loop style)
      index++;
      if (index >= this.parentRay.length) { //once index is past the length of the array, wrap
        index = 0;
      }

      if (debugDisplay === true) { //draw all rays falling with the fov in red-orange
        stroke(255, 100, 0, 150);
        strokeWeight(3);
        line(ray1.x - (player.x) + width / 2, ray1.y - player.y + (height / 2), ray1.targetX - player.x + (width / 2), ray1.targetY - player.y + (height / 2));
      }

      //base height of wall, ramps from min height to max height depending on ray's collision's dist from player.
      let baseH0 = map(ray0.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      baseH0 = constrain(baseH0, minHeight, height);
      let baseH1 = map(ray1.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      baseH1 = constrain(baseH1, minHeight, height);
      let baseH2 = map(ray2.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      baseH2 = constrain(baseH2, minHeight, height);
      let baseH3 = map(ray3.collidedRad, 0, fadeHeightDist, maxHeight, 0);
      baseH3 = constrain(baseH3, minHeight, height);
      //ceiling height of wall is the base height * the dynamic height of the line on collision
      let ceilH0 = (baseH0 * ray0.collidedH);
      let ceilH1 = (baseH1 * ray1.collidedH);
      let ceilH2 = (baseH2 * ray2.collidedH);
      let ceilH3 = (baseH3 * ray3.collidedH);
      //is 0 when the player is at fadeHeightDist, multiplying the colors, creating pure black sillhouettes
      let colorMultiplier = map((ray1.collidedRad), 0, fadeHeightDist, 1.5, 0);
      let opacityFade = map(ray1.collidedRad, fadeHeightDist, despawnDist * .95, 1, 0);
      opacityFade = constrain(opacityFade, 0, 255);
      //calcs horizontal width that should be given between each ray so that the rays and in the fov
      //are drawn to take up exactly the canvas width;
      let w0 = map(angleDiff0, 0, this.fov, 0, width);
      let w1 = map(angleDiff1, 0, this.fov, 0, width) + w0;
      let w2 = map(angleDiff2, 0, this.fov, 0, width) + w1;
      //take on color of the line which the ray collided with, also fill it with black as the ray is furthur away from the player
      fill(ray1.collidedR * colorMultiplier, ray1.collidedG * colorMultiplier, ray1.collidedB * colorMultiplier, ray1.collidedAlpha * opacityFade);
      // let sW = map((ray1.collidedRad), 0, fadeHeightDist, maxStroke, minStroke);
      // strokeWeight(sW);
      // stroke(ray1.collidedR, ray1.collidedG, ray1.collidedB, 255);

      //draw the shape from each vert using the differences in width

      noStroke();
      beginShape();
      vertex(wHist, horizon - ceilH0); //topleft
      vertex(wHist + w0, horizon - ceilH1); //topmiddle
      vertex(wHist + w1, horizon - ceilH2); //top right
      vertex(wHist + w1, horizon + baseH1); //bot right
      vertex(wHist + w0, horizon + baseH2); //bot middle
      vertex(wHist, horizon + baseH0); //botleft
      endShape();

      // sW = map((ray3.collidedRad), 0, fadeHeightDist, maxStroke, minStroke);
      // strokeWeight(sW);
      // stroke(ray3.collidedR, ray3.collidedG, ray3.collidedB, 255);
      noStroke();
      //take on color of the line which the ray collided with, also fill it with black as the ray is furthur away from the player
      colorMultiplier = map((ray3.collidedRad), 0, fadeHeightDist, 1.5, 0)
      fill(ray2.collidedR * colorMultiplier, ray2.collidedG * colorMultiplier, ray2.collidedB * colorMultiplier, ray2.collidedAlpha * opacityFade);
      beginShape();
      vertex(wHist + w1, horizon - ceilH2); //top left
      vertex(wHist + w2, horizon - ceilH3); //topright
      vertex(wHist + w2, horizon + baseH3); //bot right
      vertex(wHist + w1, horizon + baseH2); //bot left
      endShape();

      if (ray3.collidedRad < fadeHeightDist) { //only draw lines if not 100% a silloette (optimisation)
        stroke(bgR * colorMultiplier, bgG * colorMultiplier, bgB * colorMultiplier, ray2.collidedAlpha * opacityFade);
        let strokeWidth = map(ray3.collidedRad, 0, fadeHeightDist, 3, 0);
        let lerpAmount = .01;
        const stripeNumber = 15;
        // console.log(ray1.collidedH.length);
        // console.log(ray1.collidedStripeW);
        for (let k = 0; k < ray2.collidedStripeH.length; k++) {
          let strokeWidth = map(ray2.collidedRad, 0, fadeHeightDist, ray2.collidedStripeW[k], 0);
          strokeWidth = constrain(strokeWidth, 0, ray2.collidedStripeW[k] * opacityFade);
          strokeWeight(strokeWidth);
          const h0 = lerp(horizon + baseH0, horizon - ceilH0, ray2.collidedStripeH[k]);
          const h1 = lerp(horizon + baseH1, horizon - ceilH1, ray2.collidedStripeH[k]);
          const h2 = lerp(horizon + baseH2, horizon - ceilH2, ray2.collidedStripeH[k]);
          const h3 = lerp(horizon + baseH3, horizon - ceilH3, ray2.collidedStripeH[k]);
          // line(wHist+.0,h0,wHist+w0,h1);
          // line(wHist+w0,h1,wHist+w1,h2);
          line(wHist + w1, h2, wHist + w2, h3);
        }
      }

      wHist += w0 + w1 + w2;
    }
  }

  updateListener() {
    // let orient = map(this.angle,0,TWO_PI,-1,1);
    const ang = this.angle;
    let orient1 = sin(ang);
    let orient2 = cos(ang);
    // console.log("angle:"+round(this.angle*100)/100);
    // console.log("orient1:"+round(orient1*100)/100);
    // console.log("orient2:"+round(orient2*100)/100);
    audioCtx.listener.setPosition(this.x, this.y, zPlane);
    audioCtx.listener.setOrientation(-orient2, -orient1, 0, 0, 0, 1);
    // audioCtx.listener.positionX.value = this.x;
    // audioCtx.listener.positionZ.value = this.y;
    // audioCtx.listener.positionY.value = zPlane;
    // audioCtx.listener.upX.value = 0;
    // audioCtx.listener.upY.value = this.angle;
    // audioCtx.listener.upZ.value = 0;
  }

  display() { //display the player's position and direction (angle) on the canvas
    stroke(255);
    fill(51);
    strokeWeight(4);
    ellipse(this.x - this.x + (width / 2), this.y - this.y + (height / 2), this.radius * 2);
    //line to show direction
    line(width / 2, height / 2, width / 2 + (cos(this.angle) * this.radius), height / 2 + (sin(this.angle) * this.radius));
  }
}
