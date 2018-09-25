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
  dogIndex[i-1]=  loadImage("assets/images/animals-"+ii+".png");
  }


}
let dogNumber = 0;

function setup() {
  while (dogNumber < 25){
    dogNumber++;
    image( dog[],random(width),random(height) );
  }
  createCanvas(windowWidth,windowHeight);
  background(250,240,70);
  //loads a random dogimage
image(dogIndex[round(random(9))]) ;
}
