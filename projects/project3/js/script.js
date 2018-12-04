/*
Project 3
Charly Yan Miller
Shapes with sounds in a virtual landscape

Overview of game:
In this game a player can explore an infinite field of gemoetric shapes which produce and vibrate
to various tones, drones, textures... Each shape features unique 2D geometries,
patterns of lines, colour and sounds.

Design Rational:
I haven't played many games this semester (besides Lol), but the games I have played tended to less
mechanically and narratively driven and more interested in exploring the potential experiences
players can have within 3D spaces. In many ways these games really remind me of installations.
I wanted to see if I could make an interesting virtual space of my own, but I really wanted
to focus on developing coding skills and therefore wanted to procedurally generate rather than
meticulously design the world. If the world consisted of self contained objects rather than
scenes which relied heavily on the relationship between objects then I thought this
might be realistically achievable with my current knowledge of coding. I also knew
that sound seemd incredibly important to a player's experience of a virtual space and
therefore the sound of this space would have to be an emphasis in the project.
I was also influenced by the scene in 2001 space odyssey where the tribe of hominids
come across the monolith whose presence and power is conveyed through the music/sound which it radiates.

Tech Overview (for more detailed overviews you can go back to my exercise 7 and 8):
Visualization:
I this project I used ray tech developed in project2 for my pong-light game, basically
I spawn a ray for every vertex (2D) in the scene, make its origin the player position and then make
the ray point towards its associated vertex. If the ray collides with a line (lines make up shapes)
then I stored the position of the collision and the hieght, colour and alpha of the line
at that point of collision. I then find the ray marking the start of the FOV, i itterate through rays
by their angle until I reach the ray marking the end of the FOV all the while filling in shapes
using the rays' collision information as the input. The closer the collision occurs, the "taller"
I draw the shapes on the screen, this creates the illusion of perspective.
Sound:
Every shape's vertex has its own childed source or speaker which has a proecudrally generated
sound and which also effects the vertex's height and therefore makes it "vibrate".
The procedurally generated sound is created because every source during initialization
has a unique range of pitches, wavetypes, and fadetypes which are selected which give a unique sound.

On the type of perspective being created:
I key thing to note is that one of the main reasons that the perspective feels not quite realistic
in the game is that the perceived height of any given line at any given point of contact with a ray
increases LINEARLY as the player approaches said line. This means that if the height of a shape
can actually reach and go below zero if the player is far enough away from a shape.
This is why shapes in the game spring out of existence from a faint sillouhette, because
of the linear perspective their heights would naturally be lower than zero past a certain distance from the player.
Personally I love this effect which is why I chose to model perspective this way,
I think because it creates a sense of intimacy with the closest shape in the player's immediate sourrondings as all
other shapes are relegated to appearing as mere black lines on the horizon (fog might function similarily).
(i think if you were to graph the relationship "f(distanceToShape) = size" of a realistic perspective matrix it would
take the form f = a/x (a rational function never reaching zero) instead of the current linear relationship f = ax)

Controls:
movement: wasd
turning: left and right arrow keys
changing FOV: up and down arrow keys
"Q" turns debug visualization in which ray casting and FOV is visualized on or off.
"E" turns 2D visualization on or off.
"R" turns pseudo-3D visualization on or off.

references used to understand audio api
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
let maxSpawnRadius; //the max radius within a shape will spawn within
let minSpawnRadius; //the min radius within a shape will spawn within
const frameRate = 60;

let textColor = 0; //fill of text
let textOpacity = 255; //alpha of text
let textOpacityFade = false; //begins to decrement textOpacity once set to true
const fontSize = 16;
const verticalSpacing = fontSize*1.5;
let xText;
const yText = verticalSpacing*1.5;
const fillDifference = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  fadeHeightDist = width * 2;
  despawnDist = fadeHeightDist * 3;
  maxSpawnRadius = despawnDist * 0.975;
  minSpawnRadius = despawnDist * .3;
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
    const spawnDistanceFromPlayer = random(minSpawnRadius,maxSpawnRadius); //radius is to be randomized with its maxiumum dist within the spawn dist.
    const shapeSpawnX = (cos(spawnDirectionFromPlayer)*spawnDistanceFromPlayer)+width/2; //set x spawn using angle&radius
    const shapeSpawnY = (sin(spawnDirectionFromPlayer)*spawnDistanceFromPlayer)+height/2; //set y spawn using angle&radius
    shape[i] = spawnRandomShapeAtLocation(shapeSpawnX,shapeSpawnY,i); //randomizes the shape's color, vertex number, angle.

  }
  masterGain.connect(audioCtx.destination); //routes output from all sources through a master gain
  masterGain.gain.value = .25; //sets the master gain's value

  player = new Player(width / 2, height / 2, 0); //spawn player in middle of screen with an angle of 0

  textSize(fontSize);
  textAlign(RIGHT);
  xText = width-verticalSpacing;
}


function draw() {
  background(bgR, bgG, bgB, 175);
  if (keyIsPressed = true){
    textOpacityFade = true;
  }

  if (!(player.velX === 0) && !(player.velXY === 0)){
    const opacityDecrement = 5;
    textOpacity -= opacityDecrement;
    // textColor += opacityDecrement;
  }

  //instructions which appear at beginning of game in top right corner and fade once the player begins to move
  textAlign(RIGHT);
  fill(textColor,textColor,textColor,textOpacity);
  noStroke();
  text("w/a/s/d to move",xText,yText);
  fill(textColor,textColor,textColor,textOpacity+fillDifference);
  text("left/right arrow keys to look around", xText, yText+verticalSpacing);
  fill(textColor,textColor,textColor,textOpacity+fillDifference*2);
  text("up/down arrow keys to change field of view", xText, yText+verticalSpacing*2);
  fill(textColor,textColor,textColor,textOpacity+fillDifference*3);
  text("q/e/r to switch on/off visulization modes", xText, yText+verticalSpacing*3);

  //text which informs the player if a non pseudo-3D display is turned on
  fill(textColor,textColor,textColor,255);
  textAlign(LEFT);
  if (twoDisplay){
    text("2D display", verticalSpacing, yText/2+verticalSpacing/2);
  }
  if (debugDisplay){
    text("                  with raycasting", verticalSpacing, yText/2+verticalSpacing/2);
  }

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
      const xSpawn = (cos(angleToShapeFromPlayer + randomAngleOffset + PI) * maxSpawnRadius) + player.x;
      const ySpawn = (sin(angleToShapeFromPlayer + randomAngleOffset + PI) * maxSpawnRadius) + player.y;
      //actually spawn a new random using the calculated x/yspawn location
      let newShape = spawnRandomShapeAtLocation(xSpawn, ySpawn);
      shape.push(newShape); //add newly spawned shape to shape array

      //calculate the difference in vertexes between the new and previous (now deleted) shape;
      const vertNumberDifference = newShape.vertNumber - vertNumberStore;
            //change the amount of parentRays in the player obj if need be to account for the change in vertexes
      if (vertNumberDifference > 0) { //if the new shape has more vertexes give player as many new rays as needed
        for (let i = 0; i < vertNumberDifference; i++) {
          let newRay = new Ray(true);
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
  if (keyCode === 81) { //if you press Q turn switch debug display on/off and switch twoDisplay on/off
    if (debugDisplay === true) {
      debugDisplay = false;
      twoDisplay = false;
    } else {
      debugDisplay = true;
      twoDisplay = true;
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
