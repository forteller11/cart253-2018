
let context = new window.AudioContext();
let sampleRate = 4096;
let sampleNumber = sampleRate/58;
let node = context.createBufferSource();

buffer = context.createBuffer(1,sampleNumber,sampleRate);
data = buffer.getChannelData(0);



node.buffer = buffer;
node.loop = true;
node.connect(context.destination);
node.start(0);

let t = 0;
let t2 = 0;
function setup(){
  createCanvas(50,50);
}

function draw(){
  background(51);
  for (let i = 0; i < sampleNumber; i++){
    t+= .3/sampleRate;
    let t3 = Math.sin(t/3)*Math.PI*2;
    let t4 = Math.cos(t/1)*Math.PI*2;
    t2 *= .999995;
    let sampleTime = i / sampleRate;
    let sampleAngle = sampleTime * 2*Math.PI;
    // print(sampleAngle);
    let f0 = Math.sin(sampleAngle * 20);
    let f1 = Math.sin(sampleAngle *7);
    let f2 = Math.cos(Math.pow(sampleAngle*.8,f1));
    let f3 = Math.sin(f0*10);
    // f3 = constrain(f3,0,1);
    let f4 = Math.cos(f1*30);
    let f5a = (f3+(f4*t4)+f2)/3;


    // return (f3+f4)*.5;
    let f2c = Math.sin(10*t*Math.pow(Math.PI,4));
    let f3c = f2c * Math.pow(t3,2);
    let f4c = 1*Math.cos(f3c);
    data[i] = f5a+f4c;
  }
}
