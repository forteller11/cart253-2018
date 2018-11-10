let arr = [];

function setup() {
  createCanvas(200, 200);
  for (let i = 0; i < 20; i++) {
    arr[i] = random(height);
  }

  // for (let i = 1; i < arr.length; i ++){
  //   let j = i-1;
  //   print(j);
  //   while ((arr[i] < arr[j]) && (j > 0)) {
  //     print("j--");
  //     j--;
  //   }
  //   arr.splice(j, 0, arr[i]); //insert in front of j
  //   arr.splice(i + 1, 1); //delete arr[i] which is now i+1 cause insertion
  // }
}

function draw() {
  background(51);
  console.time();
  //move key up array, checking to see where key should be inserted in the sorted array behind it
  for (let i = 1; i < arr.length; i++) {
    //itterate down the array starting at key(i) until the key's value is larger than an element
    let j = i - 1;
    while ((arr[i] < arr[j]) && (j >= 0)) {
      // print("j--");
      j--;
    }
    //once an element has been found that is smaller than the key, insert the key
    //in front of that element
    arr.splice(j + 1, 0, arr[i]);
    arr.splice(i + 1, 1); //also remove the previous position of the key
  }
  console.timeEnd();


  //draw key, draw comparison, draw last swapped
  stroke(200);
  for (let i = 0; i < arr.length; i++) {
    line(i, height, i, height - arr[i]);
  }

}
