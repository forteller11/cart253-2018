/*
Line stores two verts as its end points, this is used by the Ray class to create
a linear function and check for collision.

*/

class Line {
  constructor(x1,y1,x2,y2){
  this.x1;
  this.y1;
  this.x2;
  this.y2;
  this.h1;//height of vert
  this.h2;

  this.r;
  this.g;
  this.b;
  this.alpha;
  this.stripeH = [];
  this.stripeW = [];
  }

  display(){ //draw line from start/end points of line
    if (twoDisplay === true){
      strokeWeight(8);
      stroke(this.r,this.g,this.b,this.alpha);
      line(this.x1-(player.x)+width/2,this.y1-(player.y)+height/2,this.x2-(player.x)+width/2,this.y2-(player.y)+height/2);
    }
  }
}
