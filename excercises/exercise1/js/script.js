/* _____________________________
Exercise1
Charly Yan Miller
A program in which...
  a shape moves across the screen,
  An image appears at the mouse location
  An image follows the mouse
  A shape moves across the screen following a sin wave
_______________________________*/

//shape1
let shape1x; //starting xpos of shape1
let shape1y; //starting ypos of shape 1
const shape1r = 20; //radius of shape 1
const shape1xinc = 1; //constant at which to increment shape 1's xpos

//img 1
let img1;
const img1_scale = 0.2;

//img 2
let img2;
const img2_scale = 0.6;
const img2_followspeed = 10; //the higher the number the less quickly img2 will catch up to the mouse;
let img2_x = 0;
let img2_y = 0;

//shape 3
let shape3x; //xpos of shape 3;
let shape3y; //ypos of shape 3;
const shape3r = 10; //radius of shape 3
const shape3xinc = 1; //constant at which to increment shape 3's xpos

function preload(){
img1 = loadImage("assets/images/thing1.png");

img2 = loadImage("assets/images/thing2.png");
}

function setup(){
  angleMode(RADIANS);
  createCanvas(displayWidth,displayHeight); //create canvas with the same dimensions as the screen resolution;

  //shape 1
  shape1x = 0 - shape1r; //starting xpos of shape 1 set to just left of the drawn canvas
  shape1y = height/2; //starting ypos of shape 1 set to middle of screen;

  //shape 3
  shape3x = 0 - shape1r;
  shape = height/2;

}

function draw(){
  background(255); //fill the screen with dark grey;

  //shape1
  shape1x += shape1xinc;
  ellipse(shape1x,shape1y,shape1r); //draw shape 1

  //image 1
  imageMode(CENTER);
  image(img1,mouseX,mouseY,img1.width * img1_scale,img1.height * img1_scale);

  //image 2
  img2_x = img2_x + (mouseX-img2_x)/img2_followspeed;
  img2_y = img2_y + (mouseY-img2_y)/img2_followspeed;
  image(img2,img2_x,img2_y,img2.width * img1_scale,img2.height * img1_scale);

  //shape 3
  shape3y = (sin(shape3x/100) * height/4) + height/2; //function of a sin wave with a horizontal stretch of 100, a vertical compression of 4, and a vertical displacements downards of half of the canvas
  shape3x += shape3xinc; //itterate through the xpositions
  ellipse(shape3x,shape3y,shape3r); //draw the current x-y relationship of the sin function with a circle
  console.log(shape3y);



}
