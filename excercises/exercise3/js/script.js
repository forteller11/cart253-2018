/*****************

Title of Project
Charly Yan Miller

This is a template. You must fill in the title,
author, and this description to match your project!
Sidenote: I kinda thought all the animals were faces for some reason,
so because of this var names tend to feature the word "face";
******************/
let faceIndex = []; //containing strings of file directories
let faceImg = []; //containing images of faces
let face = []; //containg face objs
let findMeImg; //img of text "find me"
let youFoundMeImg; //img of text "YOU FOUND ME"
let youFoundMe = [];
let youFoundMeExists = false; //does instance youFoundMe exist?
let frameImg; //img of frame sourronding UI
let facePop = 40; //population of faces
let facePopExtra = 0; //number of faces more than starting facePop
let faceImageNumber = 11; //number of face-images in assets/images
let waldoX;
let waldoXinitial;
let waldoY;
let waldoYinitial;
let waldoYinc = 0; //rate at which to interpolate waldo's Y pos
let framesPressed; //tracks the frames for which mouse has been pressed
let waldoDisplayW = 400; //size of canvas in which to display target face (waldo)
let waldoDisplayH = waldoDisplayW;
let waldoIndex; //make index of waldo a global var
let playSpaceH = waldoDisplayH*8; //play space is area to spawn faces in
let imgW = 128; //avg img width
let fontSize = 60;
let win = false; //have you found waldo? FALSE
let r = 250;
let g = 240;
let b = 70;

//preload: fills array "faceImg[]" with all animal images; loads UI assets
function preload() {
//fills the faceIndex array with strings/directories to all face images
  for (var i = 0; i <= faceImageNumber; i++) {
    faceIndex[i-1] = "assets/abstract_images/animals-"+i+".png";
  }

  //fills the face array with images containing all face images
  for (var i = 0; i <= faceImageNumber-1; i++) {
    faceImg[i] = loadImage(faceIndex[i]);
  }

  //load UI
  findMeImg = loadImage("assets/abstract_images/UI-find_me.png");
  youFoundMeImg = loadImage("assets/abstract_images/UI-you_found_me.png");
  frameImg = loadImage("assets/abstract_images/UI-frame.png");
}
/*------------------------------------------
Setupfunction:
creates canvas and fills it w/yellow
//sets the faceindex, position, and size waldo hitbox (waldoIndex)
spawn instances of Face at random locations and draw them
-----------------------------------*/
function setup() {
  //create canvas, fill WaldoDisplay and playarea with distinct colors
  createCanvas(400,waldoDisplayH+playSpaceH);
  background(r,g,b);

  noStroke();

  //spawn and set waldo vars
  //set index of waldo (animal to be found) to random animal/image
  waldoIndex = round(random(9));
  //set or get vars of waldo image
  waldoX = random(waldoDisplayW);
  waldoXinitial = waldoX;
  waldoY = random(playSpaceH)+waldoDisplayH+imgW;
  waldoYinitial = waldoY;
  waldoWidth = faceImg[waldoIndex].width/1.5; //waldoWidth used for hitbox

  //spawn all non-waldo faces
  for (let i = 0; i < facePop; i++ ) {
  face[i] = new Face();
  face[i].display(255);
  }
}

function draw(){
//Allows program to know if mouse is being pressed, held, and for how many frames
if (mouseIsPressed){
  framesPressed ++;
}
else {
  framesPressed = 0;
}

  if (framesPressed === 1) { //if the mouse is being clicked and not held...
    //if mouse is ontop of waldo
    if ( (mouseX > waldoX-waldoWidth/2) && (mouseX < waldoX + waldoWidth/2) ){
      if ((mouseY > waldoY - waldoWidth/2) && (mouseY < waldoY + waldoWidth/2)){
          print("I FOUND WALDO");
          win = true;
      }

    }
    //if mouse clicks NOT on waldo, spawn random waldo-looking face
    if( win === false) {
      facePopExtra ++;
      face [facePop + facePopExtra] = new Face;
      face[facePop + facePopExtra].index = waldoIndex;
      face[facePop + facePopExtra].display();
    }
  }

  //if waldo has been clicked
  if (win === true){

    //slowly fade out facesand leave a brief trail with all moving objs
    background(r,g,b,150);
    //display  YOU FOUND ME in user interface space, randomly flash faces
    for (i = 0; i < facePop; i ++){
    }
    face[round(random(facePop-1))].display(50);
    if (youFoundMeExists === false){ //if text "youFoundMe" doesn't exist, create instances
      for (i = 0; i < 12; i ++){
        youFoundMe[i] = new YouFoundMe(width/2,i*height/12,youFoundMeImg.width*waldoDisplayW/900,youFoundMeImg.height*waldoDisplayW/900);
        youFoundMeExists = true;
      }
    }
     //if instance of texts does exist, draw it, and translate it down
     else {
       for (i = 0; i < 12; i ++){
        youFoundMe[i].display();
        youFoundMe[i].move(0,20);
      }
    }

    //interpolate playspace waldo's position until it equals UI waldo
    if (waldoYinc > -1){
      waldoYinc -= 0.05;
      waldoY = sininter(waldoYinitial,waldoDisplayH/2+faceImg[waldoIndex].width/3,waldoYinc);
      waldoX = sininter(waldoXinitial,width/2,waldoYinc);
      print(waldoYinc);
    }
  }

  else { //if win != true...
    //display "find me" in user interface space
    fill(r,g,b);
    rect(0,0,waldoDisplayW,waldoDisplayH); //fills in UI space
    image(findMeImg,width/2,waldoDisplayH/7,findMeImg.width*waldoDisplayW/900,findMeImg.height*waldoDisplayW/900);
  }

  //draw waldos...
  imageMode(CENTER);
  //draw image at full opacity until win, then fade out as gamespace waldo meets UI waldo
  tint(255, (waldoYinc+1)*255);
  //draw waldo in game-space
  image(faceImg[waldoIndex],waldoX,waldoY,imgW,imgW);
  //draws UI waldo at full opacity ALWAYS
  tint(255, 255);
  //draws waldo and frame in user interface space
  image(faceImg[waldoIndex],width/2,waldoDisplayH/1.6,waldoDisplayW/1.4,waldoDisplayW/1.4);
  image(frameImg,width/2,waldoDisplayH/1.6,waldoDisplayW/1.3,waldoDisplayW/1.3);




}


class YouFoundMe {
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  move(x,y){
    this.x += x;
    this.y += y;

    //screenwrap
    if (this.x - this.w/2 > width) { //if off right
      this.x = 0-this.w/2;
    }
    else if (this.x < 0 - this.w/2) { //if off left
      this.x = width+this.w/2;
    }
    if (this.y - this.w/2 > height) { //if off right
      this.y = 0-this.w/2;
    }
    else if (this.y < 0 - this.w/2) { //if off left
      this.y = height+this.w/2;
    }

  }

  display() {
    tint(255, 255);
    image(youFoundMeImg,this.x,this.y,this.w,this.h);
  }

}
class Face {
  constructor () {
  //spawn non waldo-animals randomly in play-space
    this.index = round(random(9)); //random face image index
    while (this.index === waldoIndex){ //make sure a waldo-type-face isn't spawned
      this.index = round(random(9));
    }
    this.x = random(waldoDisplayW-(imgW/6)+(imgW/3));
    this.y = waldoDisplayH+(imgW/1.5)+random(playSpaceH-imgW);
    this.w = imgW;
    this.h = imgW;
  }

  display (a){
    //a = opacity 1-255 of image;
    tint(255,a);
    imageMode(CENTER);
    image(faceImg[this.index],this.x,this.y,this.w,this.h);
  }

  move (x,y){
    //x = dist x to move
    //y = dist y to move

    this.x += x;
    this.y += y;

    //screenwrap
    if (this.x - this.w/2 > width) { //if off right
      this.x = 0-this.w/2;
    }
    else if (this.x < 0 - this.w/2) { //if off left
      this.x = width+this.w/2;
    }
    if (this.y - this.w/2 > height) { //if off right
      this.y = 0-this.w/2;
    }
    else if (this.y < 0 - this.w/2) { //if off left
      this.y = height+this.w/2;
    }
  }


}


function sininter (a,b,c) { //interpolates between two values by a percentage according to a sin wave
  /*--------------------
  a = value1
  b = value2
  c = percentage to lerp (value between 0 = value a; 1 = value b)
  d = transforms c into a sin-wave based interpolation
  ----------------------*/
  //compression by pi and stretch by 2 so that if an input of 0-1 will result in output of a-b
  let d = sin(PI*c/2);
  let abDiff = abs(a - b); //find difference between two values
  let abDiffLerp = abDiff * d; //interpolate linearly
  let lerp = abDiffLerp + a; //add minium value to lerp of mean numbers to get lerp
  return lerp;
}
