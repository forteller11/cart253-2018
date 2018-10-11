class Fluid{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
  //largest values the closest to the fluid's x,y position, they also increase with the fluid's radius
  radiateValues(x2,y2){
    let dist = sqrt( sq(x2-this.x)+sq(y2-this.y) );
    let v = this.r*(1/dist);
    return v;
  }

  display(){
    ellipse(this.x,this.y,this.r);
  }

}
