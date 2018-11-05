// let ray = [];
//
// let smallestValue = Infinity;
// let smallestValueIndex;
// let sum = 0;
//
// function setup() {
//   createCanvas(100, 100);
//   for (let i = 0; i < width; i++) {
//     ray[i] = random(height);
//   }
// 
// }
//
// function draw() {
//   background(0);
//
//   //selection sort algoritihim
//   for (let i = 0; i < ray.length; i++) {
//     smallestValue = Infinity;
//     for (let j = i; j < ray.length; j++) {
//       //cycle through array, find smallest value
//       if (ray[j] < smallestValue) {
//         smallestValueIndex = j;
//         smallestValue = ray[j];
//       }
//       //once at end of the array, swap ray index i with smallest ray...
//       if (j === ray.length - 1) {
//         rayStore = ray[i];
//         ray[i] = smallestValue;
//         ray[smallestValueIndex] = rayStore;
//       }
//       //then increment i and repeat until array is sorted...
//     }
//   }
//
//
//
//
//   for (let i = 0; i < width; i++) {
//     stroke(200);
//     line(i, height, i, height - ray[i]);
//   }
//
//
//   sum = 0;
//   for (let i = 0; i < ray.length; i++) {
//     sum += ray[i];
//   }
//   print("sum:" + sum);
// }
