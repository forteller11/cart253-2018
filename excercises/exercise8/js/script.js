/*
Exercise 8
Charly Yan Miller
procedurally generating noises in digital space

Description -- what did I work on for this exercise
I gave each shape a unique set of sounds both in terms of tonal quality, pitch, and volume.
I used javascript's listener-panner paradigm to put the dynamically generated audio in a 3D space around the player.
(Creating a sense of sonic direction and depth).

I mapped the sounds to the hieght of the shapes so they vibrate according to
the sounds they're emitting.
I gave each shape a random amount of randomly positioned and strokeWeighted stripes to
give the shapes more of a sense of depth, to break up the large patches of solid colours,
to give shapes more distinguishing features and just to add more visual interest.

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
const bgR = 255;
const bgG = 190;
const bgB = 135;
let audioCtx = new window.AudioContext();
const sampleRate = 44100; //the amount of values (-1,1) used per second to create sound.
const zPlane = 0; //where all objects sit on the z-axis (up-down relative to the player in this game)
const masterGain = audioCtx.createGain(); //tunes the volume of all sources
let fadeHeightDist; //the distance at which a shape will have shrunk down to a pure black sillouette
let despawnDist; //the distance at which a shape will despawn
let spawnRadius; //the radius within a shape will spawn within
const frameRate = 60;


function setup() {
  createCanvas(windowWidth, windowHeight);
  fadeHeightDist = width * 2;
  despawnDist = fadeHeightDist * 3;
  spawnRadius = despawnDist * 0.975;
  //create border shape with huge radius souuronding the player with alpha set to 0
  //(ray casting always need to hit SOMETHING to not break and therefore the
  // player has to always be within a shape for sight to work properly)
  const shapeSpawnX = width/2;
  const shapeSpawnY = height/2;
  const shapeAngle = 0.0001; //can't be 0 because then line slopes will be 0 or infnite which creates bugs
  const shapeVertNumber = 3; //number of verts this shape will have
  const shapeR = random(255); //red color
  const shapeG = random(255); //green color
  const shapeB = random(255); //blue color
  const shapeAlpha = 0; //0 opacity (0 alpha value)
  shape[0] = new Shape(shapeSpawnX, shapeSpawnY, shapeAngle, shapeVertNumber, shapeR,shapeG,shapeB, shapeAlpha);
  for (let j = 0; j < shape[0].vertNumber; j++) {
    shape[0].vertAOff[j] = (TWO_PI / shape[0].vertNumber) * j + QUARTER_PI;
    shape[0].vertR[j] = fadeHeightDist * 10;
    shape[0].vertH[j] = 1;
    shape[0].vertHIncrement = random(1000);
    shape[0].source[j].audioPlayer.stop(0);
  }

  //spawn random shapes with random geometries and colours within the spawn distance of the player.
  for (let i = 1; i < shapePopulation; i++) {
    const spawnDirectionFromPlayer = random(TWO_PI); //angle the shape will be spawned (using player as origin)
    const spawnDistanceFromPlayer = random(spawnRadius); //radius is to be randomized with its maxiumum dist within the spawn dist.
    const shapeSpawnX = (cos(spawnDirectionFromPlayer)*spawnDistanceFromPlayer)+width/2; //set x spawn using angle&radius
    const shapeSpawnY = (sin(spawnDirectionFromPlayer)*spawnDistanceFromPlayer)+height/2; //set y spawn using angle&radius
    shape[i] = spawnRandomShapeAtLocation(shapeSpawnX,shapeSpawnY,i); //randomizes the shape's color, vertex number, angle.

  }
  masterGain.connect(audioCtx.destination); //routes output from all sources through a master gain
  masterGain.gain.value = .4; //sets the master gain's value

  player = new Player(width / 2, height / 2, 0); //spawn player in middle of screen with an angle of 0

}


function draw() {
  background(bgR, bgG, bgB, 175);

  //update shapes
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

/*
handles spawning/removing shapes. as shapes pass the threshold of the despawnDist
(an imaginary circle/radius around the player) they get spliced out of the shape array,
then a new shape is created (its spawn location is the old shapes location radially reflected
about the player's position with a random offset). Then the player's parentRay is updated
(added or removed from) to reflect the change in net vertexes resultant from the new shape
being added to the scene
*/
function spawnHandler() {
  //check to see if a shape is beyond despawnDist
  for (let i = 0; i < shape.length; i++) {
    //dist from shape to player
    const distToPlayer = sqrt(sq(player.x - shape[i].x) + sq(player.y - shape[i].y));

    if (distToPlayer > despawnDist) { //if shape IS beyond despawnDist
      const yVec = shape[i].y - player.y; //find y component of vector pointing from player to shape
      const xVec = shape[i].x - player.x; //find x componenet of vector pointing from player to shape
      const angleToShapeFromPlayer = atan2(yVec, xVec); //find angle of vector pointing towards shape from player
      const vertNumberStore = shape[i].vertNumber; //remember the number of vertexes the shape had
      for (let i = 0; i < shape.vertNumber; i++){ //try to make sure no audioapi related obj's or nodes are left after the splice
        shape.source[i].audioPlayer.loop = false;
        shape.source[i].audioPlayer.dissconnect();
        shape.source[i].panner.dissconnect();
        shape.source[i].gainNode.dissconnect();
        shape.source[i].audioPlayer.stop(0);
        shape.source[i] = null;
      }
      shape.splice(i, 1); //remove the shape which has overstepped the despawnDist threshold from the shape array
      const maxOffsetAmount = HALF_PI;
      const randomAngleOffset = random(-maxOffsetAmount, maxOffsetAmount);
      //set x,y spawn to be a reflection of the previous shape's position (reflecting around the player) plus a random angle offset
      const xSpawn = (cos(angleToShapeFromPlayer + randomAngleOffset + PI) * spawnRadius) + player.x;
      const ySpawn = (sin(angleToShapeFromPlayer + randomAngleOffset + PI) * spawnRadius) + player.y;
      //actually spawn a new random using the calculated x/yspawn location
      let newShape = spawnRandomShapeAtLocation(xSpawn, ySpawn);
      shape.push(newShape); //add newly spawned shape to shape array

      //calculate the difference in vertexes between the new and previous (now deleted) shape;
      const vertNumberDifference = newShape.vertNumber - vertNumberStore;
            //change the amount of parentRays in the player obj if need be to account for the change in vertexes
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
  }
}

function spawnRandomShapeAtLocation(spawnX,spawnY){
  const shapeAngle = random(TWO_PI);
  const shapeVertNumber = round(random(3, 8));
  const shapeR = random(255);
  const shapeG = random(255);
  const shapeB = random(255);
  const shapeAlpha = 255;
  return new Shape(spawnX, spawnY, shapeAngle, shapeVertNumber, shapeR,shapeG,shapeB, shapeAlpha);
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
