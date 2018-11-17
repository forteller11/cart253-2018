let t = 0;

const frequency = 440;
const angularFrequency = 2 * Math.PI;
const sampleRate = 44100;
const sampleNumber = sampleRate * 30;
let t2 = sampleNumber;
let audioContext = new AudioContext();
let myBuffer = audioContext.createBuffer(1, sampleNumber, sampleRate);
let myArray = myBuffer.getChannelData(0);
for (let i = 0 ; i < sampleNumber ; i++) {
  myArray[i] = generateSample(i);
}

function generateSample(i) {
  t+= .3/sampleRate;
  const period = .009;
  const hOffset = period/2;
  const data = ((Math.abs(t%period))/period)-1;
    // console.log(data);
  return data;
  // return (f4c + f4a)/2;
}


let src = audioContext.createBufferSource();
src.buffer = myBuffer;
src.connect(audioContext.destination);
src.start();

let iIndex = 0;
let iInc = (1.2*sampleNumber)/(sampleRate);
function setup(){
  createCanvas(1000,1000);
  background(0);

}

function draw(){
  background(0);
  stroke(255);

  for (let i = iIndex ; i*iInc < sampleNumber ; i++) {

    let yy1 = generateSample(i*iInc)*height/3 + height/2;
    let yy2 = generateSample(i*iInc+iInc)*height/3 + height/2;
    line(i-iIndex,yy1,i+1-iIndex,yy2);
// console.log((yy1-height*2)/height*3);
    // point(i-iIndex,(yy*height/2)+(height/2));
  }
  // print(iInc/sampleNumber)
iIndex += (iInc);
}
