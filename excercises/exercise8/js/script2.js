let t = 0;
const frequency = 440;
const angularFrequency = frequency * 2 * Math.PI;
const sampleRate = 44100;
const sampleNumber = sampleRate * 2;
let audioContext = new AudioContext();
let myBuffer = audioContext.createBuffer(1, sampleNumber, sampleRate);
let myArray = myBuffer.getChannelData(0);
for (let i = 0 ; i < sampleNumber ; i++) {
  myArray[i] = generateSample(i);
}

function generateSample(i) {
  t+= 0.0001;
  let sampleTime = i / sampleRate;
  let sampleAngle = sampleTime * angularFrequency;
  return Math.sin(sampleAngle)*Math.tan(i/10000);
}

let src = audioContext.createBufferSource();
src.buffer = myBuffer;
src.connect(audioContext.destination);
src.start();

let iIndex = 0;
let iInc = 20;
function setup(){
  createCanvas(1000,1000);
  background(0);

}

function draw(){
  background(0);
  stroke(255);

  for (let i = iIndex ; i*iInc < sampleNumber ; i++) {

    let yy1 = generateSample(i*iInc)*height/4 + height/2;
    let yy2 = generateSample(i*iInc+iInc)*height/4 + height/2;
    line(i-iIndex,yy1,i+1-iIndex,yy2);

    // point(i-iIndex,(yy*height/2)+(height/2));
  }
iIndex += 10;
}
