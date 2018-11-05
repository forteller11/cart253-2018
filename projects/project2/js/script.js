
/*
Charly Yan Miller
Project 2
2D pong with lights


Credits:
Used developer Nick Liow's toturial on 2D ray casting/lighting "Sight and Light"
(no pseudo-code was copied)
https://ncase.me/sight-and-light/

Used a series of Khan academy's toturials by Salman Khan's on parametric lines
https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/vectors/v/linear-algebra-parametric-representations-of-lines
https://www.khanacademy.org/math/ap-calculus-bc/bc-advanced-functions-new/bc-9-1/v/parametric-equations-1
https://www.youtube.com/watch?v=qksmRZNaqJY
*/
let shape = [];
let shapePop = 2;
let parentRay = [];
let parentRayPop = 1;
let graphicRays = [];
let light;
function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);

  for (let i = 0; i < shapePop; i++) { //set pos of vertexes
    // if (i === 0) { //make one shape the same size as the canvas
    //   shape[i] = new Shape(width / 2, height / 2, 0, 4);
    // } else {
    shape[i] = new Shape(width/2, (i)*height/2, 3, 4);
    // }
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      shape[i].vertR[j] = random(40,140);
      shape[i].vertAOff[j] = (((2 * PI) / shape[0].vertNumber) * j + PI / 4) + 0.0001;
      shape[0].x = width/2;
      shape[0].y = height/2;
      shape[0].vertR[j] = sqrt(sq(width/2)+sq(height/2));
      shape[0].vertAOff[j] = (PI/2*j) + (PI/4);

      shape[i].update();
      shape[i].display();


    }
    light = new Light();

    //create one parentRay for every vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        light.parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j],true);
        k++;
      }
    }
  }




}

function draw() {
  background(51);
  //update position and display of shapes/vertexes/lines
  for (let i = 0; i < shape.length; i++) { //set pos of vertexes
    shape[i].update();
    shape[i].display();
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      if (i > 0) {
        // shape[i].vertAOff[j] += random(-.01,.01);
        // shape[i].vertR[j] += random(-1,1);
      }
    }
  }

  //set target of every light.parentRay to a unique vertex in the scene
  let k = 0;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].vertNumber; j++) {
      light.parentRay[k].targetX = shape[i].vertX[j];
      light.parentRay[k].targetY = shape[i].vertY[j];
      light.parentRay[k].update();
      light.parentRay[k].display();
      k++;
    }
  }
  // light.update();
  // // GRADIANT TEST
  // for (let i = width; i > 0; i --){
  //   noStroke();
  //   let colorRamp = map(i,0,width,255,0);
  //   fill(colorRamp);
  //   ellipse(mouseX,mouseY,i);
  // }
  selectionSortparentRayAngles();
  //draw fill light
  fill(255, 255, 255, 100);
  stroke(255,255,255,255);
  beginShape();
  vertex(light.parentRay[0].x,light.parentRay[0].y); //origin
  for (let i = 0; i < light.parentRay.length; i ++){
    vertex(light.parentRay[i].children[0].collidedX,light.parentRay[i].children[0].collidedY);
    vertex(light.parentRay[i].collidedX,light.parentRay[i].collidedY);
    vertex(light.parentRay[i].children[1].collidedX,light.parentRay[i].children[1].collidedY);
  }
  vertex(light.parentRay[0].children[0].collidedX,light.parentRay[0].children[0].collidedY);
  endShape();

}

//selection sort algoritihim
function selectionSortparentRayAngles() {
  for (let i = 0; i < light.parentRay.length; i++) {
    let smallestValue = Infinity;
    let smallestValueIndex;
    for (let j = i; j < light.parentRay.length; j++) {
      //cycle through arlight.parentRay, find smallest value
      if (light.parentRay[j].angle < smallestValue) {
        smallestValueIndex = j;
        smallestValue = light.parentRay[j].angle;
      }
      //once at end of the arlight.parentRay, swap light.parentRay index i with smallest light.parentRay...
      if (j === light.parentRay.length - 1) {
        let parentRayStore = light.parentRay[i];
        light.parentRay[i] = light.parentRay[smallestValueIndex];
        light.parentRay[smallestValueIndex] = parentRayStore;
      }
      //then increment i and repeat until arparentRay is sorted...
    }
  }
}
