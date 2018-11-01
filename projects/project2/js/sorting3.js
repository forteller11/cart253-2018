let test = [];

let smallestValue = Infinity;
let smallestValueIndex;
let sum = 0;

function setup() {
  createCanvas(100, 100);
  for (let i = 0; i < width; i++) {
    test[i] = new Test(random(PI*2));
  }

  // for (let i = 0; i < test.length; i++) {
  //   print(test[i].angle);
  // }
}

function draw() {
  background(0);

  //selection sort algoritihim
  for (let i = 0; i < test.length; i++) {
    smallestValue = Infinity;
    for (let j = i; j < test.length; j++) {
      //cycle through artest, find smallest value
      if (test[j].angle < smallestValue) {
        smallestValueIndex = j;
        smallestValue = test[j].angle;
      }
      //once at end of the artest, swap test index i with smallest test...
      if (j === test.length - 1) {
        testStore = test[i];
        test[i] = smallestValue;
        test[smallestValueIndex] = testStore;
      }
      //then increment i and repeat until artest is sorted...
    }
  }




  for (let i = 0; i < test.length; i++) {
    stroke(200);
    let testHMap = map(test[i].angle,0,PI*2,0,height);
    line(i, height, i, testHMap);
  }


  sum = 0;
  for (let i = 0; i < test.length; i++) {
    sum+= test[i].angle;
  }
  // print("sum:" + sum);
}
