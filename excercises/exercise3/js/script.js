/*****************

Title of Project
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!
Sidenote: I kinda thought all the animals were dogs for some reason,
so because of this var names tend to feature the word "dog";
******************/
let dogIndex = [];
let dog = [];
let dogPop = 20; //population of dogs
let dogImageNumber = 11; //number of dog images in assets/images
let waldoX;
let waldoXinitial;
let waldoY;
let waldoYinitial;
let waldoYinc = 0; //rate at which to interpolate waldo's Y pos
let framesPressed; //tracks the frames for which mouse has been pressed
let waldoDisplayW = 400; //size of canvas in which to display target dog (waldo)
let waldoDisplayH = waldoDisplayW;
let waldoIndex; //make index of waldo a global var
let playSpaceH = waldoDisplayH*8; //play space is area to spawn dogs in
let avgImgW = 128; //avg img width
let fontSize = 60;
let win = false; //have you found waldo? FALSE
function preload() {
//fills the dogIndex array with strings/directories to all dog images
  for (var i = 0; i <= dogImageNumber; i++) {
    dogIndex[i-1] = "assets/images/animals-"+i+".png";
  }

  //fills the dog array with images containing all dog images
  for (var i = 0; i <= dogImageNumber-1; i++) {
    dog[i] = loadImage(dogIndex[i]);
  }
}

function setup() {
  //create canvas, fill WaldoDisplay and playarea with distinct colors
  createCanvas(400,waldoDisplayH+playSpaceH);

  noStroke();
  fill(250,240,70);//yellow
  rect(0,0,waldoDisplayW,waldoDisplayH); //fills in UI space

  fill(250,40,20);//red
  rect(0,waldoDisplayH,width,height); //fills in dog-space;


  //set index of waldo (animal to be found)
  waldoIndex = round(random(9));

  //spawn random dogs randomly
  for (let i = 0; i < dogPop; i++ ) {
    let index = round(random(9));
    while (index === waldoIndex){ //make sure a waldo-type-dog isn't spawned
      index = round(random(9));
    }
    image(dog[index],random(waldoDisplayW),waldoDisplayH+avgImgW+random(playSpaceH-avgImgW));
  }


  //set vars of waldo (position in play space)
  waldoX = random(waldoDisplayW);
  waldoXinitial = waldoX;
  waldoY = random(playSpaceH)+waldoDisplayH+avgImgW;
  waldoYinitial = waldoY;
  waldoWidth = dog[waldoIndex].width/1.5;
}

function draw(){
  //fill displaySPace with yellow
  fill(250,240,70);//yellow
  rect(0,0,waldoDisplayW,waldoDisplayH); //fills in UI space

if (mouseIsPressed){
  framesPressed ++;
}
else {
  framesPressed = 0;
}

  if (framesPressed === 1){ //if the mouse is being clicked and not held...
    if ( (mouseX > waldoX-waldoWidth/2) && (mouseX < waldoX + waldoWidth/2) ){
      if ((mouseY > waldoY - waldoWidth/2) && (mouseY < waldoY + waldoWidth/2)){
          print("I FOUND WALDO");
          win = true;

      }
    }
  }


  if (win === true){
    fill(250,40,20,20);//red
    rect(0,waldoDisplayH,width,height); //fills in dog-space;
    //display text in user interface space
    textSize(fontSize*0.7);
    textAlign(CENTER);
    fill(250,40,20);
    text("YOU FOUND ME",width/2,fontSize*1.4);
    if (waldoYinc > -1){
      waldoYinc -= 0.05;
      waldoY = sininter(waldoYinitial,waldoDisplayH/2+dog[waldoIndex].width/3,waldoYinc);
      waldoX = sininter(waldoXinitial,width/2,waldoYinc);
      print(waldoYinc);

    }
    else {
      waldoYinc = -1;
    }
  }

  else {
    //display text in user interface space
    fill(250,40,20);
    textSize(fontSize);
    textAlign(CENTER);
    text("find me",width/2,fontSize*1.4);
  }

  imageMode(CENTER);
  //draw image at full opacity until waldoYinc decreases (gamestate = won)
  tint(255, (waldoYinc+1)*255);
  //draw waldo in game-space
  image(dog[waldoIndex],waldoX,waldoY);
  //draws at full opacity
  tint(255, 255);
  //draws waldo in user interface space
  image(dog[waldoIndex],width/2,waldoDisplayH/2+dog[waldoIndex].width/3,dog[waldoIndex].width*2,dog[waldoIndex].height*2);


}

function sininter (a,b,c) { //interpolates between two values by a percentage according to a sin wave
  /*--------------------
  a = value1
  b = value2
  c = percentage to lerp (value between 0 = value a; 1 = value b)
  d = transforms c into a sin-wave based interpolation
  ----------------------*/
  //compression by pi and stretch by 2 so that if an input of 0-1 will result in output of a-b
  let d = sin(PI*c/2);
  let abDiff = abs(a - b); //find difference between two values
  let abDiffLerp = abDiff * d; //interpolate linearly
  let lerp = abDiffLerp + a; //add minium value to lerp of mean numbers to get lerp
  return lerp;
}
