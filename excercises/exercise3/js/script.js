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
  imageMode(CENTER);
  createCanvas(400,400);
  background(250,240,70);

  //spawn random dogs randomly
  for (let i = 0; i < dogPop; i++ ) {
    let index = round(random(9));
    image(dog[index],random(width),random(height));
  }


  //spawn and display waldo
  imageMode(CENTER);
  waldoX = random(width);
  waldoY = random(height);
  let waldoIndex = round(random(9));
  waldoIndex = 10;
  image(dog[waldoIndex],waldoX,waldoY);
  waldoWidth = dog[waldoIndex].width/1.5;
  print("waldo Width:"+waldoWidth);
}

function draw(){

  //if mouse is on top of waldo...
  if ( (mouseX > waldoX-waldoWidth/2) && (mouseX < waldoX + waldoWidth/2) ){
    if ((mouseY > waldoY - waldoWidth/2) && (mouseY < waldoY + waldoWidth/2)){
        print("I FOUND WALDO");
    }
  }





}
