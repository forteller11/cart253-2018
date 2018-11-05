class Light {
  constructor(){
    this.x = mouseX;
    this.y = mouseY;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.alpha = 30;

    this.parentRay = [];
    //create one parentRay for every vertex in the scene
    let k = 0;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].vertNumber; j++) {
        parentRay[k] = new Ray(shape[i].vertX[j], shape[i].vertY[j],true);
        k++;
      }
    }
  }
}
