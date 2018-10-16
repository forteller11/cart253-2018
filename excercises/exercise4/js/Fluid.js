class Fluid{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.radius = r;
    //rgb
    this.r = 255;
    this.g = 0;
    this.b = 255;

    this.velX = 2;
    this.velY = 0;
  }
  //largest values the closest to the fluid's x,y position, they also increase with the fluid's radius
  radiateValues(x2,y2){
    let dist = sqrt( sq(x2-this.x)+sq(y2-this.y) );
    let v = this.radius*(1/dist);
    return v;
  }

  displayRadius(){
    noStroke();
    fill(255);
    ellipse(this.x,this.y,this.radius);
  }

  move(){
    this.x+=this.velX;
    this.y+=this.velY;
  }

  outsideCanvas(){
    //if outside canvas, return true, else return false
    let r = this.r;
    if ((x > width+r) || (x < 0-r) || (y > height + r) (y <0-r)){
      return true;
    }
    else {
      return false;
    }
  }


}
