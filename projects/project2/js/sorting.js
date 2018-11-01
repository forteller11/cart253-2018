let ray = [];
let i = 0;

function setup() {
  createCanvas(100, 100);
  for (let i = 0; i < width; i++) {
    ray[i] = random(height);
  }

}

function draw() {
  background(0);
  if (i < ray.length) {
    i++
  }
  for (let j = 0; j < ray.length; j++) {

    if (j < ray.length - 1) {
      if (ray[j] < ray[j + 1]) {
        rayStore = ray[j];
        ray[j] = ray[j + 1];
        ray[j + 1] = rayStore;
      }
    }

  }




  for (let i = 0; i < width; i++) {
    stroke(200);
    line(i, height, i, ray[i]);
  }
}
