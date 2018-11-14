class Speaker {
  constructor() {
    this.gain = 1;
    this.functions = [];
    // this.bufferData = [];
    this.frameRate = 60;
    this.buffer = audioCtx.createBuffer(1, sampleRate / this.frameRate, sampleRate);

    //make buffer data the array containing raw audio data of the first (and only) channel of buffer
    this.bufferData = this.buffer.getChannelData(0);

    this.audioPlayer = audioCtx.createBufferSource();
    this.audioPlayer.buffer = this.buffer; //make the audioPlayer use the data from the buffer to play
    this.audioPlayer.loop = true;
    this.audioPlayer.connect(audioCtx.destination); //make the audioPlayer play through the system's sound-->speakers
    this.audioPlayer.start(0); //start at element one in the array buffer
  }
  update() {
    // this.changeGain();
    this.changeData();
    // if (this.gain > 0) {
    //   //play
    // }
  }
  changeGain() {
    //gain depends on distTOPlayer, don't
  }
  changeData() {
    const sampleNumber = sampleRate / this.frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      this.bufferData[i] = random(1);
    }
  }


}
