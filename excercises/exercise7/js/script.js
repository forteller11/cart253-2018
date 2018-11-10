
let player;
let shape = [];

function setup(){
createCanvas(windowWidth/1.1,windowHeight/1.1);
for (let i = 0; i < 4; i++){
  shape[i] = new Shape(random(width),random(height),random(TWO_PI),round(random(3,8)));
  for (let j = 0; j < shape[i].vertNumber; j++){
      shape[i].vertAOff[j] = (TWO_PI/shape[i].vertNumber)*j;
        shape[i].vertR[j] = 40;
  }
}
player = new Player(width/2,height/2,0);
}

function draw(){
  background(51);
  for (let i = 0; i < shape.length; i++){
shape[i].update();
shape[i].display();
  }
  player.update();

}
