/*********************************************************
Exercise 2 - The Artful Dodger
Charly Yan Miller
In which one controls an avatar with the arrow keys
and must avoid enemies in order to increase thier dodge/highscore counter.

The Enemy's vertical movement is controlled by perlin-noise,
and that perlin noise is visualized in the form of a pulsating black spheroid in their center.
The avatar has acceleration based movement,
and has one animation (pulsation of a black spheroid) which is controlled by perlin noise,
but also has a animation which changes the line weight of their outline which is controlled by a custom sin interpoaltion function
As the amount of dodges increases, so does the height of the canvas, and its increase is interpolated with the sin function.

*********************************************************/
let canvasHeightInitial = 200; //initial canvas height;
let canvasHeight = canvasHeightInitial; //set canvas height to initial canvas height


let canvasHeightIncreaseAmount = 20; //value to increase height of canvas per dodge;
let avatarX;
let avatarY;
let avatarSize = 25;
// The speed and velocity of our avatar circle
let avatarSpeed = 10;
let avatarMaxSpeed = 15; //maxium Speed
let avatarSpeedA = 4.5; //at which to add to speed every frame of keyDown (acceleration)
let drag = 1.5; //divide avatarSpeed by drag every frame to slow the avatar down;
let avatarVX = 0;
let avatarVY = 0;
// The position and size of the enemy circle
let enemyX;
let enemyY;
let enemyYacc;
let enemyYV = 0;
let enemyDrag = 2;
let enemySize = 50;
let enemySizeGraphic = 0;
let avatarSizeGraphic = 0;
let avatarStrokeWeight = 0;
//vars pertaining to noise function and/or sin interpolation function
let noiseSpeed = 0.02; //changes the speed at which one translates through perlin-noise space (used for enemy)
let noiseSpeed2 = 0.01; //changes the speed at which one translates through perlin-noise space (used for avatar)
let noiseSpeed2Inc = 0.0025; //rate at which noiseSpeed2 increases each dodge
let cc = 0; //controls sininterpolation controlling the increase of canvas height post dodge
let cc2 = 1;//controls sininterpolation controlling the decrease of canvas height post death
let canvasSinIncrement = 0.05; //percentage rate per frame (5%) at which to increase/decrease hieght of canvas
let cc3 = 0; //controls rate at which the line thickness changes on avatar
let cc3Inc = 0.01; //rate at which to increment/decremnt cc3
// The speed and velocity of our enemy circle
let enemySpeed = 2;
let enemySpeedInc = 32; //affects the rate at which to increase enemySpeed per dodge(), higher value is LESS increment
let enemySizeInc = 2; //affects the rate to increase enemySize per dodge, higher value is MORE increment
let enemyVX = 5;


let dodges = 0;
let lastdodge = 6;
let highscore = 0; //highest number of dodges
let fontSize = 110; //size of score text
let textFill = 0; //controls the color of the score-text
let backgroundFill = 0; //fill color of background
let textFillHighscore = 0; //controls the color of the highscore text'
let lost = false;


function sininter (a,b,c) { //interpolates between two values by a percentage according to a sin wave
  /*--------------------
  a = value1
  b = value2
  c = percentage to lerp (value between 0-1)
  d = transforms c into a sin-wave based interpolation
  ----------------------*/
  let d = sin(PI*c/2); //I am compressing this sin function by PI so that a half-period (in which the sin function >= 1) is completed with a x input of 0-1
  let abDiff = abs(a - b); //find difference between two values
  let abDiffLerp = abDiff * d; //interpolate linearly
  let lerp = abDiffLerp + a; //add minium value to lerp of mean numbers to get lerp
  return lerp;
}

function setup() {
createCanvas(550,canvasHeight);

  // Put the avatar sin the centre
  avatarX = width/2;
  avatarY = height/2;

  // Put the enemy to the left at a random y coordinate within the canvas
  enemyX = 0;
  enemyY = random(0,height);
}

function draw() {

  //ajust canvas height according to game state
  if (cc < 1) { //increase cc (sin interpolation function) and add value to canvas.
      cc += canvasSinIncrement;
    }
    else if (cc > 1){
      cc = 1;
    }
    //draw canvas height according to initial canvas height + amount of dodges + sin interpolation.
    if (lost === false) {
      canvasHeight = canvasHeightInitial + sininter(0,canvasHeightIncreaseAmount,cc) + (dodges*canvasHeightIncreaseAmount);
    }

if (lost === true) {
  background(51);
cc2 -= canvasSinIncrement;

if (cc2 < 0) {
  cc2 = 0;
  lost = false;
}
canvasHeight = canvasHeightInitial + sininter(0,lastdodge*canvasHeightIncreaseAmount,cc2) + sininter(0,canvasHeightIncreaseAmount,cc);
}

createCanvas(550,canvasHeight);
   //increases enemy size per dodge
  // A pink background
  background(backgroundFill); //fill background with background fill, which is usually black but becomes white on loss
  if (backgroundFill > 0) //if the screen isn't black, fade it to black
  {
    backgroundFill -= 20;
  }

  //draw text on screen whenever a sucessful dodge occurs
  textAlign(CENTER);
  fill(255,255,255,textFill);
  if (textFill > 0) { //fade text to black
    textFill -= 5;
  }
  textSize(fontSize);
  text(dodges, width/2,fontSize);

  //draw high score text on screen after death
  fill(255,255,255,textFillHighscore);
  textFillHighscore -= 2.5;
  textSize(fontSize*2);
  text(highscore, width/2,canvasHeightInitial/2+fontSize/1.3);//draw text in center

  //movement of enemy
noiseDetail(6);
  enemyYacc = (noise(enemyX*noiseSpeed)-.5)*height/40; //get Yinc with perlin noise
  if (enemyY < enemySize*0.5) { //if the enemy is at the top of the screen...
    enemyYacc +=.5; //move it down
  }
  if (enemyY > height-enemySize*0.5) { //if the enemy is at the bottom of the screen
    enemyYacc -=.5; //move it up
  }
  enemyYV += enemyYacc; //add accelreation to velocity;
  enemyYV = enemyYV/enemyDrag; //apply drag to velocity
  enemyY += enemyYV; //apply velocity to position

  // The enemy always moves at enemySpeed (which increases)
  enemyVX = enemySpeed;
  // Update the enemy's position based on its velocity
  enemyX = enemyX + enemyVX;


  // Left and right
  if (keyIsDown(LEFT_ARROW)) {
    avatarVX -= avatarSpeedA; //decrease horizontal velocity by accleration
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    avatarVX += avatarSpeedA; //increase horizontal velocity by accleration
  }
  if (avatarVX > avatarMaxSpeed) { //constrain horz velocity to maxspeed
    avatarVX = avatarMaxSpeed;
  }
  else if (avatarVX < -avatarMaxSpeed) { //constrain horz velocity to maxspeed
    avatarVX = -avatarMaxSpeed;
  }
  avatarVX = avatarVX/drag; //apply drag

  if (keyIsDown(UP_ARROW)) {
    avatarVY -= avatarSpeedA; //decrease vertical velocity by accleration
  }
  if (keyIsDown(DOWN_ARROW)) {
    avatarVY += avatarSpeedA; //increase vertical velocity by accleration
  }
  if (avatarVY > avatarMaxSpeed) { //constrain vertical velocity to maxspeed
    avatarVY = avatarMaxSpeed;
  }
  if (avatarVY < -avatarMaxSpeed) { //constrain vertical velocity to maxspeed
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
    print("Highscore:"+highscore);
    print("LastRound's dodges:" + lastdodge)

    textFillHighscore = 255; //display highscore text
    textFill = 0; //dont display dodge number
    backgroundFill = 255;
    background(textFill);
    canvasHeightIncrease = -(height - canvasHeightInitial); //set canvasheightincrease to number needed to reduce current canvas height to original canvas height
    // Reset the enemy's position
    enemyX = 0;
    enemyY = random(0,height);
    // Reset the enemy's size and speed
    enemySize = 50;
    enemySpeed = 2;
    // Reset the avatar's position
    avatarX = width/2;
    avatarY = canvasHeightInitial/2;
    // Reset the dodge counter

    lost = true;
    cc2 = 1;
    lastdodge = dodges; //dodge number before losing
    //reset noisespeed
    noiseSpeed2 = 0.01;
    dodges = 0;
  }

  // Check if the avatar has gone off the screen (cheating!)
  if (avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height) {
    // If they went off the screen they lose in the same way as above.
    console.log("YOU LOSE!");
    canvasHeightIncrease = -(height - canvasHeightInitial); //set canvasheightincrease to number needed to reduce current canvas height to original canvas height
    textFillHighscore = 255; //display highscore text
    textFill = 0; //dont display dodge number
    backgroundFill = 255; //make background white
    enemyX = 0;
    enemyY = random(0,height);
    enemySize = 50;
    enemySpeed = 2;
    avatarX = width/2;
    avatarY = canvasHeightInitial/2;

    lost = true;
    cc2 = 1;
    lastdodge = dodges; //dodge number before losing

    print("Highscore:"+highscore);
    print("LastRound's dodges:" + lastdodge)
    dodges = 0;
  }

  // Check if the enemy has moved all the way across the screen
  if (enemyX > width) {
    // This means the player dodged so update its dodge statistic
    dodges ++;
    cc3Inc += 0.005; //increase rate at which player animation cycles on
    cc = 0; //reset sinlerp amount
    if (dodges > highscore){ //set highscore to highest number of consecutive dodges
      highscore = dodges;
    }

    canvasHeightIncrease = canvasHeightIncreaseAmount; //set canvasHeightIncrease to positive number
    avatarSize = random(22.5,27.5); //randomly set avatar size after each dodge
    avatarSpeedA = random(4.3,4.7); //randomly set player acceleration after each dodge
    //console.log(avatarSpeedA);
    //make text visble
    textFill = 255;
    //increase size of enemy
    enemySize = enemySize + dodges*enemySizeInc;
    //increase speed of enemy
    enemySpeed = enemySpeed + dodges/enemySpeedInc;

    //increase the rate of translation in perlinnoise space
    noiseSpeed2 += noiseSpeed2Inc;
    // Reset the enemy's position to the left at a random height
    enemyX = 0;
    //because the canvas is increased after the avatar is spawned the program needs to account for the extra play-space which will soon be available to the player.
    enemyY = random(0,canvasHeight+canvasHeightIncreaseAmount);

  }






  noFill();
  stroke(255);
  strokeWeight(avatarStrokeWeight);

  cc3 += cc3Inc;
  avatarStrokeWeight = abs(sininter(0,3,cc3))+1; //will cycle through values between 0 and 4
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
  ellipse(enemyX-enemyVX/2,enemyY-enemyYacc/2,enemySize,enemySize);
  noStroke();
  fill(255);
  // Draw the enemy as a circle
  ellipse(enemyX,enemyY,enemySize,enemySize);

  //draw expanding hole in the middle of the enemy

  noiseDetail(2);
  enemySizeGraphic = (noise(enemyX*noiseSpeed2/(enemySize/50)))*enemySize/1.6 + enemySize/4;
  fill(0);
  ellipse(enemyX+enemyVX,enemyY+enemyYacc,enemySizeGraphic,enemySizeGraphic);
  //console.log("Enemy" + enemySizeGraphic)


}
