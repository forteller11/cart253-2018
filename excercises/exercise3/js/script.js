/*****************

Title of Project
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let dogIndex = [];
let dog = [];
let dogPop = 20; //population of dogs
let dogImageNumber = 11; //number of dog images in assets/images
let waldoX;
let waldoY;
let framesPressed; //tracks the frames for which mouse has been pressed
let waldoDisplayW = 400; //size of canvas in which to display target dog (waldo)
let waldoDisplayH = waldoDisplayW;
let playSpaceH = waldoDisplayH*8; //play space is area to spawn dogs in
let avgImgW = 128; //avg img width
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

  createCanvas(400,waldoDisplayH+playSpaceH);
  imageMode(CORNER);
  noStroke();
  fill(250,240,70);//yellow
  rect(0,0,waldoDisplayW,waldoDisplayH); //fills in UI space
  imageMode(CORNER);
  fill(250,40,20);//red
  rect(0,waldoDisplayH,width,height); //fills in dog-space;
  imageMode(CENTER);

  //spawn random dogs randomly
  for (let i = 0; i < dogPop; i++ ) {
    let index = round(random(9));
    image(dog[index],random(waldoDisplayW),avgImgW+random(playSpaceH-64)+waldoDisplayH);
  }


  //spawn and display waldo
  imageMode(CENTER);
  waldoX = random(waldoDisplayW);
  waldoY = random(playSpaceH)+waldoDisplayH;
  let waldoIndex = round(random(9));
  waldoIndex = 10;
  image(dog[waldoIndex],waldoX,waldoY);
  waldoWidth = dog[waldoIndex].width/1.5;
  print("waldo Width:"+waldoWidth);
}

function draw(){

if (mouseIsPressed){
  framesPressed ++;
}
else {
  framesPressed = 0;
}

  if (framesPressed == 1){ //if the mouse is being clicked and not held...
    if ( (mouseX > waldoX-waldoWidth/2) && (mouseX < waldoX + waldoWidth/2) ){
      if ((mouseY > waldoY - waldoWidth/2) && (mouseY < waldoY + waldoWidth/2)){
          print("I FOUND WALDO");
      }
    }
}





}
