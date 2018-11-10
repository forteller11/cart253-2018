let player;
let shape = [];
let debugDisplay = true;

function setup() {
  createCanvas(windowWidth / 1.1, windowHeight / 1.1);

  //border
  shape[0] = new Shape(width / 2, height / 2, 0.0001, 4);
  for (let j = 0; j < shape[0].vertNumber; j++) {
    shape[0].vertAOff[j] = (TWO_PI / 4) * j + QUARTER_PI;
    shape[0].vertR[j] = 10000;
  }
  //randomshapes
  for (let i = 1; i < 4; i++) {
    shape[i] = new Shape(random(width), random(height), random(TWO_PI), round(random(3, 8)));
    for (let j = 0; j < shape[i].vertNumber; j++) {
      shape[i].vertAOff[j] = (TWO_PI / shape[i].vertNumber) * j;
      shape[i].vertR[j] = 40;
    }
  }

  player = new Player(width / 2, height / 2, 0);
}

function draw() {
  background(51);
  for (let i = 0; i < shape.length; i++) {
    shape[i].update();
    shape[i].display();
  }
  player.update();

}
