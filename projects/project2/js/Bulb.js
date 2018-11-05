class Bulb{
  constructor(r,g,b,alpha,lightPop,radius){
    this.x;
    this.y;
    this.light = [];
    this.radius = radius;
    this.alpha = alpha;
    this.r = r;
    this.b = b;
    this.g = g;
    this.noiseIndex = 0;
    this.noiseIndexIncrement = 0.05;

    for (let i = 0; i < lightPop; i ++){
      this.light[i] = new Light();
      let colorVariation = (lightPop*5);
      this.light[i].r = this.r + random(-colorVariation,colorVariation);
      this.light[i].g = this.g + random(-colorVariation,colorVariation);
      this.light[i].b = this.b + random(-colorVariation,colorVariation);
    }
  }
  update(){

    // this.x = mouseX;
    // this.y = mouseY;
    this.noiseIndex += this.noiseIndexIncrement;
    let noiseValue = map(noise(this.noiseIndex),0,1,.7,1)
    // this.g = map(noise(this.noiseIndex),0,1,230,255)
    for (let i = 0; i < this.light.length; i ++){
      let angleOffset = (TWO_PI/this.light.length)*(i+.5);
      let xOffset = cos(angleOffset) * this.radius;
      let yOffset = sin(angleOffset) * this.radius;
      this.light[i].x = this.x+xOffset;
      this.light[i].y = this.y+yOffset;
      // this.light[i].g = this.g;
      this.light[i].alpha = noiseValue * (this.alpha/(this.light.length));
      this.light[i].update();
      this.light[i].display();
    }

  }
}
