/*
The bulb class stores and sets the position of an arbitrary amount of light objects,
it spreads the lights evenly around its origin according to a radius. The Bulb gives
each light object a slightly different hue effectively create chromatic abberation
and visual flourish.
The bulb class has several movementTypes/(states) which determine the way in which
it (and its many children) moves about the canvas, according to either a sin-wave or perlin-noise function.
*/
class Bulb {
  constructor(r, g, b, alpha, lightPop, radius,moveType) {
    this.x;
    this.y;
    this.light = []; //children
    this.radius = radius; //determines how far away light-children are placed away from origin
    this.alpha = alpha;
    this.r = r;
    this.b = b;
    this.g = g;
    this.moveType = moveType; //set to interger value, determines how the Bulb updates its position
    this.thetaX = random(0,TWO_PI); //used in the sin and noise functions to determine x pos
    this.thetaY = random(0,TWO_PI); //used in the sin and noise functions to determine y pos
    this.thetaIncrement = random(0.001,.01); //used to increase thetax,y everyframe

    //create children,
    //give them a random color offset (to create subtle chromatic abberation)
    for (let i = 0; i < lightPop; i++) {
      this.light[i] = new Light();
      let colorVariation = (lightPop * 10);
      let rVariation = random(-colorVariation, colorVariation)
      let gVariation = random(-colorVariation, colorVariation)
      let bVariation = random(-colorVariation, colorVariation)
      this.light[i].rVariation = this.r + rVariation;
      this.light[i].gVariation = this.g + gVariation;
      this.light[i].bVariation = this.b + bVariation;
      this.light[i].r = this.r + this.light[i].rVariation;
      this.light[i].g = this.g + this.light[i].gVariation;
      this.light[i].b = this.b + this.light[i].bVariation;
    }
  }
  update() {
    //changes position of Bulb based on moveType
    if (this.moveType === 0){ //oscillate horizontally at bottom of canvas
      this.moveSinHorz();
      this.y = height-this.radius;
    } else if (this.moveType === 1){ //oscillate vertically in middle of canvas
      this.x = width/2;
      this.moveSinVert();
    } else if (this.moveType ===2){ //oscillate diagonally
      this.moveSinHorz();
      this.moveSinVert();
    } else if (this.moveType === 3){ //oscillate horizontally at top of canvas
      this.y = this.radius;
      this.moveSinHorz();
    } else if (this.moveType === 4){ //move according to perlin noise within canvas
      this.moveNoise();
    }
    else if (this.moveType === 5){ //oscillate vertically at right of canvas
      this.x = width-this.radius;
      this.moveSinVert();
    }else if (this.moveType === 6){ //oscillate vertically at left of canvas
      this.x = this.radius;
      this.moveSinVert();
    }

    this.spreadLights(); //set light position

    //set lights' color to Bulb's color with their color offsets (cVariations)
    for (let i = 0; i < this.light.length; i++) {
      this.light[i].r = this.r + this.light[i].rVariation;
      this.light[i].g = this.g + this.light[i].gVariation;
      this.light[i].b = this.b + this.light[i].bVariation;
      this.light[i].alpha = (this.alpha / (this.light.length));
      this.light[i].update();
      this.light[i].display();
    }

  }
  moveNoise(){
    this.thetaY += this.thetaIncrement/10;
    this.thetaX += this.thetaIncrement/10;
    this.x = map(noise(this.thetaX*10),0,1,0,width-this.radius);
    this.y = map(noise(this.thetaY*10),0,1,0,height-this.radius);

  }
  moveSinVert(){
    this.thetaY += this.thetaIncrement;
    this.y = map(sin(this.thetaY),-1,1,this.radius,height-this.radius);
  }
  moveSinHorz(){
    this.thetaX += this.thetaIncrement;
    this.x = map(sin(this.thetaX),-1,1,this.radius,width-this.radius);
  }
  spreadLights(){ //revolves lights around Bulb's origin evenly (polar-->cartesian)
    for (let i = 0; i < this.light.length; i++) {
      let angleOffset = (TWO_PI / this.light.length) * (i + .5);
      let xOffset = cos(angleOffset) * this.radius;
      let yOffset = sin(angleOffset) * this.radius;
      this.light[i].x = this.x + xOffset;
      this.light[i].y = this.y + yOffset;
    }
  }

  display(){ //creates a blurred ellipse where the Bulb is
    fill(lightColorR,lightColorG,lightColorB,(this.alpha/this.radius));
    for (let j = 0; j < this.radius*2; j +=4){
      ellipse(this.x,this.y,j);
    }
  }

}
