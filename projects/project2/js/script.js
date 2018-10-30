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
let shapePop = 5;
function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);

  for (let i = 0; i < shapePop; i++) { //set pos of vertexes
    shape[i] = new Shape((width / 2) + (100 * i), (height / 2) + (20 * i), 0, 4);
    for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
      shape[i].vertR[j] = 20;
      shape[i].vertAOff[j] = ((2*PI)/shape[0].vertNumber)*j + PI/4;
    }
  }



}

function draw() {
  background(51);
  for (let i = 0; i < shape.length; i++) { //set pos of vertexes
    shape[i].update();
    shape[i].display();
  }

}
