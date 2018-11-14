class Source {
  constructor(x,y) {
    this.x = x;
    this.y = y;
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
    this.audioPlayer.connect(this.panner); //make the audioPlayer player output through a personal gain
    this.panner.connect(this.gainNode);
    this.gainNode.connect(masterGain); //make the personal gain controlled by a master gain (which connects to system sound in the main script)



    this.gainNode.gain.value = .1;
    this.audioPlayer.start(0); //start at element one in the array buffer

  }
  update() {
    this.updatePanner();
    this.changeGain();
    this.changeData();
    // if (this.gain > 0) {
    //   //play
    // }
  }
  updatePanner(){
    this.panner.positionX.value = this.x;
    this.panner.positionZ.value = this.y;
    this.panner.positionY.value = zPlane;
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
    const sampleNumber = sampleRate / this.frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      this.bufferData[i] = random(1);
    }
  }


}
