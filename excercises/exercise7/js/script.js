let player;
let shape = [];
let debugDisplay = true;
let bgR = 255;
let bgG = 190;
let bgB = 135;
bgR = 51;
bgG = 51;
bgB = 51;

function setup() {
  createCanvas(windowWidth / 1.1, windowHeight / 1.1);

  //border
  shape[0] = new Shape(width / 2, height / 2, 0.0001, 4);
  for (let j = 0; j < shape[0].vertNumber; j++) {
    shape[0].vertAOff[j] = (TWO_PI / shape[0].vertNumber) * j + QUARTER_PI;
    shape[0].vertR[j] = 10000;
    shape[0].vertH[j] = 1;
    shape[0].r = random(0);
    shape[0].g = random(0);
    shape[0].b = random(0);
  }
  //randomshapes
  for (let i = 1; i < 4; i++) {
    shape[i] = new Shape(random(width), random(height), random(TWO_PI), round(random(4, 4)));
    for (let j = 0; j < shape[i].vertNumber; j++) {
      shape[i].vertAOff[j] = (TWO_PI / shape[i].vertNumber) * j;
      shape[i].vertR[j] = 300;
      shape[i].vertH[j] = 1;
      shape[i].r = random(255);
      shape[i].g = random(255);
      shape[i].b = random(255);
    }
  }

  player = new Player(width / 2, height / 2, 0);
}

function draw() {
  // console.time();
  background(bgR,bgG,bgB);
  for (let i = 0; i < shape.length; i++) {
    shape[i].update();
    shape[i].display();
  }
  player.update();
// console.timeEnd();
}
