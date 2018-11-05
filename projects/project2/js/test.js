//
// let radialImg;
// function preload() {
//   radialImg = loadImage('images/radial.png');
// }
// function setup(){
//
//   createCanvas(1000,1000);
//
// }
// function draw(){
//   background(0);
//
//   let maskImg = createImage(300,300);
//   maskImg.loadPixels();
//   for (let i = 0; i < maskImg.width; i ++){
//     for (let j = 0; j < maskImg.height; j ++){
//       let index = ((4*i)+(4*maskImg.width*j));
//       maskImg.pixels[index+0] = 0;
//       maskImg.pixels[index+1] = 0;
//       maskImg.pixels[index+2] = 0;
//       maskImg.pixels[index+3] = i;
//     }
//   }
//   maskImg.updatePixels();
//   // image(maskImg,mouseX,mouseY);
//   radialImg.mask(maskImg);
//   image(radialImg,mouseX-radialImg.width/2,mouseY-radialImg.height/2);
// }
