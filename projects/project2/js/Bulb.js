class Bulb{
  constructor(lightPop,radius){
    this.x;
    this.y;
    this.lightPop = lightPop;
    this.light = [];
    this.radius = radius;
    this.alpha = 255;

    for (let i = 0; i < this.lightPop; i ++){
      this.light[i] = new Light()
    }
  }
  update(){
    this.x = mouseX;
    this.y = mouseY;
    for (let i = 0; i < this.light.length; i ++){
      let angleOffset = TWO_PI/(i+1);
      let xOffset = cos(angleOffset) * this.radius;
      let yOffset = sin(angleOffset) * this.radius;
      this.light[i].x = this.x+(i*100);
      this.light[i].y = this.y+yOffset;
      this.light[i].alpha = (this.alpha/(this.light.length));
      this.light[i].update();
      this.light[i].display();
    }

  }
}
