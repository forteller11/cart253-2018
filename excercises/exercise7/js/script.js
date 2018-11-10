
let player;
function setup(){
createCanvas(windowWidth/1.1,windowHeight/1.1);
player = new Player(width/2,height/2,0);
}

function draw(){
  background(51);
  player.update();

}
