let arr = [];
let i = 1;
let j = i-1;

function setup() {
  createCanvas(200, 200);
  for (let i = 0; i < width; i++) {
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


  if (i < arr.length) { //increment i
    //if key is bigger then index, insert array infront
    //itterate down the array starting at key(i) until the key's value is larger than an element
    while ((arr[i] < arr[j]) && (j >= 0)) {
        print("j--");
        j--;
      }
      //once an element has been found that is smaller than the key, insert the key
      //in front of that element
      arr.splice(j+1, 0, arr[i]); 
      arr.splice(i + 1, 1); //also remove the previous position of the key
      i++;
      j = i-1;
    //
    // if ((arr[i] > arr[j])) {
    //
    //   arr.splice(j + 1, 0, arr[i]); //insert in front of j
    //   arr.splice(i + 1, 1); //delete arr[i] which is now i+1 cause insertion
    //   i++;
    //   j = i;
    // } else if (j === 0) {
    //   arr.splice(j, 0, arr[i]); //insert in front of j
    //   arr.splice(i + 1, 1); //delete arr[i] which is now i+1 cause insertion
    //   i++;
    //   j = i;
    // } else {
    //   j--;
    // }
  }


  //draw key, draw comparison, draw last swapped
  stroke(200);
  for (let i = 0; i < width; i++) {
    line(i, height, i, height - arr[i]);
  }
  stroke(0,255,0);
  line(i,height,i,height-arr[i]);
  stroke(200,130,0);
  line(j,height,j,height-arr[i]);
}
