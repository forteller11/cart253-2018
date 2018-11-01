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
let shapePop = 1;
let ray = [];
let rayPop = 1;
let angle = .1;

function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);

  for (let i = 0; i < shapePop; i++) { //set pos of vertexes
    // if (i === 0) { //make one shape the same size as the canvas
    //   shape[i] = new Shape(width / 2, height / 2, 0, 4);
    // } else {
    shape[i] = new Shape(width / 2 + (i * 40), (height / 3) * (i + .5), 0, 4);
    // }
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      shape[i].vertR[j] = 100;
      shape[i].vertAOff[j] = ((2 * PI) / shape[0].vertNumber) * j + PI / 4 + angle;
      // if (i === 0) { //make one shape the same size as the canvas
      //   shape[i].vertR[j] = sqrt(sq(width / 2) + sq(height / 2));
      //   shape[i].vertAOff[j] = ((PI / 2) * j) + PI / 4;
      // }

      shape[i].update();
      shape[i].display();


    }


    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        ray[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j]);
        k++;
      }
    }
  }




}

function draw() {
  angle += 0.001;
  background(51);
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


  let k = 0;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].vertNumber; j++) {
      ray[k].targetX = shape[i].vertX[j];
      ray[k].targetY = shape[i].vertY[j];
      ray[k].update();
      ray[k].display();
      k++;
    }
  }
  selectionSortRayAngles();


  // fill(255, 255, 255, 50);
  // stroke(255);
  // beginShape();
  // vertex(ray[0].x,ray[0].y);
  // for (let i = 0; i < ray.length; i ++){
  //   vertex(ray[0].x,ray[0].y);
  //   vertex(ray[i].collidedX,ray[i].collidedY);
  // }
  // endShape(CLOSE);

  let l1 = ray[0];
  stroke(100,100,255);
  line(l1.x,l1.y,l1.collidedX,l1.collidedY);

  let l2 = ray[ray.length-1];
  stroke(0,255,0);
  line(l2.x,l2.y,l2.collidedX,l2.collidedY);

}

//selection sort algoritihim
function selectionSortRayAngles() {
  for (let i = 0; i < ray.length; i++) {
    smallestValue = Infinity;
    for (let j = i; j < ray.length; j++) {
      //cycle through array, find smallest value
      if (ray[j].angle < smallestValue) {
        smallestValueIndex = j;
        smallestValue = ray[j].angle;
      }
      //once at end of the array, swap ray index i with smallest ray...
      if (j === ray.length - 1) {
        rayStore = ray[i];
        ray[i].angle = smallestValue;
        ray[smallestValueIndex] = rayStore;
      }
      //then increment i and repeat until array is sorted...
    }
  }
}
