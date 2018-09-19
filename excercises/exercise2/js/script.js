/*********************************************************
Exercise 2 - The Artful Dodger
Pippin Barr
Starter code for exercise 2.
*********************************************************/

// The position and size of our avatar circle
var avatarX;
var avatarY;
var avatarSize = 25;

// The speed and velocity of our avatar circle
var avatarSpeed = 10;
let avatarMaxSpeed = 15; //maxium Speed
let avatarSpeedA = 4.5; //at which to add to speed every frame of keyDown
let drag = 1.5; //at which speed will decrease per frame
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
let noiseSpeed = 0.03; //changes the speed at which one translates through perlin-noise space
// The speed and velocity of our enemy circle
var enemySpeed = 2;
var enemyVX = 5;


// How many dodges the player has made
var dodges = 0;
let fontSize = 110; //size of score text
let textFill = 0; //controls the color of the score-text
let backgroundFill = 0;


function crement (a,b,c,d){
/*--------------------
a = value to decrement
c = minimum size of that value
b = maximum size of that value
d = value at which to increment/decrement
----------------------*/
  if (d < 0) { //if the function is being used to decrement

    if (a < b) { //once a reaches lessthan min value, make a it its max value (c)
      a = c;
    }
    else {
      a += d;
    }
}

if (d >= 0) //if function is being used to inc
{
  if (a > c){ //once a is bigger than max value, make it min value;
    a = b;
  }
  else {
    a+=d;
  }
}

  return a;
}


// setup()
//
// Make the canvas, position the avatar and anemy
function setup() {
  // Create our playing area
  createCanvas(550,550);

  // Put the avatar sin the centre
  avatarX = width/2;
  avatarY = height/2;

  // Put the enemy to the left at a random y coordinate within the canvas
  enemyX = 0;
  enemyY = random(0,height);

  // No stroke so it looks cleaner
  noStroke();
}

// draw()
//
// Handle moving the avatar and enemy and checking for dodges and
// game over situations.
function draw() {

   //increases enemy size per dodge
  // A pink background
  background(backgroundFill); //fill background with background fill, which is usually black but becomes white on loss
  backgroundFill -= 20;
  fill(255,255,255,textFill);
  textFill -= 5;
  textSize(fontSize);
  textAlign(CENTER);
  text(dodges, width/2,fontSize);


enemyYinc = (noise(enemyX*noiseSpeed)-.5)*height/40; //get Yinc with perlin noise
if (enemyY < enemySize*2) { //if the enemy is at the top of the screen...
  enemyYinc +=3; //move it down
}
if (enemyY > height-enemySize*2) { //if the enemy is at the bottom of the screen
  enemyYinc -=3; //move it up
}

enemyY += enemyYinc
//console.log(enemyY);
  // Check which keys are down and set the avatar's velocity based on its
  // speed appropriately

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
  console.log("VX:" + avatarVX);
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

  // The enemy always moves at enemySpeed (which increases)
  enemyVX = enemySpeed;
  // Update the enemy's position based on its velocity
  enemyX = enemyX + enemyVX;

  // Check if the enemy and avatar overlap - if they do the player loses
  // We do this by checking if the distance between the centre of the enemy
  // and the centre of the avatar is less that their combined radii
  if (dist(enemyX,enemyY,avatarX,avatarY) < enemySize/2 + avatarSize/2) {
    // Tell the player they lost
    console.log("YOU LOSE!");
    backgroundFill = 255;
    background(textFill);
    // Reset the enemy's position
    enemyX = 0;
    enemyY = random(0,height);
    // Reset the enemy's size and speed
    enemySize = 50;
    enemySpeed = 5;
    // Reset the avatar's position
    avatarX = width/2;
    avatarY = height/2;
    // Reset the dodge counter
    dodges = 0;
  }

  // Check if the avatar has gone off the screen (cheating!)
  if (avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height) {
    // If they went off the screen they lose in the same way as above.
    console.log("YOU LOSE!");
    backgroundFill = 255; //make background white
    enemyX = 0;
    enemyY = random(0,height);
    enemySize = 50;
    enemySpeed = 5;
    avatarX = width/2;
    avatarY = height/2;
    dodges = 0;
  }

  // Check if the enemy has moved all the way across the screen
  if (enemyX > width) {
    // This means the player dodged so update its dodge statistic
    dodges = dodges + 1;
    //make text visble
    textFill = 255;
    //increase size of enemy
    enemySize = enemySize + dodges*2;
    //increase speed of enemy
    enemySpeed = enemySpeed + dodges/16;

    // Reset the enemy's position to the left at a random height
    enemyX = 0;
    enemyY = random(0,height);

  }






  noFill();
  stroke(255);
  strokeWeight(avatarStrokeWeight);
  avatarStrokeWeight = crement(avatarStrokeWeight,1,2,+.1);
  avatarSizeGraphic = crement(avatarSizeGraphic,0,avatarSize,-.5);
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
  ellipse(avatarX,avatarY,avatarSizeGraphic,avatarSizeGraphic);

  //draw enemy
  noStroke();
  fill(255)
  // Draw the enemy as a circle
  ellipse(enemyX-enemyVX,enemyY-enemyYinc,enemySize,enemySize);
  noStroke();
  fill(255);
  // Draw the enemy as a circle
  ellipse(enemyX,enemyY,enemySize,enemySize);

  //draw expanding hole in the middle of the enemy
  enemySizeGraphic = crement(enemySizeGraphic,0,enemySize/1.2,1);
  noiseDetail(16);
  enemySizeGraphic = (noise(enemyX*noiseSpeed))*enemySize/1.6 + enemySize/20;
  fill(0);
  ellipse(enemyX+enemyVX,enemyY+enemyYinc,enemySizeGraphic,enemySizeGraphic);
  //console.log("Enemy" + enemySizeGraphic)


}
