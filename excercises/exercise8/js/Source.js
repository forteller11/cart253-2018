class Source {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.maxGain = .05;
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
    this.audioPlayer.connect(this.gainNode); //make the audioPlayer player output through a personal gain
    this.gainNode.connect(masterGain); //make the personal gain controlled by a master gain (which connects to system sound in the main script)
    this.gainNode.gain.value = .3;
    this.audioPlayer.start(0); //start at element one in the array buffer

  }
  update() {
    this.changeGain();
    this.changeData();
    // if (this.gain > 0) {
    //   //play
    // }
  }
  changeGain() {
    let distToPlayer = sqrt(sq(this.x-player.x)+(this.y-player.y));
  
    let gain = map(distToPlayer,0,height,this.maxGain,0);
    gain = constrain(gain,0,this.maxGain);
    print(gain);
    let gainSafe = parseFloat(gain);
    this.gainNode.gain.value = gain;

    //gain depends on distTOPlayer, don't
  }
  changeData() {
    const sampleNumber = sampleRate / this.frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      this.bufferData[i] = random(1);
    }
  }


}
