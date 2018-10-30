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
  shape[0] = new Shape(width / 2, height / 2, 4);
  for (let i = 0; i < shape[0].vertexNumber; i++) { //set pos of vertexes
    shape[0].vertX[i] = i * 50;
    shape[0].vertX[i] = i * 20;
  }

}

function draw() {


}
