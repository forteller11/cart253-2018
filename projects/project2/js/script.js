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

function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);
  shape[0] = new Shape(width / 2, height / 2, 0, 4);
  for (let i = 0; i < shape[0].vertNumber; i++) { //set pos of vertexes
    shape[0].vertR[i] = 20;
    shape[0].vertAOff[i] = (PI/2*i) + PI/4;
  }



}

function draw() {
  background(51);
  shape[0].update();
  shape[0].display();

}
