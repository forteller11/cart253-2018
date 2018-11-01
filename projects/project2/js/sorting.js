let ray = [];
let i = 0;
let j = 0;
let smallestValue = Infinity;
let smallestValueIndex;

function setup() {
  createCanvas(100, 100);
  for (let i = 0; i < width; i++) {
    ray[i] = random(height);
  }

}

function draw() {
  background(0);

  if (j < ray.length) {
    // print(ray[j] + "vs" + smallestValue);
    if(ray[j] < smallestValue){
      // print("ray is smaller");
      smallestValueIndex = j;
      smallestValue = ray[j];
    }

    j++;
  } else if (i < ray.length) {
    i++;
    j = i;

  }



  for (let i = 0; i < width; i++) {
    stroke(200);
    line(i, height,i,height-ray[i]);
  }
    print(ray[0]);

  stroke(255, 0, 0);
  line(j, height,j,height-ray[j]);;
  stroke(100, 100, 255);
    line(i, height,i,0);;
  stroke(100, 255, 100);
  line(smallestValueIndex, height, smallestValueIndex, height-smallestValue);

}
