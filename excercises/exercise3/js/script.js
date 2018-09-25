/*****************

Title of Project
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let dogIndex = [];
let dog = [];
let dogPop = 20; //population of dogs
let dogImageNumber = 11; //number of dog images

function preload() {
let ii = i;
  for (var i = 0; i <= dogImageNumber; i++) { //fills the array with all strings of all dog repositories
    ii = i;
    dogIndex[i-1] = "assets/images/animals-"+ii+".png";

  }
  //loads a random dogimage
  for (var i = 0; i <= dogImageNumber-1; i++) {
    dog[i] = loadImage(dogIndex[i]);
  }
}

function setup() {
  imageMode(CENTER);
  createCanvas(windowWidth,windowHeight);
  background(250,240,70);

  //spawn dogs
  for (let i = 0; i < dogPop; i++ ) {
  image(dog[round(random(9))],random(width),random(height));
  //spawn special dog;
}



}
