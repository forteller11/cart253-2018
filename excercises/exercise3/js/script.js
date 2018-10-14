/*****************

Find a Face
Charly Yan Miller

In which a randomly chosen face is chosen to be "waldo" (a face which you must find)
once waldo is found, text "you found me" scrolls down the screen and wraps.

******************/
let faceIndex = []; //containing strings of file directories
let faceImg = []; //containing images of faces
let face = []; //containg face objs
let findMeImg; //img of text "find me"
let youFoundMeImg; //img of text "YOU FOUND ME"
let youFoundMe = [];
let youFoundMeExists = false; //does instance youFoundMe exist?
let frameImg; //img of frame sourronding UI
let facePop = 100; //population of faces
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
let g = 255;
let b = 255;

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
Setup function:
creates canvas and fills it w/yellow
sets the image, position, and size (hitbox) of Waldo (the thing to be found)
spawn instances of Face (non waldo faces) at random locations and draw them
-----------------------------------*/
function setup() {
  //create canvas, fill WaldoDisplay and playarea with distinct colors
  createCanvas(waldoDisplayW,waldoDisplayH+playSpaceH);
  background(r,g,b);

  noStroke();

  //spawn and set waldo vars
  //set index of waldo (animal to be found) to random animal/image
  waldoIndex = round(random(9));
  //set or get vars of waldo image
  waldoX = random(waldoDisplayW-imgW)+(imgW/2);
  waldoXinitial = waldoX;
  waldoY = random(playSpaceH-imgW)+waldoDisplayH+(imgW/2);
  waldoYinitial = waldoY;
  waldoWidth = faceImg[waldoIndex].width/1.5; //waldoWidth used for hitbox

  //spawn all non-waldo faces
  for (let i = 0; i < facePop; i++ ) {
    let rr = random(0.8,1.2);
    face[i] = new Face(imgW*rr,imgW*rr); //the constructor handles the randomization of starting position
    face[i].display(255); //draw them at full opacity
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
    //if mouse clicks NOT on waldo, spawn random waldo-looking face (anti-abuse mechanic)
    if( win === false) {
      facePopExtra ++;
      let rr = random(0.8,1.2)
      face [facePop + facePopExtra] = new Face(imgW*rr,imgW*rr);
      face[facePop + facePopExtra].index = waldoIndex;
      face[facePop + facePopExtra].display();
    }
  }

  //if waldo has been clicke
  if (win === true){
    //slowly fade out faces and leave a brief trail with all moving objs
    background(r,g,b,150);
    //make random non-waldo faces flash into visibility briefly
    for (i = 0; i < facePop; i ++){
    }
    face[round(random(facePop-1))].display(200);
    //if instances of "youFoundMe" don't exist, create instances
    if (youFoundMeExists === false){
      for (i = 0; i < 12; i ++){
        youFoundMe[i] = new YouFoundMe(width/2,i*height/12,youFoundMeImg.width*waldoDisplayW/900,youFoundMeImg.height*waldoDisplayW/900);
        youFoundMeExists = true;
      }
    }
     //if instance of texts do exist, draw them, and translate them down
     else {
       for (i = 0; i < 12; i ++){
        youFoundMe[i].display();
        youFoundMe[i].move(0,20);
      }
    }

    //interpolate playspace waldo's position until it equals UI waldo
    //(make waldo in playspace move to meet the UI waldo)
    if (waldoYinc > -1){
      waldoYinc -= 0.05;
      waldoY = sininter(waldoYinitial,waldoDisplayH/2+faceImg[waldoIndex].width/3,waldoYinc);
      waldoX = sininter(waldoXinitial,width/2,waldoYinc);
      print("waldoYinc: " + waldoYinc);
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
  constructor (w,h) {
  //spawn non waldo-animals randomly in play-space
    this.index = round(random(9)); //random face image index
    while (this.index === waldoIndex){ //make sure a waldo-type-face isn't spawned
      this.index = round(random(9));
    }
    this.x = random(waldoDisplayW-imgW)+(imgW/2);
    this.y = (imgW/2)+random(playSpaceH-imgW);

    while (this.y < waldoDisplayH+imgW)  { //if y of image intersects displaySpace,
      this.x = random(waldoDisplayW-imgW)+(imgW/2);
      this.y = (imgW/2)+random(playSpaceH-imgW);
    }
    this.w = w;
    this.h = h;
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
