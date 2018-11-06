class Bulb {
  constructor(r, g, b, alpha, lightPop, radius) {
    this.x;
    this.y;
    this.light = [];
    this.radius = radius;
    this.alpha = alpha;
    this.r = r;
    this.b = b;
    this.g = g;
    this.moveType = 0;
    this.thetaX = random(0,TWO_PI);
    this.thetaY = random(0,TWO_PI);
    this.thetaIncrement = random(0.001,.01);

    for (let i = 0; i < lightPop; i++) {
      this.light[i] = new Light();
      let colorVariation = (lightPop * 3);
      this.rVariation = random(-colorVariation, colorVariation)
      this.gVariation = random(-colorVariation, colorVariation)
      this.bVariation = random(-colorVariation, colorVariation)
      this.light[i].r = this.r + this.rVariation;
      this.light[i].g = this.g + this.gVariation;
      this.light[i].b = this.b + this.bVariation;
    }
  }
  update() {
    this.moveSinHorz();
    this.moveSinVert();
    for (let i = 0; i < this.light.length; i++) {
      this.light[i].r = this.r + this.rVariation;
      this.light[i].g = this.g + this.gVariation;
      this.light[i].b = this.b + this.bVariation;
    }
    this.spreadLights();

  }
  moveSinVert(){
    this.thetaY += this.thetaIncrement;
    this.y = map(sin(this.thetaY),-1,1,this.radius,height-this.radius);
  }
  moveSinHorz(){
    this.thetaX += this.thetaIncrement;
    this.x = map(sin(this.thetaX),-1,1,this.radius,width-this.radius);
  }
  spreadLights(){
    for (let i = 0; i < this.light.length; i++) {
      let angleOffset = (TWO_PI / this.light.length) * (i + .5);
      let xOffset = cos(angleOffset) * this.radius;
      let yOffset = sin(angleOffset) * this.radius;
      this.light[i].x = this.x + xOffset;
      this.light[i].y = this.y + yOffset;
      // this.light[i].g = this.g;
      this.light[i].alpha = (this.alpha / (this.light.length));
      this.light[i].update();
      this.light[i].display();
    }
  }

  display(){
    fill(lightColorR,lightColorG,lightColorB,255/this.radius);
    for (let j = 0; j < this.radius; j ++){
      ellipse(this.x,this.y,j);
    }
  }

}
