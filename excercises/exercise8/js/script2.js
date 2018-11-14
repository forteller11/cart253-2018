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
  let t3 = Math.sin(t/3)*Math.PI*2;
  let t4 = Math.cos(t/1)*Math.PI*2;
  t2 *= .999995;
  let sampleTime = i / sampleRate;
  let sampleAngle = sampleTime * angularFrequency;
  // print(sampleAngle);
  let f0 = Math.sin(sampleAngle * 20);
  let f1 = Math.sin(sampleAngle *7);
  let f2 = Math.cos(Math.pow(sampleAngle*.8,f1));
  let f3 = Math.sin(f0*10);
  // f3 = constrain(f3,0,1);
  let f4 = Math.cos(f1*30);
  let f5a = (f3+(f4*t4)+f2)/3;



  // let f0 = Math.sin(sampleAngle*.01*t2);
  // let f1 = Math.sin(sampleAngle*20);
  // let f2 = Math.cos(f1*t);
  // let f3 = Math.cos(f2);
  // let f4 = Math.sin(sampleAngle*100);

  // return (f3+f4)*.5;
  let f2c = Math.sin(10*t*Math.pow(Math.PI,4));
  let f3c = f2c * Math.pow(t3,2);
  let f4c = 1*Math.cos(f3c);
return f5a+f4c;
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
// print(yy1);
    // point(i-iIndex,(yy*height/2)+(height/2));
  }
  // print(iInc/sampleNumber)
iIndex += (iInc);
}
