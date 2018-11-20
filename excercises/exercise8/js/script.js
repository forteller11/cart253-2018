/*
Exercise 8
Charly Yan Miller
procedurally generating noises in digital space

Description -- what did I work on for this exercise
I gave each shape a unique set of sounds both in terms of tonal quality, pitch, and volume.
I used javascripts listener-panner paradigm to put the audio in a 3D space around the player.
(Creating a sense of sonic direction and depth).

I mapped the sounds to the hieght of the shapes so they vibrate according to
the sounds they're emitting.
I gave each shape a random amount of randomly positioned and strokeWeighted stripes to offer the shapes more of a sense of depth
to break up the large patches of solid colours, to give shapes more distinguishing features
and just to add more visual interest.

I created a spawning/despawning system so that the player can walk infinitely in any direction
and always discover new shapes while not needing a infinitely powerful computer.

Where I want this to go:
I think I'm more or less done with the main tech I wanted to impement, the only thing
I would realistically want to do now is try to create more varied sounds (and possibly shapes).


Controls:
movement: wasd
turning: left and right arrow keys
changing FOV: up and down arrow keys
"Q" turns debug visualization in which ray casting and FOV is visualized on or off.
"E" turns 2D visualization on or off.
"R" turns pseudo-3D visualization on or off.

references used to get accustomed to audio api
https://webdesign.tutsplus.com/tutorials/web-audio-and-3d-soundscapes-introduction--cms-22650
https://github.com/tutsplus/Web-Audio-and-3D-Soundscapes-Implementation/blob/master/demo.audio.js
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
https://teropa.info/blog/2016/08/04/sine-waves.html
https://stackoverflow.com/questions/1073606/is-there-a-one-line-function-that-generates-a-triangle-wave
http://www.justgoscha.com/programming/2014/04/08/creating-dynamic-audiobuffers-with-webaudio.html
https://medium.com/creative-technology-concepts-code/recording-syncing-and-exporting-web-audio-1e1a1e35ef08
*/
let player;
let shape = []; //array containg shapes
const shapePopulation = 7; //population of shapes
let debugDisplay = false; //desplays rays in 2D perspective
let twoDisplay = false; //displays player and shapes in 2D perspective
let threeDisplay = true; //dvisualizes shape in pseudo-3D
//backgrund colour
let bgR = 255;
let bgG = 190;
let bgB = 135;
let audioCtx = new window.AudioContext();
let sampleRate = 44100; //the amount of values (-1,1) used per second to create sound.
let zPlane = 0; //where all objects sit on the z-axis (up-down relative to the player in this game)
const masterGain = audioCtx.createGain(); //tunes the volume of all sources
let fadeHeightDist; //the distance at which a shape will have shrunk down to a pure black sillouette
let despawnDist; //the distance at which a shape will despawn
let frameRate = 60;


function setup() {
  createCanvas(windowWidth / 1.1, windowHeight / 1.1);
  fadeHeightDist = width * 2;
  despawnDist = fadeHeightDist * 3;
  //create border shape with huge radius souuronding the player with alpha set to 0
  //(ray casting always need to hit SOMETHING to not break and therefore the
  // player has to always be within a shape for sight to work properly)
  shape[0] = new Shape(width / 2, height / 2, 0.0001, 3);
  for (let j = 0; j < shape[0].vertNumber; j++) {
    shape[0].vertAOff[j] = (TWO_PI / shape[0].vertNumber) * j + QUARTER_PI;
    shape[0].vertR[j] = fadeHeightDist * 10;
    shape[0].vertH[j] = 1;
    shape[0].vertHIncrement = random(1000);
    shape[0].r = 0;
    shape[0].g = 0;
    shape[0].b = 0;
    shape[0].alpha = 0;
    shape[0].source[j].audioPlayer.stop(0);
  }
  //spawn random shapes with various geometries and colours
  for (let i = 1; i < shapePopulation; i++) {
    const spawnTheta = random(TWO_PI);
    const spawnDist = random(despawnDist*.95);
    const spawnX = (cos(spawnTheta)*spawnDist)+width/2;
    const spawnY = (sin(spawnTheta)*spawnDist)+height/2;
    shape[i] = new Shape(spawnX, spawnY, random(TWO_PI), round(random(3, 8)));
    for (let j = 0; j < shape[i].vertNumber; j++) {
      shape[i].vertAOff[j] = (TWO_PI / shape[i].vertNumber) * j;
      shape[i].vertR[j] = random(20, fadeHeightDist / 3);
      shape[i].vertH[j] = 1;
      shape[i].vertHIncrement[j] = 1;
      shape[i].r = random(255);
      shape[i].g = random(255);
      shape[i].b = random(255);
      shape[i].alpha = 255;
      // shape[i].source.audioPlayer.stop(0);
    }
  }
  player = new Player(width / 2, height / 2, 0); //spawn player in middle of screen with an angle of 0
  masterGain.connect(audioCtx.destination); //takes output from all sources and applys a master gain
}

function draw() {
  background(bgR, bgG, bgB, 175);


  for (let i = 0; i < shape.length; i++) {
    shape[i].update();
    shape[i].display()
  }
  //set the first shape in array to follow player so that player never outstrips its borders
  shape[0].x = player.x;
  shape[0].y = player.y;

  player.update(); //move player, update rays, visualize shapes in pseudo-3D
  spawnHandler(); //despawn/spawn shapes (and update the shape array according) as they cross the despawnDist threshold
}

function spawnHandler() { //despawn/spawn shapes (and update the shape array according) as they cross the despawnDist threshold
  //check to see if shape is beyond despawnDist
  for (let i = 0; i < shape.length; i++) {
    //dist from shape to player
    const distToPlayer = sqrt(sq(player.x - shape[i].x) + sq(player.y - shape[i].y));
    // print(distToPlayer);
    let yVec;
    let xVec;
    let angleOfPlayer;
    if (distToPlayer > despawnDist) { //if shape IS beyond despawnDist
      yVec = shape[i].y - player.y; //find y component of vector pointing from player to shape
      xVec = shape[i].x - player.x; //find x componenet of vector pointing from player to shape
      angleToShapeFromPlayer = atan2(yVec, xVec); //find angle of vector pointing towards shape from player
      const vertNumberStore = shape[i].vertNumber; //remember the number of vertexes the shape had
      shape.splice(i, 1); //remove the shape which has overstepped the despawnDist threshold from the shape array
      const maxOffsetAmount = HALF_PI;
      const randomAngleOffset = random(-maxOffsetAmount, maxOffsetAmount);
      const spawnRadius = despawnDist * 0.975;
      //set x,y spawn to be a reflection of the previous shape's position (reflecting around the player) plus a random angle offset
      const xSpawn = (cos(angleToShapeFromPlayer + randomAngleOffset + PI) * spawnRadius) + player.x;
      const ySpawn = (sin(angleToShapeFromPlayer + randomAngleOffset + PI) * spawnRadius) + player.y;
      //actually spawn the shape using all these values
      spawnShape(xSpawn, ySpawn, vertNumberStore); //spawns new shape with random attributes
    }
  }
}
//procedurally generates shape at specefified location
//and deals with updating the player.parentRays to reflect the new shape's number of vertexes
function spawnShape(xSpawn, ySpawn, oldVertNumber) {
  let newShape = new Shape(xSpawn, ySpawn, random(TWO_PI), round(random(3, 8)));
  shape.push(newShape); //add newly spawned shape to shape array
  //randomize values
  for (let j = 0; j < newShape.vertNumber; j++) {
    newShape.vertAOff[j] = (TWO_PI / newShape.vertNumber) * j;
    newShape.vertR[j] = random(20, fadeHeightDist / 3);
    newShape.vertH[j] = 1;
    newShape.vertHIncrement[j] = 1;
    newShape.r = random(255);
    newShape.g = random(255);
    newShape.b = random(255);
    newShape.alpha = 255;
    // shape[i].source.audioPlayer.stop(0);
  }
  //calculate the difference in vertexes between the new and previous (now deleted) shape;
  const vertNumberDifference = newShape.vertNumber - oldVertNumber;
  if (vertNumberDifference > 0) { //if the new shape has more vertexes give player as many new rays as needed
    for (let i = 0; i < vertNumberDifference; i++) {
      let newRay = new Ray(100, 100, true);
      player.parentRay.push(newRay);
    }
  }
  if (vertNumberDifference < 0) { //if the new shape has less vertexes remove parentRays from the player object as needed.
      player.parentRay.splice(0,abs(vertNumberDifference));
  }


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
