class Light {
  constructor() {
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.a = 30;
    this.x = 0;
    this.y = 0;
    //initialize ray, give them each unique vertex as a target, tell them to produce children
    this.parentRay = [];
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        this.parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j], true);
        k++;
      }
    }
  }
  update() {
    // this.setOrigin();
    //set target of every this.parentRay to a unique vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        this.parentRay[k].x = this.x;
        this.parentRay[k].y = this.y;
        this.parentRay[k].targetX = shape[i].vertX[j];
        this.parentRay[k].targetY = shape[i].vertY[j];
        this.parentRay[k].update();
        this.parentRay[k].display();
        k++;
      }
      this.selectionSort();
      this.display();
    }
  }
  setOrigin() {
    this.x = mouseX;
    this.y = mouseY;
  }
  selectionSort() {
    let smallestValue;
    let smallestValueIndex;
    //selection sort algoritihim
    for (let i = 0; i < this.parentRay.length; i++) {
      smallestValue = Infinity;
      for (let j = i; j < this.parentRay.length; j++) {
        //cycle through arthis.parentRay, find smallest value
        if (this.parentRay[j].angle < smallestValue) {
          smallestValueIndex = j;
          smallestValue = this.parentRay[j].angle;
        }
        //once at end of the arthis.parentRay, swap this.parentRay index i with smallest this.parentRay...
        if (j === this.parentRay.length - 1) {
          this.parentRayStore = this.parentRay[i];
          this.parentRay[i] = this.parentRay[smallestValueIndex];
          this.parentRay[smallestValueIndex] = this.parentRayStore;
        }
        //then increment i and repeat until arthis.parentRay is sorted...
      }
    }
  }

  display() {
    //draw fill light
    fill(this.r, this.b, this.g, this.a);
    stroke(255, 255, 255, 255);
    noStroke();
    beginShape();
    // vertex(this.parentRay[0].x, this.parentRay[0].y); //origin
    for (let i = 0; i < this.parentRay.length; i++) {
          // print(this.parentRay[i].angle);
      fill(255,100,100);
      text((i*3)+0,this.parentRay[i].children[0].collidedX+15,this.parentRay[i].children[0].collidedY);
      // vertex(this.parentRay[i].children[0].collidedX, this.parentRay[i].children[0].collidedY);
      fill(100,255,100);
      text((i*3)+1,this.parentRay[i].collidedX+30,this.parentRay[i].collidedY);
      vertex(this.parentRay[i].collidedX, this.parentRay[i].collidedY);
      fill(100,100,255);
      print(this.parentRay[i].children[1].collidedY);
      // text((i*3)+2,this.parentRay[i].children[1].collidedX+45,this.parentRay[i].children[1].collidedY);
      // vertex(this.parentRay[i].children[1].collidedX, this.parentRay[i].children[1].collidedY);
      fill(this.r, this.b, this.g, this.a);
    }
    // vertex(this.parentRay[0].children[0].collidedX, this.parentRay[0].children[0].collidedY);
    endShape();
  }


}
