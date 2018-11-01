let ray = [];
let i = 0;
let j = 0;

function setup() {
  createCanvas(100, 100);
  for (let i = 0; i < width; i++) {
    ray[i] = random(height);
  }

}

function draw() {
  background(0);

  if (j < ray.length){
    j++;


  } else if (i < ray.length){
      i++;
      j=0;

  }



  for (let i = 0; i < width; i++) {
    stroke(200);
    line(i, height, i, ray[i]);
  }


  stroke(255,0,0);
  line(j, height, j, ray[j]);
  stroke(100,100,255);
  line(i, height, i, 0);

  }
