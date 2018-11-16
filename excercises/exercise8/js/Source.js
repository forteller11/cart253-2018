class Source {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.t = random(100000);
    this.tIncrement = random(600,2700)/sampleRate;
    this.soundType = round(random(3)); //what type of function i used


    this.avgAmplitudeStore = 0; //stores avg amplitude of all samples every frame
    this.maxGain = random(.2);
    this.functions = [];
    // this.bufferData = [];
    this.gainNode = audioCtx.createGain();
    this.buffer = audioCtx.createBuffer(1, sampleRate / frameRate, sampleRate);

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
    this.changeGain();
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
    // this.soundType = 3;
this.avgAmplitudeStore = 0;
let netAmplitude = 0;
    const sampleNumber = sampleRate / frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      this.t += this.tIncrement;
      let type = this.soundType;
      let addValue;
      if (type === 0){
        type = random(-1,1);
      }
      if (type === 1){
        type = sin(this.t);
      }
      if (type === 2){
        type = sin(sin(this.t));
      }
      if (type === 3){
        type = sin(tan(this.t/20));
      }
      this.bufferData[i] = type;
      netAmplitude+= abs(this.bufferData[i]);
    }

    let newAvgAmp = netAmplitude/sampleNumber;
    let avgAmpDiff = newAvgAmp - this.avgAmplitudeStore;
    // print(newAvgAmp);
    this.avgAmplitudeStore += avgAmpDiff*1;
    // print(this.avgAmplitudeStore);
  }


}
