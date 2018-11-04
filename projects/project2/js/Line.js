class Line {
  constructor(x1,y1,x2,y2){
  this.x1;
  this.y1;
  this.x2;
  this.y2;
  }

  display(){
    strokeWeight(2);
    stroke(200);
    line(this.x1,this.y1,this.x2,this.y2);
  }
}
