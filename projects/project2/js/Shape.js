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
    this.vertX = [];
    this.vertY = [];
    this.lines = []; //array which stores lines

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
      this.vertX[i] = (cos(this.vertAOff[i]+this.angle) * this.vertR[i]) + this.x;
      this.vertY[i] = (sin(this.vertAOff[i]+this.angle) * this.vertR[i]) + this.y;
    }
  }

  updateLines() {
    //recalc x1 and y1 of shape based on position of shape and vertexes.
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i].x1 = this.vertX[i];
      this.lines[i].y1 = this.vertY[i];
      if (i + 1 >= this.vertNumber) {
        this.lines[i].x2 = this.vertX[0];
        this.lines[i].y2 = this.vertY[0];
      } else {
        this.lines[i].x2 = this.vertX[i + 1];
        this.lines[i].y2 = this.vertY[i + 1];
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
