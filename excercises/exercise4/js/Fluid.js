class Fluid{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.radius = r;

    this.velX = random(1,2.5);
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
    //ellipse(this.x,this.y,this.radius);
  }

  move(){
    if (this.radius > 1){
      this.radius -= random(0.01,0.1);
    }

    this.x+=this.velX;
    this.y+=this.velY;
  }

  outsideCanvas(){
    //if outside canvas, return true, else return false
    let r = this.radius;
    if ((this.x > width+(r*8)) || (this.x < -(r*8)) || (this.y > height) || (this.y < 0)){
      return true;
    }
    else {
      return false;
    }
  }





}
