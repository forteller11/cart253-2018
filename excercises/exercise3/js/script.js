/*****************

Title of Project
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let dogIndex = [];
let dog;
function preload() {
let ii = i;
  for (var i = 0; i <= 10; i++) { //fills the array with all dog images
    ii = i;
    dogIndex[i-1] = "assets/images/animals-"+ii+".png";
  }
  //loads a random dogimage
  dog = loadImage( dogIndex[round(random(9))] );

}
function setup() {
  createCanvas(windowWidth,windowHeight);
  image(dog, 0, 0);
}
