/*
Exercise 7
Charly Yan Miller
pseudo 3D -- visualizing 2D data in a manner that elludes to a third dimension

Description -- what did I work on for this exercise
Using ray casting tech from project2 to visualize 2D collision data in a way that kind of looks 3D;
the program takes the nearest collision point of every Ray within the FOV and draws
it with a vertical height corresponding to how close/far the vert is from the player.
If the collision happened nearer to the player the verts are draw longer, if they
happened far away the verts are draw shorter -- giving the illusion of perspective.

Also added a solid polar movement system which feels pretty good, also i oscilated the
heights of the verts/walls according to perlin noise and how close the player was to them.
(closer the player is to a vert, the more it ossilates according to perlin noise)

Where I want this to go:
I want to create some sort of walking sim with an interesting visual/audio ambience,
once the tech is in place and if it still seems appropriate I had some abstract narrative elements
(mostly via text) which I wanted to add which would probably imbue the whole experience with
more meaning as players would begin to relate a more visceral experience to
the narration and they would become more engaged interpretors and players and therefore
the project would become more interesting by doing this.


Controls:
movement: wasd
turning: left and right arrow key
tuning FOV: up and down arrow key
"Q" turns debug visualization in which ray casting and FOV is visualized on or off.
"E" turns 2D visualization on or off.
"R" turns pseudo-3D visualization on or off.
*/
let player;
let shape = [];
let debugDisplay = false;
let twoDisplay = false; //display 2 perspective?
let threeDisplay = true;
let bgR = 255;
let bgG = 190;
let bgB = 135;
let audioCtx = new window.AudioContext();
let sampleRate = 44100;
let testSpeaker;

/*
function setup
places shapes randomly on the scene with random gemoetries and heights,
creates player
*/
function setup() {
  createCanvas(windowWidth / 1.1, windowHeight / 1.1);

  //create border shape with huge radius souuronding the player with alpha set to 0
  //(ray casting always need to hit SOMETHING to not bu gout and therefore the
  // player has to always be within a shape for sight to work properly)
  shape[0] = new Shape(width / 2, height / 2, 0.0001, 3);
  for (let j = 0; j < shape[0].vertNumber; j++) {
    shape[0].vertAOff[j] = (TWO_PI / shape[0].vertNumber) * j + QUARTER_PI;
    shape[0].vertR[j] = 10000;
    shape[0].vertH[j] = 1;
    shape[0].vertHIncrement = random(1000);
    shape[0].r = 0;
    shape[0].g = 0;
    shape[0].b = 0;
    shape[0].alpha = 0;
  }
  //spawn random shapes with various geometries and colours
  for (let i = 1; i < 15; i++) {
    shape[i] = new Shape(random(-width, width * 2), random(-height, 2 * height), random(TWO_PI), round(random(3, 9)));
    for (let j = 0; j < shape[i].vertNumber; j++) {
      shape[i].vertAOff[j] = (TWO_PI / shape[i].vertNumber) * j;
      shape[i].vertR[j] = random(100, 300);
      shape[i].vertH[j] = 1;
      shape[i].vertHIncrement[j] = random(100);
      shape[i].r = random(255);
      shape[i].g = random(255);
      shape[i].b = random(255);
      shape[i].alpha = 255;
    }
  }
  //spawn player in middle of screen with an angle of 0
  player = new Player(width / 2, height / 2, 0);
  testSpeaker = new Speaker();
}

function draw() {
  background(bgR, bgG, bgB);
  testSpeaker.update();
  //update shapes and lines
  for (let i = 0; i < shape.length; i++) {
    shape[i].update();
    shape[i].display();
  }
  player.update();

  //draw fov
  noStroke();
  fill(255);
  text("fov:" + round(player.fov * 100) / 100, 64, 64);
}

function keyPressed() {
  if (keyCode === 81) { //if you press Q turn switch debug display on/off
    if (debugDisplay === true) {
      debugDisplay = false;
    } else {
      debugDisplay = true;
    }
  }
  if (keyCode === 69) { //if you press E turn switch debug display on/off
    if (twoDisplay === true) {
      twoDisplay = false;
    } else {
      twoDisplay = true;
    }
  }
  if (keyCode === 82) { //if you press R turn switch debug display on/off
    if (threeDisplay === true) {
      threeDisplay = false;
    } else {
      threeDisplay = true;
    }
  }
}
