let ray = [];

let smallestValue = Infinity;
let smallestValueIndex;
let sum = 0;

function setup() {
  createCanvas(1000, 100);
  for (let i = 0; i < width; i++) {
    ray[i] = random(height);
  }

}

function draw() {
  background(0);
  for (let i = 0; i < ray.length; i++) {
    smallestValue = Infinity;
    for (let j = i; j < ray.length; j++) {
      if (ray[j] < smallestValue) {
        smallestValueIndex = j;
        smallestValue = ray[j];
      }
      if (j === ray.length - 1) {
        // at end of array, swap smallest item in list with first item
        rayStore = ray[i];
        ray[i] = smallestValue;
        ray[smallestValueIndex] = rayStore;
      }
    }
  }




  for (let i = 0; i < width; i++) {
    stroke(200);
    line(i, height, i, height - ray[i]);
  }


  sum = 0;
  for (let i = 0; i < ray.length; i++) {
    sum += ray[i];
  }
  print("sum:" + sum);
}
