/*
A light is responsble for creating a ray (which contain 2 children) for every vertex in the scene and setting
its target to that vertex, it also sets its rays' origin to its own x,y. After the
its rays' check collision with the lines it sorts the rays in an array according to
their angle. Using the sorted array Light fills ("displayFill" method) in the space between the stored collisions
of every child ray using an opacity and colour given to it by the Bulb class.
*/
class Light {
  constructor(){
    this.x;
    this.y;
    this.r;
    this.g;
    this.b;
    this.alpha;
    this.rVariation;
    this.gVariation;
    this.bVariation;

    this.parentRay = [];
    //create one parentRay for every vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        this.parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j],true);
        k++;
      }
    }
  }
  update(){
  /* set every parentRay (ray with children) target to a unique vertex in the scene,
  set its origin to the light's origin, update the ray */
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        this.parentRay[k].x = this.x;
        this.parentRay[k].y = this.y;
        this.parentRay[k].targetX = shape[i].vertX[j];
        this.parentRay[k].targetY = shape[i].vertY[j];
        this.parentRay[k].update();
        k++;
      }
    }
    this.selectionSort(); //sort the rays by their angles
    this.display(); //using data from the rays fill in a shape (this is what draws the light)
  }

  selectionSort(){
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

  display(){
    this.displayFill();
    if (debugDisplay === true){ //if debug mode is on this draws the lines of the rays
      let k = 0;
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[0].vertNumber; j++) {
          this.parentRay[k].display();
          k++
        }
      }
      ellipse(this.x,this.y,20);
    }
  }
  displayFill(){
    /*This displays the "light", it connects the dots between all the the rays,
    and then fills in the space inbetween. It starts at the ray with the smallest angle
    and works its way up to the ray with the largest angle. */
    fill(this.r,this.g,this.b,this.alpha);
    noStroke();
    beginShape();
    vertex(this.parentRay[0].x,this.parentRay[0].y); //origin
    for (let i = 0; i < this.parentRay.length; i ++){
      vertex(this.parentRay[i].children[0].collidedX,this.parentRay[i].children[0].collidedY);
      vertex(this.parentRay[i].collidedX,this.parentRay[i].collidedY);
      vertex(this.parentRay[i].children[1].collidedX,this.parentRay[i].children[1].collidedY);
    }
    vertex(this.parentRay[0].children[0].collidedX,this.parentRay[0].children[0].collidedY);
    endShape();
  }
}
