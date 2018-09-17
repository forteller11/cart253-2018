
//shape1
let shape1x; //starting xpos of shape1
let shape1y; //starting ypos of shape 1
const shape1r = 20; //radius of shape 1
const shape1xinc = 1; //constant at which to increment shape 1's xpos
let img1;

function preload(){
img1 = loadImage("assets/images/thing1.png");
}

function setup(){
  createCanvas(displayWidth,displayHeight); //create canvas with the same dimensions as the screen resolution;
  shape1x = 0 - shape1r; //starting xpos of shape 1 set to just left of the drawn canvas
  shape1y = height/2; //starting ypos of shape 1 set to middle of screen;

}

function draw(){
  background(255); //fill the screen with dark grey;
  shape1x += shape1xinc;
  ellipse(shape1x,shape1y,shape1r); //draw shape 1
  image(img1,0,0);


}
