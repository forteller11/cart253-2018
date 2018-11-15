class Source {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.t = random(1000);
    this.avgAmplitudeStore = 0; //stores avg amplitude of all samples every frame
    this.maxGain = .1;
    this.functions = [];
    // this.bufferData = [];
    this.frameRate = 60;
    this.gainNode = audioCtx.createGain();
    this.buffer = audioCtx.createBuffer(1, sampleRate / this.frameRate, sampleRate);

    //make buffer data the array containing raw audio data of the first (and only) channel of buffer
    this.bufferData = this.buffer.getChannelData(0);

    this.audioPlayer = audioCtx.createBufferSource();
    this.audioPlayer.buffer = this.buffer; //make the audioPlayer use the data from the buffer to play
    this.audioPlayer.loop = true;
    this.panner = audioCtx.createPanner();
    this.panner.panningModel = "HRTF";
    this.panner.distanceModel = "linear";
    this.panner.maxDistance = fadeHeightDist+(fadeHeightDist/3);

    this.updatePanner();
    this.audioPlayer.connect(this.panner); //make the audioPlayer player output through a personal gain
    this.panner.connect(this.gainNode);
    this.gainNode.connect(masterGain); //make the personal gain controlled by a master gain (which connects to system sound in the main script)



    this.gainNode.gain.value = this.maxGain;
    this.audioPlayer.start(0); //start at element one in the array buffer

  }
  update() {
    // this.updatePanner();
    // this.changeGain();
    this.changeData();
    // if (this.gain > 0) {
    //   //play
    // }
  }
  updatePanner(){
    this.panner.setPosition(this.x,this.y,zPlane);
    // this.panner.positionX.value = this.x;
    // this.panner.positionZ.value = this.y;
    // this.panner.positionY.value = zPlane;
    // this.panner.upX.value = this.angle;
    // this.listener.upY.value = 1;
    // this.listener.upZ.value = 0;
  }
  changeGain() {
    let distToPlayer = sqrt(sq(this.x-player.x)+sq(this.y-player.y));
    let gain = map(distToPlayer,0,height,this.maxGain,0);
    gain = constrain(gain,0,this.maxGain);
    this.gainNode.gain.value = gain;

  }
  changeData() {
this.avgAmplitudeStore = 0;
let netAmplitude = 0;
    const sampleNumber = sampleRate / this.frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      // p = i/30;
      this.t += .3/sampleRate;
      const t = this.t;
      let t3 = Math.sin(t/3)*Math.PI*2;
      let t4 = Math.cos(t/1)*Math.PI*2;
      let sampleTime = i / sampleRate;
      let sampleAngle = sampleTime * 2*Math.PI;
      // print(sampleAngle);
      let f0 = Math.sin(sampleAngle * 20);
      let f1 = Math.sin(sampleAngle *7);
      let f2 = Math.cos(Math.pow(sampleAngle*.8,f1));
      let f3 = Math.sin(f0*10);
      // f3 = constrain(f3,0,1);
      let f4 = Math.cos(f1*30);
      let f5a = (f3+(f4*t4)+f2)/4;


      // return (f3+f4)*.5;
      let f2c = Math.sin(4*t*Math.pow(Math.PI,4));
      let f3c = f2c * Math.pow(t3,2);
      let f4c = 1*Math.cos(f3c);
      this.bufferData[i] = (f5a+f4c);
      netAmplitude+= this.bufferData[i];
    }
    let newAvgAmp = netAmplitude/sampleNumber;
    let avgAmpDiff = newAvgAmp - this.avgAmplitudeStore;
    this.avgAmplitudeStore += avgAmpDiff*.5;
    // print(this.avgAmplitudeStore);
  }


}
