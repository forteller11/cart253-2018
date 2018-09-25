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
let ii = i;
//fills the array with all strings of all dog repositories
  for (var i = 0; i <= dogImageNumber; i++) {
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
    let index = round(random(9));
    image(dog[index],random(width),random(height));
  }


  //spawn and display waldo
  waldoX = random(width);
  waldoY = random(height);
  let index = round(random(9));
  image(dog[index],random(width),random(height));







}
