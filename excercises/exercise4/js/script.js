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
let padR; //right paddle
let padL; //let paddle
let horzPaddleIndent = 32; //indent of paddle
let minStrokeWidth = 2;
let maxStrokeWidth = 8;

function setup(){
  createCanvas(800,800);
  pixelDensity(1); //so pixel array behaves uniformly between dispalys w/natively dissimilar pixel densities
  for (let i = 0; i < fluidPop; i ++){
    fluid[i] = new Fluid(random(width),random(height),random(2,6));
  }
  //intiialize right paddle with appropriate key codes and r,g,b values
  padR = new Paddle(38,40,37,39,77,232,97,76);
  padR.padLeft = false; //tells the paddle that it is right
  //set appropriate position, give paddle a full fluid-meter and set velocity to 0
  padRReset();

  //intiialize left paddle with corresponding key codes and rgb color values
  padL= new Paddle(87,83,65,68,69,80,164,229);
  padR.padLeft = true; //tells the paddle that it is left
  //set appropriate position, give paddle a full fluid-meter and set velocity to 0
  padLReset();

}

function draw(){
  background(0);

  //deal with paddles input, movement etc...
  padR.displayFluidMeter();
  padL.displayFluidMeter();
  padR.displayPaddle();
  padL.displayPaddle();
  padR.accelerate();
  padL.accelerate();
  padR.changePos();
  padL.changePos();

  for (let i = 0; i < fluidPop; i ++){
    //fluid[i].displayRadius();
    fluid[i].move();
  }
  fluid[0].x = mouseX;
  fluid[0].y = mouseY;

  // //go through every pixel in pixel array, add up all values from the metaballs
  // //(values radiate from the x,y centers of each metaball,
  // //draw that pixel if those values surpasses a threshold
  //
  // loadPixels();
  // //display metaballs
  // for (let i = 0; i < width; i ++){
  //   for (let j = 0; j < height; j ++){
  //     let index = ( i*4 + (j*width*4) );
  //     let netRadiateValue = 0;
  //     for (let k = 0; k < fluidPop; k++){
  //       netRadiateValue += fluid[k].radiateValues(i,j);
  //     }
  //     //if all the radiate values combined are greater than displaythreshold draw pixels
  //     if (netRadiateValue > fluidDisplayThreshold)
  //     {
  //
  //       //add to pixel array so that metaballs from two different paddles can combine colors
  //       pixels[index+0] += 180; //r
  //       pixels[index+1] += 100; //g
  //       pixels[index+2] += 180; //b
  //       pixels[index+3] += 255; //alpha
  //
  //     }
  //   }
  // }
  // updatePixels();

}

function padRReset(){
  padR.x = width - horzPaddleIndent;
  padR.y = height/2;
  padR.velX = 0;
  padR.velY = 0;
  padR.fluidMeter = 1;
}

function padLReset(){
  padL.x = horzPaddleIndent;
  padL.y = height/2;
  padL.velX = 0;
  padL.velY = 0;
  padL.fluidMeter = 1;
}
