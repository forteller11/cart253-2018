
//shape1
let shape1x; //starting xpos of shape1
let shape1y; //starting ypos of shape 1
const shape1r = 20; //radius of shape 1
const shape1xinc = 1; //constant at which to increment shape 1's xpos

let img1;
const img1_scale = 0.2;

let img2;
const img2_scale = 0.6;
const img2_followspeed = 10; //the higher the number the less quickly img2 will catch up to the mouse;
let img2_x = 0;
let img2_y = 0;
function preload(){
img1 = loadImage("assets/images/thing1.png");

img2 = loadImage("assets/images/thing2.png");
}

function setup(){
  createCanvas(displayWidth,displayHeight); //create canvas with the same dimensions as the screen resolution;

  //shape 1
  shape1x = 0 - shape1r; //starting xpos of shape 1 set to just left of the drawn canvas
  shape1y = height/2; //starting ypos of shape 1 set to middle of screen;

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

  console.log(img2_x);

}
