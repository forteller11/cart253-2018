class Shape {
  constructor(x, y, vertexNumber) {
    this.x = x;
    this.y = y;
    this.vertNumber = vertexNumber;
    this.vertXOff = [];
    this.vertYOff = [];
    this.vertX = [];
    this.vertY = [];
    this.lines = []; //line obj
    //create vertexes
    for (let i = 0; i < this.vertNumber; i++) {
      this.vertXOff[i] = 0;
      this.vertYOff[i] = 0;
    }
    this.updateVert();
    //create Lines
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i] = new Line();
    }
  }

  update() {
    this.x = mouseX;
    this.y = mouseY;

    this.updateVert();
    this.updateLines();
  }

  updateVert() { //updates pos of verts based on pos of shape
    for (let i = 0; i < this.vertNumber; i++) {
      this.vertX[i] = this.vertXOff[i] + this.x;
      this.vertY[i] = this.vertYOff[i] + this.y;
    }
  }

  updateLines() {
    //recalc x1 and y1 of shape based on position of shape and vertexes.
    this.lines[i].x1 = this.vertX[i];
    this.lines[i].y1 = this.vertY[i];
    if (i + 1 >= vertNumber) {
      this.lines[i].x2 = this.vertX[0];
      this.lines[i].y2 = this.vertY[0];
    } else {
      this.lines[i].x2 = this.vertX[i + 1];
      this.lines[i].y2 = this.vertY[i + 1];
    }
  }
}
