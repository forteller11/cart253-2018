/*****************

Exercise 4
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let fluidPop = 20;
let fluid = [];

function setup(){
  createCanvas(200,200);
  for (let i = 0; i < fluidPop; i ++){
    fluid[i] = new Fluid(random(width),random(height),15);
  }
}

function draw(){
  background(51);
  for (let i = 0; i < fluidPop; i ++){
    fluid[i].display();
  }

  //go through every pixel in pixel array, add up all values from the metaballs, draw them if surpasses threshold
  loadPixels();
  for (let i = 0; i < width; i ++){
    for (let j = 0; j < height; j ++){
      let index = 4*( i + (j*width) );
      for (let k = 0; k < fluidPop; k++){
      }

    }
  }
  updatePixels();

}
