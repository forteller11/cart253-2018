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
let ray = [];
let rayPop = 1;
let angle = .1;
function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);

  for (let i = 0; i < shapePop; i++) { //set pos of vertexes
    if (i === 0){ //make one shape the same size as the canvas
      shape[i] = new Shape(width/2, height/2, 0, 4);
    } else {
      shape[i] = new Shape(width/2 + (i*40), (height/3)*(i+.5), 0, 4);
    }
      for (let j = 0; j < shape[0].vertNumber; j++) { //set pos of vertexes
        shape[i].vertR[j] = 100;
        shape[i].vertAOff[j] = ((2*PI)/shape[0].vertNumber)*j + PI/4+angle;
        if (i === 0){ //make one shape the same size as the canvas
          shape[i].vertR[j] = sqrt(sq(width/2)+sq(height/2));
          shape[i].vertAOff[j] = ((PI/2)*j)+PI/4;
        }

        shape[i].update();
        shape[i].display();


    }


    let k = 0;
     for (let i = 0; i < shape.length; i ++){
      for (let j = 0; j < shape[0].vertNumber; j ++){
        k+=3;
        ray[k] = new Ray(shape[i].vertX[j],shape[i].vertY[j]);
        ray[k+1] = new Ray(shape[i].vertX[j]+1,shape[i].vertY[j]+1);
        ray[k+2] = new Ray(shape[i].vertX[j]-1,shape[i].vertY[j]-1);
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
      if (i > 0 ){
        // shape[i].vertAOff[j] += random(-.01,.01);
        // shape[i].vertR[j] += random(-1,1);
      }
    }
  }


  let k = 0;
   for (let i = 0; i < shape.length; i ++){
    for (let j = 0; j < shape[0].vertNumber; j ++){
      k+=3;
      ray[k].targetX = shape[i].vertX[j];
      ray[k].targetY = shape[i].vertY[j];
      ray[k].update();
      ray[k].display();
      ray[k+1].targetX = shape[i].vertX[j]+1;
      ray[k+1].targetY = shape[i].vertY[j]+1;
      ray[k+1].update();
      ray[k+1].display();
      ray[k+2].targetX = shape[i].vertX[j]-1;
      ray[k+2].targetY = shape[i].vertY[j]-1;
      ray[k+2].update();
      ray[k+2].display();
    }
   }

fill(255,255,255,50);
   beginShape();
     k = 0;
      for (let i = 0; i < shape.length; i ++){
       for (let j = 0; j < shape[0].vertNumber; j ++){
         k+=3;
         vertex(ray[k+1].collidedX,ray[k+1].collidedY);
         vertex(ray[k].collidedX,ray[k].collidedY);
         vertex(ray[k+2].collidedX,ray[k+2].collidedY);
         // ray[k+1] = new Ray(shape[i].vertX[j]+1,shape[i].vertY[j]+1);
         // ray[k+2] = new Ray(shape[i].vertX[j]-1,shape[i].vertY[j]-1);
       }
      }
  endShape(CLOSE);
}
