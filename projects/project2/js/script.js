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
let shapePop = 3;
let parentRay = [];
let parentRayPop = 1;
let graphicRays = [];

function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);

  for (let i = 0; i < shapePop; i++) { //set pos of vertexes
    // if (i === 0) { //make one shape the same size as the canvas
    //   shape[i] = new Shape(width / 2, height / 2, 0, 4);
    // } else {
    shape[i] = new Shape(width / 2 + (i * 40), (height / 3) * (i + .5), 3, 4);
    // }
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      shape[i].vertR[j] = 150;
      shape[i].vertAOff[j] = (((2 * PI) / shape[0].vertNumber) * j + PI / 4) + 0.0001;
      shape[0].x = width/2;
      shape[0].y = height/2;
      shape[0].vertR[j] = sqrt(sq(width/2)+sq(height/2));
      shape[0].vertAOff[j] = (PI/2*j) + (PI/4);

      shape[i].update();
      shape[i].display();


    }

    //create one parentRay for every vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j],true);
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

  //set target of every parentRay to a unique vertex in the scene
  let k = 0;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].vertNumber; j++) {
        parentRay[k].targetX = shape[i].vertX[j];
        parentRay[k].targetY = shape[i].vertY[j];
        parentRay[k].update();
      parentRay[k].display();
      k++;
    }
  }

  selectionSortparentRayAngles();

  //draw fill light
  fill(255, 255, 255, 50);
  stroke(255);
  beginShape();
  vertex(parentRay[0].x,parentRay[0].y); //origin
  for (let i = 0; i < parentRay.length; i ++){
    vertex(parentRay[i].children[0].collidedX,parentRay[i].children[0].collidedY);
    vertex(parentRay[i].collidedX,parentRay[i].collidedY);
    vertex(parentRay[i].children[1].collidedX,parentRay[i].children[1].collidedY);
  }
  vertex(parentRay[0].children[0].collidedX,parentRay[0].children[0].collidedY);
  endShape();


  //draw angles of all parentRays in the order of the arparentRay
  for (let i = 0; i < parentRay.length; i ++){
    strokeWeight(2);
    let mapColor = map(i,0,parentRay.length-1,0,255);
    noStroke();
    fill(mapColor,255-mapColor,155);
    text(parentRay[i].angle,40,40*i);
    let l1 = parentRay[i];
    stroke(mapColor,255-mapColor,155);
    line(l1.x,l1.y,l1.collidedX,l1.collidedY);
  }


  //highlight parentRays with smallest and largest angle
  strokeWeight(5);
  let l1 = parentRay[0];
  stroke(0,255,0);
  line(l1.x,l1.y,l1.collidedX,l1.collidedY);

  let l2 = parentRay[parentRay.length-1];
  stroke(255,100,100);
  line(l2.x,l2.y,l2.collidedX,l2.collidedY);

}

//selection sort algoritihim
function selectionSortparentRayAngles() {
  for (let i = 0; i < parentRay.length; i++) {
    smallestValue = Infinity;
    for (let j = i; j < parentRay.length; j++) {
      //cycle through arparentRay, find smallest value
      if (parentRay[j].angle < smallestValue) {
        smallestValueIndex = j;
        smallestValue = parentRay[j].angle;
      }
      //once at end of the arparentRay, swap parentRay index i with smallest parentRay...
      if (j === parentRay.length - 1) {
        parentRayStore = parentRay[i];
        parentRay[i] = parentRay[smallestValueIndex];
        parentRay[smallestValueIndex] = parentRayStore;
      }
      //then increment i and repeat until arparentRay is sorted...
    }
  }
}
