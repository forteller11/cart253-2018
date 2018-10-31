class Shape {
  constructor(x, y, angle, vertNumber) {
    this.x = x;
    this.y = y;
    this.a = angle;
    this.vertNumber = vertNumber;
    this.vertAOff = []; //angle offset
    this.vertR = []; //radius
    this.vertX = [];
    this.vertY = [];
    this.lines = []; //line obj
    // //create vertexes
    // for (let i = 0; i < this.vertNumber; i++) {
    //   this.vertXOff[i] = 0;
    //   this.vertYOff[i] = 0;
    // }
    // this.updateVert();
    //create Lines
    for (let i = 0; i < this.vertNumber; i++) {
      this.lines[i] = new Line();
    }
  }

  update() {

    this.updateVertCartesian();
    this.updateLines();
  }

  updateVertCartesian() { //updates x,y of verts based on angle and r offsets
    for (let i = 0; i < this.vertNumber; i++) {
      this.vertX[i] = (cos(this.vertAOff[i]) * this.vertR[i]) + this.x;
      // print(this.vertAOff[i]);
      // print(this.vertAOff);
      this.vertY[i] = (sin(this.vertAOff[i]) * this.vertR[i]) + this.y;
    }
  }

  updateLines() {
    //recalc x1 and y1 of shape based on position of shape and vertexes.
    for (let i = 0; i < this.vertNumber; i ++) {
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

  display(){
    this.displayVerts();
    for (let i = 0; i < this.vertNumber; i ++){
      this.lines[i].display();
    }
  }

  displayVerts(){
    for (let i = 0; i < this.vertNumber; i ++){
      noFill();
      stroke(255);
      ellipse(this.vertX[i],this.vertY[i],3);
    }
  }
}
