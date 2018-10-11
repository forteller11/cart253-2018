class Fluid{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
  }

  displayMetaball(){
  }

  display(){
    ellipse(this.x,this.y,this.r);
  }

}
