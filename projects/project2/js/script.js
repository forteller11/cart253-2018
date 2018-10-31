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
let ray = [];
let rayPop = 1;
let angle = .1;
function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);

  for (let i = 0; i < shapePop; i++) { //set pos of vertexes
    shape[i] = new Shape(width/2 + (i*40), (height/3)*(i+.5), 0, 4);
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      shape[i].vertR[j] = 40;
      shape[i].vertAOff[j] = ((2*PI)/shape[0].vertNumber)*j + PI/4+angle;
    }

    for (let i = 0; i < rayPop; i ++){
      ray[i] = new Ray();
    }
    // for (let i = 0; i < shape.length; i ++){
      for (let j = 0; j < shape[i].vertX.length; j ++){
        ray[j] = new Ray();
        ray[j].targetX = shape[0].vertX[j];
        ray[j].targetY = shape[0].vertY[j];

      }
    // }

  }



}

function draw() {
  angle += 0.001;
  background(51);
  for (let i = 0; i < shape.length; i++) { //set pos of vertexes
    shape[i].update();
    shape[i].display();
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      // shape[i].vertAOff[j] += random(-.01,.01);
      // shape[i].vertR[j] += random(-1,1);
    }
  }
  for (let i = 0; i < ray.length; i++) { //set pos of vertexes
    ray[i].update();
    ray[i].display();
  }

}
