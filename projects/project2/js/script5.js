let parentRay = [];

function setup() {
  createCanvas(200, 200);
  for (let i = 0; i < 20; i++) {
    parentRay[i] = new Ray(1,2,false);
    parentRay[i].angle = random(height);
  }

  // for (let i = 1; i < parentRay.length; i ++){
  //   let j = i-1;
  //   print(j);
  //   while ((parentRay[i] < parentRay[j]) && (j > 0)) {
  //     print("j--");
  //     j--;
  //   }
  //   parentRay.splice(j, 0, parentRay[i]); //insert in front of j
  //   parentRay.splice(i + 1, 1); //delete parentRay[i] which is now i+1 cause insertion
  // }
}

function draw() {
  background(51);
  console.time();
  //move key up parentRayay, checking to see where key should be inserted in the sorted parentRayay behind it
  for (let i = 1; i < parentRay.length; i++) {
    //itterate down the parentRayay starting at key(i) until the key's value is larger than an element
    let j = i - 1;
    while ((parentRay[i].angle < parentRay[j].angle) && (j >= 0)) {
      // print("j--");
      j--;
    }
    //once an element has been found that is smaller than the key, insert the key
    //in front of that element
    parentRay.splice(j + 1, 0, parentRay[i].angle);
    parentRay.splice(i + 1, 1); //also remove the previous position of the key
  }
  console.timeEnd();


  //draw key, draw comparison, draw last swapped
  stroke(200);
  for (let i = 0; i < parentRay.length; i++) {
    line(i, height, i, height - parentRay[i].angle );
  }

}
