class Player {
  constructor(x, y, angle) {
    this.upKey = 87;
    this.downKey = 83;
    this.leftKey = 65;
    this.rightKey = 68;
    this.x = x;
    this.y = y;

    this.angle = angle;
    this.angularIncrement = PI/30;

    this.vel = 0;
    this.velX = 0;
    this.velY = 0;
    this.drag = 0.95;
    this.velIncrement = 1;

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
  }
  update(){
    this.changeAngle();
    this.input();
    this.changePos();

    this.updateRays();
    this.selectionSort();
    this.visualizeRays();
    this.display();

  }

  visualizeRays(){
    /*This displays the "light", it connects the dots between all the the rays,
    and then fills in the space inbetween. It starts at the ray with the smallest angle
    and works its way up to the ray with the largest angle. */
    fill(255,255,255,100);
    stroke(255,0,255);
    beginShape();
    let widthHistory = 0;
    let angleDiffNet = 0;
    vertex(this.parentRay[0].x, this.parentRay[0].y); //origin
    for (let i = 1; i < this.parentRay.length; i++) {
      let vPrev = this.parentRay[i-1]
      let v = this.parentRay[i];
      // print(v.angle);
      let distFill = (255/v.collidedR) * 100;
      let distHeight = map(v.collidedR,0,width,height/2,0);
      distHeight = constrain(distHeight,0,height);
      let angleDiff = (v.angle)-(vPrev.angle);
      let w = map(angleDiff,0,TWO_PI,0,width);
      // print(((v.angle-player.angle)-(vPrev.angle-player.angle)));
      fill(distFill,distFill,distFill,40);
      widthHistory += w;
      angleDiffNet += abs((v.angle)-(vPrev.angle));
      //pick mode of display
      rect(widthHistory,(height/2),widthHistory+w,(height/2));

    }
    // print("angleDif: w" + angleDiffNet);
    vertex(this.parentRay[0].children[0].collidedX, this.parentRay[0].children[0].collidedY);
    endShape();

  }
  updateRays(){
    /* set every parentRay (ray with children) target to a unique vertex in the scene,
    set its origin to the light's origin, update the ray */
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].vertNumber; j++) {
        this.parentRay[k].x = this.x;
        this.parentRay[k].y = this.y;
        this.parentRay[k].targetX = shape[i].vertX[j];
        this.parentRay[k].targetY = shape[i].vertY[j];
        this.parentRay[k].update();
        k++;
      }
    }
  }
   input() {
      if (keyIsDown(this.upKey)) {
        this.velX += cos(this.angle)*this.velIncrement;
        this.velY += sin(this.angle)*this.velIncrement;
      }
      if (keyIsDown(this.downKey)) {
        this.velX += cos(this.angle+PI)*this.velIncrement;
        this.velY += sin(this.angle+PI)*this.velIncrement;
      }
      if (keyIsDown(this.leftKey)) {
        this.velX += cos(this.angle-HALF_PI)*this.velIncrement;
        this.velY += sin(this.angle-HALF_PI)*this.velIncrement;
      }
      if (keyIsDown(this.rightKey)) {
        this.velX += cos(this.angle+HALF_PI)*this.velIncrement;
        this.velY += sin(this.angle+HALF_PI)*this.velIncrement;
      }

}
changeAngle(){
  this.angle = atan2(mouseY-this.y,mouseX-this.x);
  // this.angle = map(mouseX,0,width,0,TWO_PI);
}
changePos(){
  this.velX = this.velX * this.drag;
  this.velY = this.velY * this.drag;

  this.x += this.velX;
  this.y += this.velY;
}
  display(){
    stroke(255);
    fill(51);
    strokeWeight(4);
    ellipse(this.x,this.y,this.radius*2);
    line(this.x,this.y,this.x+(cos(this.angle)*this.radius),this.y+(sin(this.angle)*this.radius));
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
