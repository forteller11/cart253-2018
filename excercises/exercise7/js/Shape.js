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

    //create one line for every vertex
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i] = new Line();
    }
  }

  update() {
    //based on angleOffset+radius of vertex determine is cartesian coords
    this.updateVertCartesian();
    this.updateLines(); //update the end/start points of each line
  }

  updateVertCartesian() { //updates x,y of verts based on angleOffset, shape's angle, and verts' radius
    for (let i = 0; i < this.vertNumber; i++) {
      this.vertX[i] = (cos(this.vertAOff[i] + this.angle) * this.vertR[i]) + this.x;
      this.vertY[i] = (sin(this.vertAOff[i] + this.angle) * this.vertR[i]) + this.y;
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
      //shades the lines lighter with their slope
      //making it look like their are two light sources in the scene
      let l = this.lines[i];
      let slope = abs((l.y2-l.y1)/(l.x2-l.x1));
      let shade = map(slope,0,10,.75,1.25);
      shade = constrain(shade,.75,1.25);
      this.lines[i].r = this.r * shade;
      this.lines[i].g = this.g * shade;
      this.lines[i].b = this.b * shade;
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
