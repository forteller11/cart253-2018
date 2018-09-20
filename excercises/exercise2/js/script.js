/*********************************************************
Exercise 2 - The Artful Dodger
Charly Yan Miller
Starter code for exercise 2.
*********************************************************/
let canvasHeightInitial = 200; //initial canvas height;
let canvasHeight = canvasHeightInitial; //set canvas height to initial canvas height
let canvasHeightIncrease = 0; //amount of pixels to increase canvas;
let canvasHeightIncreaseIncrement = 3; //amount to increase canvas height per frame until canvasHeightIncrease <= 0;
let canvasHeightIncreaseAmount = 20; //value to increase height of canvas per dodge;
var avatarX;
var avatarY;
var avatarSize = 25;

// The speed and velocity of our avatar circle
var avatarSpeed = 10;
let avatarMaxSpeed = 15; //maxium Speed
let avatarSpeedA = 4.5; //at which to add to speed every frame of keyDown (acceleration)
let drag = 1.5; //divide avatarSpeed by drag every frame to slow the avatar down;
let avatarVX = 0;
let avatarVY = 0;

// The position and size of the enemy circle
var enemyX;
var enemyY;
let enemyYinc;
var enemySize = 50;
let enemySizeGraphic = 0;
let avatarSizeGraphic = 0;
let avatarStrokeWeight = 0;
let noiseSpeed = 0.02; //changes the speed at which one translates through perlin-noise space
let noiseSpeed2 = 0.01; //same
// The speed and velocity of our enemy circle
var enemySpeed = 2;
var enemyVX = 5;


// How many dodges the player has made
var dodges = 0;
let fontSize = 110; //size of score text
let textFill = 0; //controls the color of the score-text
let backgroundFill = 0; //fill color of background


function crement (a,b,c,d){ //function to increment/decrement a value and reset it once it reaches a min/max value
/*--------------------
a = value to be incremented/decremented
c = minimum value of a
b = maxium value of a
d = value at which to increment/decrement per call of function
----------------------*/
  if (d < 0) { //if the function is being used to decrement

    if (a <= b) { //once a is equalto/lessthan min value, make a it its max value (c)
      a = c;
    }
    else {
      a += d; //if a is larger than min value, decrement;
    }
}

if (d >= 0) //if function is being used to increment
{
  if (a >= c){ //once a is biggerthan/equalto max value, make it min value (b);
    a = b;
  }
  else { //if a is within max value, increment
    a+=d;
  }
}

  return a;
}


// setup()
//
// Make the canvas, position the avatar and anemy
function setup() {


  // Put the avatar sin the centre
  avatarX = width/2;
  avatarY = height/2;

  // Put the enemy to the left at a random y coordinate within the canvas
  enemyX = 0;
  enemyY = random(0,height);


}

// draw()
//
// Handle moving the avatar and enemy and checking for dodges and
// game over situations.
function draw() {
  if (canvasHeightIncrease > 0) { //if canvasHeightIncrease is set to a postive number increase canvassize by canvasHeightIncreaseAmount
    canvasHeightIncrease -= canvasHeightIncreaseIncrement;
    canvasHeight += canvasHeightIncreaseIncrement;
    if (canvasHeightIncrease < 0)  { //incase the decrement overshot 0, make sure canvasHeightIncrease isn't a negative number;
      canvasHeightIncrease = 0;
    }
  }
  if (canvasHeightIncrease < 0) {//if canvasHeightIncrease is set to a negative number then decrease canvas size until it is back to its initial height
    canvasHeightIncrease += canvasHeightIncreaseIncrement*3;
    canvasHeight -= canvasHeightIncreaseIncrement*3;
    if (canvasHeightIncrease > 0)  { //incase the decrement overshot 0, make sure canvasHeightIncrease isn't a positive number;
      canvasHeightIncrease = 0;
    }
  }
createCanvas(550,canvasHeight);
   //increases enemy size per dodge
  // A pink background
  background(backgroundFill); //fill background with background fill, which is usually black but becomes white on loss
  if (backgroundFill > 0) //if the screen isn't black, fade it to black
  {
    backgroundFill -= 20;
  }
  fill(255,255,255,textFill);
  textFill -= 5;
  textSize(fontSize);
  textAlign(CENTER);
  text(dodges, width/2,fontSize);

//movement of enemy
noiseDetail(4);
  enemyYinc = (noise(enemyX*noiseSpeed)-.5)*height/40; //get Yinc with perlin noise
  if (enemyY < enemySize*0.5) { //if the enemy is at the top of the screen...
    enemyYinc +=3; //move it down
  }
  if (enemyY > height-enemySize*0.5) { //if the enemy is at the bottom of the screen
    enemyYinc -=3; //move it up
  }
  enemyY += enemyYinc; //increase enemyspeed
  // The enemy always moves at enemySpeed (which increases)
  enemyVX = enemySpeed;
  // Update the enemy's position based on its velocity
  enemyX = enemyX + enemyVX;


  // Left and right
  if (keyIsDown(LEFT_ARROW)) {
    avatarVX -= avatarSpeedA;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    avatarVX += avatarSpeedA;
  }
  if (avatarVX > avatarMaxSpeed) { //constrain to maxspeed
    avatarVX = avatarMaxSpeed;
  }
  else if (avatarVX < -avatarMaxSpeed) { //constrain to maxspeed
    avatarVX = -avatarMaxSpeed;
  }
  avatarVX = avatarVX/drag; //apply drag
  //console.log("VX:" + avatarVX);
  // Up and down (separate if-statements so you can move vertically and
  // horizontally at the same time)
  if (keyIsDown(UP_ARROW)) {
    avatarVY -= avatarSpeedA;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    avatarVY += avatarSpeedA;
  }
  if (avatarVY > avatarMaxSpeed) { //constrain to maxspeed
    avatarVY = avatarMaxSpeed;
  }
  else if (avatarVY < -avatarMaxSpeed) { //constrain to maxspeed
    avatarVY = -avatarMaxSpeed;
  }
  avatarVY = avatarVY/drag; //apply drag


  // Move the avatar according to its calculated velocity
  avatarX = avatarX + avatarVX;
  avatarY = avatarY + avatarVY;


  // Check if the enemy and avatar overlap - if they do the player loses
  // We do this by checking if the distance between the centre of the enemy
  // and the centre of the avatar is less that their combined radii
  if (dist(enemyX,enemyY,avatarX,avatarY) < enemySize/2 + avatarSize/2) {
    // Tell the player they lost
    console.log("YOU LOSE!");
    backgroundFill = 255;
    background(textFill);
    canvasHeightIncrease = -(height - canvasHeightInitial) //set canvasheightincrease to number needed to reduce current canvas height to original canvas height
    // Reset the enemy's position
    enemyX = 0;
    enemyY = random(0,height);
    // Reset the enemy's size and speed
    enemySize = 50;
    enemySpeed = 5;
    // Reset the avatar's position
    avatarX = width/2;
    avatarY = canvasHeightInitial/2;
    // Reset the dodge counter
    dodges = 0;
    //reset noisespeed
    noiseSpeed2 = 0.01;
  }

  // Check if the avatar has gone off the screen (cheating!)
  if (avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height) {
    // If they went off the screen they lose in the same way as above.
    console.log("YOU LOSE!");
    canvasHeightIncrease = -(height - canvasHeightInitial) //set canvasheightincrease to number needed to reduce current canvas height to original canvas height
    backgroundFill = 255; //make background white
    enemyX = 0;
    enemyY = random(0,height);
    enemySize = 50;
    enemySpeed = 5;
    avatarX = width/2;
    avatarY = canvasHeightInitial/2;
    dodges = 0;
  }

  // Check if the enemy has moved all the way across the screen
  if (enemyX > width) {
    // This means the player dodged so update its dodge statistic
    dodges = dodges + 1;
    canvasHeightIncrease =   canvasHeightIncreaseAmount; //set canvasHeightIncrease to positive number
    avatarSize = random(22.5,27.5); //randomly set avatar size after each dodge
    avatarSpeedA = random(4.3,4.7); //randomly set player acceleration after each dodge
    console.log(avatarSpeedA);
    //make text visble
    textFill = 255;
    //increase size of enemy
    enemySize = enemySize + dodges*2;
    //increase speed of enemy
    enemySpeed = enemySpeed + dodges/16;

    //increase the rate of translation in perlinnoise space
    noiseSpeed2 += 0.0025;
    // Reset the enemy's position to the left at a random height
    enemyX = 0;
    //because the canvas is increased after the avatar is spawned the program needs to account for the extra play-space which will soon be available to the player.
    enemyY = random(0,canvasHeight+canvasHeightIncreaseAmount);

  }






  noFill();
  stroke(255);
  strokeWeight(avatarStrokeWeight);
  avatarStrokeWeight = crement(avatarStrokeWeight,1,4,noiseSpeed2*4);
  //avatarSizeGraphic = crement(avatarSizeGraphic,0,avatarSize,-.5);
  avatarSizeGraphic = (noise(avatarX*noiseSpeed2,avatarY*noiseSpeed2,enemyX*noiseSpeed2)*avatarSize/1.7 + avatarSize/5);

  //console.log("sizeGraphic :" +   avatarSizeGraphic);
  noStroke();
  fill(255);
  // Draw a white trail behind the player, showing motion
  ellipse(avatarX-avatarVX/2,avatarY-avatarVY/2,avatarSize,avatarSize);
  fill(0);
  //fill the area of the immediate player with black
  ellipse(avatarX,avatarY,avatarSize,avatarSize);
  noFill();
  stroke(255);
  // Draw the player as a circle
  ellipse(avatarX,avatarY,avatarSize,avatarSize);
  fill(255,255,255,255);
  noStroke();
  //ellipse(avatarX,avatarY,avatarSizeGraphic,avatarSizeGraphic);
  ellipse(avatarX-avatarVX/2,avatarY-avatarVY/2,avatarSizeGraphic,avatarSizeGraphic);

  //draw enemy
  noStroke();
  fill(255)
  // Draw a motion trail
  ellipse(enemyX-enemyVX/2,enemyY-enemyYinc/2,enemySize,enemySize);
  noStroke();
  fill(255);
  // Draw the enemy as a circle
  ellipse(enemyX,enemyY,enemySize,enemySize);

  //draw expanding hole in the middle of the enemy
  enemySizeGraphic = crement(enemySizeGraphic,0,enemySize/1.2,1);
  noiseDetail(2);
  enemySizeGraphic = (noise(enemyX*noiseSpeed))*enemySize/1.6 + enemySize/4;
  fill(0);
  ellipse(enemyX+enemyVX,enemyY+enemyYinc,enemySizeGraphic,enemySizeGraphic);
  //console.log("Enemy" + enemySizeGraphic)


}
