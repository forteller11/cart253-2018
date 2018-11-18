/*
Shape stores an arbitrary number of verts by storing their angle and radius relative
to the shape's origin point, then it calculates the cartesian coords of the vertexes
every frame. It also creates instance of the Line class which it gives two verts as
the lines start and end points.

*/
class Shape {
  constructor(x, y, angle, vertNumber) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vertNumber = vertNumber;
    this.vertAOff = []; //angle offset of vertex
    this.vertR = []; //radius of vertex (dist from origin (this.x,y))
    this.vertH = [];
    this.vertX = [];
    this.vertY = [];
    this.lines = []; //array which stores lines
    this.vertHIncrement = [];
    this.r;
    this.b;
    this.g;
    this.alpha;
    this.source = [];
    this.stripeH = []; //heigh tof a given stripe, from 0-1, 0 being located at base of shape and 1 at top
    this.stripeW = []; //strokewidth of stripe

    //create one line for every vertex
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i] = new Line();
      this.lines[i].stripeH = [];
      this.lines[i].stripeW = [];
      this.source[i] = new Source(this.x,this.y);
    }

    const stripeNumber = round(5);
    for (let i = 0; i < stripeNumber; i ++){
      this.stripeH[i] = random(1);
      this.stripeW[i] = random(10);

    }
  }

  update() {
    // ellipse(this.x,this.y,20);
    //based on angleOffset+radius of vertex determine is cartesian coords
    this.updateVertCartesian();
    this.updateVertHeight();
    this.updateLines(); //update the end/start points of each line
    this.updateSource();
  }
  updateSource(){
    for (let i = 0; i < this.vertNumber; i++) {
      this.source[i].x = this.vertX[i];
      this.source[i].y = this.vertY[i];
      this.source[i].update();
    }
  }

  updateVertCartesian() { //updates x,y of verts based on angleOffset, shape's angle, and verts' radius
    for (let i = 0; i < this.vertNumber; i++) {
      this.vertX[i] = (cos(this.vertAOff[i] + this.angle) * this.vertR[i]) + this.x;
      this.vertY[i] = (sin(this.vertAOff[i] + this.angle) * this.vertR[i]) + this.y;
    }
  }
  updateVertHeight(){
    for (let i = 0; i < this.vertHIncrement.length; i++) {
      let distToPlayer = sqrt(sq(this.x-player.x)+sq(this.y-player.y));
      let heightChange = map(distToPlayer,0,width,.02,.002);
      heightChange = constrain(heightChange,0,100);
      // this.vertH[i] = map(this.source.netAmplitudeStore,-1,1,0,1);
      this.vertHIncrement[i] += heightChange;
      let heightChangeNoise =  noise(this.vertHIncrement[i]);
      let heightChangeSound = map(this.source[i].avgAmplitudeStore,0,1,0,1);
      heightChangeSound = constrain(heightChangeSound,0,1);
      this.vertH[i] = (.0*heightChangeNoise)+(1*heightChangeSound);
      // print(heightChangeSound);
    }
  }

  updatePolarBasedOnCartesian() {
    for (let i = 0; i < this.vertNumber; i++) {
      print(this.vertX[i]);
      this.vertAOff[i] = atan2(this.vertY[i]-this.y, this.vertX[i] - this.x);
      this.vertR[i] = sqrt(sq(this.vertX[i] - this.x) + sq(this.vertY[i] - this.y));
      print(this.vertY[i]);
    }
  }
  updateLines() {
    //recalc x1 and y1 of shape based on position of shape and vertexes.
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i].x1 = this.vertX[i];
      this.lines[i].y1 = this.vertY[i];
      this.lines[i].h1 = this.vertH[i];
      if (i + 1 >= this.vertNumber) {
        this.lines[i].x2 = this.vertX[0];
        this.lines[i].y2 = this.vertY[0];
        this.lines[i].h2 = this.vertH[0];
      } else {
        this.lines[i].x2 = this.vertX[i + 1];
        this.lines[i].y2 = this.vertY[i + 1];
        this.lines[i].h2 = this.vertH[i+1];
      }
    }
    for (let i = 0; i < this.vertNumber; i++) {
      //give the lines the color of the shape
      //shade the lines according to their slope so that lines with large slopes appear to have more light.
      //making it look like their are two light sources in the scene
      let l = this.lines[i];
      let slope = abs((l.y2-l.y1)/(l.x2-l.x1));
      let shade = map(slope,0,10,.65,1.1);
      shade = constrain(shade,.65,1.1);
      this.lines[i].r = this.r * shade;
      this.lines[i].g = this.g * shade;
      this.lines[i].b = this.b * shade;
      this.lines[i].alpha = this.alpha;
      for (let j = 0; j < this.stripeH.length; j ++){
        this.lines[i].stripeH[j] = this.stripeH[j];
        this.lines[i].stripeW[j] = this.stripeW[j];
        // console.log(this.lines[i].stripeW[i]);
      }
    }
  }

  display() { //tells line's to draw themselves
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i].display();
    }
  }

  displayVerts() { //draws circle at vertex
    for (let i = 0; i < this.vertNumber; i++) {
      noFill();
      stroke(255);
      ellipse(this.vertX[i], this.vertY[i], 3);
    }
  }
}
