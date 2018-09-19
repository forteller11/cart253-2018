/*********************************************************
Exercise 2 - The Artful Dodger
Pippin Barr
Starter code for exercise 2.
*********************************************************/

// The position and size of our avatar circle
var avatarX;
var avatarY;
var avatarSize = 20;

// The speed and velocity of our avatar circle
var avatarSpeed = 10;
var avatarVX = 0;
var avatarVY = 0;

// The position and size of the enemy circle
var enemyX;
var enemyY;
let enemyYinc;
var enemySize = 50;
let avatarSizeGraphic = 0;


// The speed and velocity of our enemy circle
var enemySpeed = 2;
var enemyVX = 5;


// How many dodges the player has made
var dodges = 0;
let fontSize = 110; //size of score text
let textFill = 0; //controls the color of the score-text
let backgroundFill = 0;
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
  // Default the avatar's velocity to 0 in case no key is pressed this frame
  avatarVX = 0;
  avatarVY = 0;

enemyYinc = (noise(enemyX)-.5)*10; //get Yinc with perlin noise
enemyY += enemyYinc
console.log(enemyY);
  // Check which keys are down and set the avatar's velocity based on its
  // speed appropriately

  // Left and right
  if (keyIsDown(LEFT_ARROW)) {
    avatarVX = -avatarSpeed;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    avatarVX = avatarSpeed;
  }

  // Up and down (separate if-statements so you can move vertically and
  // horizontally at the same time)
  if (keyIsDown(UP_ARROW)) {
    avatarVY = -avatarSpeed;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    avatarVY = avatarSpeed;
  }

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
    enemySize = enemySize + dodges*2.5;
    //increase speed of enemy
    enemySpeed = enemySpeed + dodges/9;
    // Tell them how many dodges they have made
    console.log(dodges + " DODGES!");
    // Reset the enemy's position to the left at a random height
    enemyX = 0;
    enemyY = random(0,height);

  }

  // Display the current number of successful in the console
  console.log(dodges);




  noFill();
  stroke(255);
  if (avatarSizeGraphic < 0) {
    avatarSizeGraphic = avatarSize;
  }
  else {
    avatarSizeGraphic --;
  }
  // The player is black
  noFill();
  stroke(255);
  // Draw the player as a circle
  ellipse(avatarX,avatarY,avatarSize,avatarSize);
  fill(255,255,255,255);
  noStroke();
  ellipse(avatarX,avatarY,avatarSizeGraphic,avatarSizeGraphic);

  //draw enemy
  noStroke();
  fill(255);
  // Draw the enemy as a circle
  ellipse(enemyX,enemyY,enemySize,enemySize);



}
