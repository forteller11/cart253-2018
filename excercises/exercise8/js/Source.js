class Source {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.t1 = random(100000);
    this.t2 = random(100000);
    this.t1MinIncrement = random(175,500)/sampleRate;
    this.t1MaxIncrement = random(this.t1MinIncrement,this.t1MinIncrement+2000)/sampleRate;
    this.t1NoiseIncrement = random(1.5)/sampleRate;
    this.t1NoiseIndex = random(100000);
    this.t1IncStore = 0;
//0.000000001//
    this.t2Increment = random(1)/sampleRate;
    this.soundType = round(random(5)); //what type of function i used
    this.fadeType = round(random(4)); //what type of function i used
    noiseDetail(16, 0.65);

    this.avgAmplitudeStore = 0; //stores avg amplitude of all samples every frame
    this.maxGain = random(.1);
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
    this.panner.maxDistance = fadeHeightDist-(fadeHeightDist/6);

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
    const sampleNumber = sampleRate / frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      this.t1NoiseIndex += this.t1NoiseIncrement;
      const lerpAmount = noise(this.t1NoiseIndex);
      noiseDetail(6, 0.75);
      const t1Inc = lerp(this.t1MinIncrement,this.t1MaxIncrement,lerpAmount);

      this.t1 += t1Inc;
      this.t2 += this.t2Increment;
      // this.soundType = 1;
      let waveValue;
      let fadeValue;
      // this.soundType = 4;
      if (this.soundType === 0){ //static
        waveValue = random(-1,1);
      }
      if (this.soundType === 1){ //sinwave
        waveValue = sin(this.t1*.5);
      }
      if (this.soundType === 2){ //triangle
        const period = 2.5;
        const hOffset = period/2;
        waveValue = ((abs(this.t1%period)/period)-.5);
      }
      if (this.soundType === 3){
        waveValue = sin(tan(this.t1));
      }
      if (this.soundType === 4){ //change t
      const f2c = Math.pow(sin(this.t1/1.5),5);
      waveValue =f2c;
      }
      if(this.soundType === 5){ //a function by Darren Turcotte
        // waveValue=
        waveValue =log(Math.pow(this.t1,-1))/sin(2*3.14159*this.t1);
        waveValue = constrain(waveValue,-1,1);
        // console.log(waveValue);
      }

      // this.fadeType = 3;
      if (this.fadeType === 0){ //static
        noiseDetail(8, 0.65);
        fadeValue = noise(this.t2)*waveValue;
      }
      if (this.fadeType === 1){ //sinwave
        noiseDetail(6, 0.35);
        fadeValue = noise(this.t2*10)*waveValue;
      }
      if (this.fadeType === 2){ //sinwave
        fadeValue = map(sin(this.t2*6),-1,1,0,1)*noise(this.t2)*waveValue;
      }
      if (this.fadeType === 3){ //sinwave
        fadeValue = map(sin(this.t2*6),-1,1,0,1)*map(sin(this.t2*1.33),-1,1,0,1)*waveValue;
      }
      if (this.fadeType === 4){ //sinwave
        fadeValue = waveValue;
      }

      // if (this.soundType === 3){ //triangle
      //   const period = 2.5;
      //   const hOffset = period/2;
      //   fadeValue = ((abs(this.t2%period)/period)-.5);
      // }

      this.bufferData[i] = fadeValue;

          //one this.bufferData gives sense of amplitude, t1IncStore gives sense of frequency changes
      netAmplitude+= abs(this.bufferData[i])+(abs(t1Inc-this.t1IncStore)*10000);
      this.t1IncStore = t1Inc;
    }
    let newAvgAmp = netAmplitude/sampleNumber;
    let avgAmpDiff = newAvgAmp - this.avgAmplitudeStore;
    // print(newAvgAmp);
    this.avgAmplitudeStore += avgAmpDiff*1;
    // print(this.avgAmplitudeStore);
  }


}
