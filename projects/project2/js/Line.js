class Line{
  constructor(x1,y1,x2,y2){
  this.x1 = 0;
  this.y1 = 0;
  this.x2 = 0;
  this.y2 = 0;
  }

  display(){
    stroke(200);
    line(this.x1,this.y1,this.x2,this.y2);
  }
}
