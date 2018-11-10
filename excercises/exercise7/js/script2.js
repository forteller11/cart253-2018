let arr = [];
let i = 1;
let j = i;

function setup() {
  createCanvas(200, 200);
  for (let i = 0; i < width; i++) {
    arr[i] = random(height);
  }


  for (let i = 1; i < arr.length; i++) {
    let key = i;
    let j = i;
    let currentValue = arr[j];
    while ((j > 1) && (arr[j] > arr[key])) { //
      j--;
    }
    currentValue = arr[j];
    arr.splice(i, 1); //delete
    arr.splice(j, 0, currentValue); //isnert

  }
  background(51);
  stroke(255);
  for (let i = 0; i < width; i++) {
    line(i, height, i, height - arr[i]);
  }
}

function draw() {
  background(51);

  print(i);


  if (i < arr.length) { //increment i
    //if key is bigger then index, insert array infront
    print(round(arr[i])+"vs"+round(arr[j]));
    if ((arr[i] > arr[j])) {

      arr.splice(j + 1, 0, arr[i]); //insert in front of j
      arr.splice(i + 1, 1); //delete arr[i] which is now i+1 cause insertion
      i++;
      j = i;
    } else if (j === 0) {
      arr.splice(j, 0, arr[i]); //insert in front of j
      arr.splice(i + 1, 1); //delete arr[i] which is now i+1 cause insertion
      i++;
      j = i;
    } else {
      j--;
    }
  }
  else {
    i = 1;
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
