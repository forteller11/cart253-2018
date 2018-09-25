/*****************

Title of Project
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let dogIndex = [];
let dog = [];
let dogPop = 200; //population of dogs
function preload() {
let ii = i;
  for (var i = 0; i <= 10; i++) { //fills the array with all dog images
    ii = i;
    dogIndex[i-1] = "assets/images/animals-"+ii+".png";

  }
  //loads a random dogimage
  for (var i = 0; i <= 9; i++) {
    dog[i] = loadImage(dogIndex[i]);
  }
}

function setup() {
  imageMode(CENTER);
  createCanvas(windowWidth,windowHeight);
  background(250,240,70);
  for (let i = 0; i < dogPop; i++ ) {
  image(dog[round(random(9))],random(width),random(height));
}



}
