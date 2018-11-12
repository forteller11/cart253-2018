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
  }

  display(){ //draw line from start/end points of line
    strokeWeight(2);
    stroke(this.r,this.g,this.b,100);
    line(this.x1,this.y1,this.x2,this.y2);
  }
}
