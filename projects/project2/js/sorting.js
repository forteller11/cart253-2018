let ray = [];
let i = 0;
let j = 0;
let smallestValue = Infinity;
let smallestValueIndex;
let sum = 0;
function setup() {
  createCanvas(30, 100);
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
    if (j === ray.length-1){
      // at end of array, swap smallest item in list with first item
      rayStore = ray[i];
      ray[i] = smallestValue;
      ray[smallestValueIndex] = rayStore;
    }

    j++;
  } else if (i < ray.length) {
    i++;
    smallestValue = Infinity;
    j = i;

  }



  for (let i = 0; i < width; i++) {
    stroke(200);
    line(i, height,i,height-ray[i]);
  }

  stroke(255, 0, 0);
  line(j, height,j,height-ray[j]);;
  stroke(100, 100, 255);
    line(i, height,i,0);;
  stroke(100, 255, 100);
  line(smallestValueIndex, height, smallestValueIndex, height-smallestValue);

  sum = 0;
  for (let i = 0; i < ray.length; i++) {
    sum += ray[i];
  }
  print("sum:"+sum);
}
