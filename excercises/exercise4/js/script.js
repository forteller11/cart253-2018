/*****************

Exercise 4
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!

Credits:
My original introduction to metaballs was in Nathan Auckett's
youtube video titled "How to make Metaballs in Gamemaker Studio 1 and 2"

Daniel Shiffman's "Coding Challenge #28: Metaballs" helped me
particularly with my "radiateValues" function found in my Fluid class

Daniel Shiffman's "Coding Challenge #90: Floyd-Stienberg Dithering"
was my main introduction to the p5.js pixel array and gave me the idea
of using thresholds to display the fluid objects
******************/
let fluidPop = 20;
let fluid = [];
let fluidDisplayThreshold = 1;

function setup(){
  createCanvas(600,600);
  pixelDensity(1); //so pixel array behaves uniformly between dispalys w/natively dissimilar pixel densities
  for (let i = 0; i < fluidPop; i ++){
    fluid[i] = new Fluid(random(width),random(height),random(2,6));
  }
}

function draw(){
  background(51);
  for (let i = 0; i < fluidPop; i ++){
    //fluid[i].displayRadius();
    fluid[i].move();
  }
  fluid[0].x = mouseX;
  fluid[0].y = mouseY;

  //go through every pixel in pixel array, add up all values from the metaballs
  //(values radiate from the x,y centers of each metaball,
  //draw that pixel if those values surpasses a threshold

  loadPixels();
  //display metaballs
  for (let i = 0; i < width; i ++){
    for (let j = 0; j < height; j ++){
      let index = ( i*4 + (j*width*4) );
      let netRadiateValue = 0;
      for (let k = 0; k < fluidPop; k++){
        netRadiateValue += fluid[k].radiateValues(i,j);
      }
      //if all the radiate values combined are greater than displaythreshold draw pixels
      if (netRadiateValue > fluidDisplayThreshold)
      {

        //add to pixel array so that metaballs from two different paddles can combine colors
        pixels[index+0] += 180; //r
        pixels[index+1] += 100; //g
        pixels[index+2] += 180; //b
        pixels[index+3] += 255; //alpha

      }
    }
  }
  updatePixels();

  //print(round(fluid[0].radiateValues(mouseX,mouseY)));


}
