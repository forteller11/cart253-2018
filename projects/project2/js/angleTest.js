// let lineX1 = [];
// let lineY1 = [];
// let lineX2 = [];
// let lineY2 = [];
//
// function setup() {
//   createCanvas(1000,1000);
//   for (let i = 0; i < 20; i++) {
//     lineX1[i] = width / 2;
//     lineY1[i] = height / 2;
//     lineX2[i] = random(width);
//     lineY2[i] = random(height);
//   }
// }
//
// function draw() {
//
//   fill(255);
//   background(51);
//   for (let i = 0; i < lineX1.length; i++) {
//     let radius = sqrt(sq(lineX2[i]-lineX1[i]) + sq(lineY2[i]-lineY1[i]) );
//     let yVec = lineY2[i] - lineY1[i];
//     let xVec = lineX2[i]-lineX1[i];
//     let newAngle = atan2(yVec, xVec);
//     noStroke();
//     text(newAngle,lineX2[i],lineY2[i]);
//     stroke(255);
//     line(lineX1[i], lineY1[i], lineX2[i], lineY2[i]);
//   }
// }
