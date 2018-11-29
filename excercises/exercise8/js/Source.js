class Source {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.t1 = random(100000);
    this.t2 = random(100000);
    this.t1MinIncrement = random(175,400)/sampleRate;
    this.t1MaxIncrement = random(this.t1MinIncrement,this.t1MinIncrement+1000)/sampleRate;
    this.t1NoiseIncrement = random(1)/sampleRate;
    this.t1NoiseIndex = random(100000);
    this.t2Increment = random(1)/sampleRate;
    this.soundType = round(random(5.49)); //what type of function i used
    this.fadeType = round(random(4.49)); //what type of function i used
    noiseDetail(16, 0.65);

    this.avgAmplitudeStore = 0; //stores avg amplitude of all samples every frame
    this.functions = [];

    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = random(.05,.1); //sets random gain for source between 0.5-.1
    //create audio buffer (giant array) with one output (mono) and sampleRate/frameRate
    //amount of array _element, with playback rate of samplerate per second
    this.buffer = audioCtx.createBuffer(1, round(sampleRate / frameRate), sampleRate);
    //make bufferData the array containing raw audio data of the first (and only) channel of buffer
    this.bufferData = this.buffer.getChannelData(0);

    //create audio source through which one can play audio from buffer, and spatialize it with panner node
    this.audioPlayer = audioCtx.createBufferSource();
    this.audioPlayer.buffer = this.buffer; //make the audioPlayer use the data from the buffer to play
    this.audioPlayer.loop = true;
    //create panner (used for audio spatialization)
    this.panner = audioCtx.createPanner();
    this.panner.panningModel = "HRTF"; //set it to sound like if you were a person lsitening to the audio
    this.panner.distanceModel = "linear"; //linearly fades volume
    this.panner.maxDistance = fadeHeightDist; //volume is 0 once panner's are more than fadeHeightDistance away (once they're sillouhettes)

    this.updatePanner(); //set panner x,y
    this.audioPlayer.connect(this.panner); //make the audioPlayer player route through panner node to spatialize its audio
    this.panner.connect(this.gainNode); //route panner through gain node to randomize its volume
    this.gainNode.connect(masterGain); //route the personal gain through a master gain (which connects to system sound in the main script)
    this.audioPlayer.start(0); //start playing at element one in the array buffer

  }
  update() {
    // this.updatePanner();
    // this.changeGain();
    this.changeData();
  }
  updatePanner(){
    this.panner.setPosition(this.x,this.y,zPlane);
  }
  changeGain() {
    let distToPlayer = sqrt(sq(this.x-player.x)+sq(this.y-player.y));
    let gain = map(distToPlayer,0,height,this.maxGain,0);
    gain = constrain(gain,0,this.maxGain);
    this.gainNode.gain.value = gain;

  }
  /*
  this is the method which actually creates the sound for the source to be played and associated visually
  with the shape. It does this by randomly selecting from a number of osscillating functions,
  the xincrement is (f(x) paradigm) is determined by a randomly determined min-max range
  which is lerped inbetween through perlin noise. Then this "waveValue" is multiplied
  by a fade value which is selected from a bunch of random wave function osscillating
  much slower not multiply times per second.
  */
  changeData() {
    this.avgAmplitudeStore = 0;
    let netAmplitude = 0;
    const sampleNumber = sampleRate / frameRate;
    for (let i = 0; i < sampleNumber; i++) {
      //first value is detail of noise (how many layers of random numbers to interpolate between)
      // second value determines how equally the layers of random value effects the noise final value (1 being totally equally)
      noiseDetail(6, 0.45);
      this.t1NoiseIndex += this.t1NoiseIncrement;
      const lerpAmount = noise(this.t1NoiseIndex);
      //set increment of t1 to be between its min and max values, lerped accoridng to perlin noise
      const t1Inc = lerp(this.t1MinIncrement,this.t1MaxIncrement,lerpAmount);
      this.t1 += t1Inc;
      this.t2 += this.t2Increment;

      let waveValue; //y value of wavefunction (high frequency)
      let fadeValue; //y value of fadefunction to multiply the wavefunction by (low frequency)

      if (this.soundType === 0){ //static
        waveValue = random(-1,1);
      }
      if (this.soundType === 1){ //sinwave
        waveValue = sin(this.t1*.5);
      }
      if (this.soundType === 2){ //triangle wave (https://stackoverflow.com/questions/1073606/is-there-a-one-line-function-that-generates-a-triangle-wave)
        const period = 2.5;
        const hOffset = period/2;
        waveValue = ((abs(this.t1%period)/period)-.5);
      }
      if (this.soundType === 3){ //tan in sin wave (slow ossilations --> infinite ossilations --> slow....)
        waveValue = sin(tan(this.t1/4));
      }
      if (this.soundType === 4){ //(sinx)^5, soft curves like sinwave but slightly less regular
      waveValue = Math.pow(sin(this.t1*1.5),5);
      }
      if(this.soundType === 5){ //perlin noise wave
          noiseDetail(6, 0.45);
        waveValue = noise(this.t1/1.6);
      }

      // this.fadeType = 1;
      if (this.fadeType === 0){ //fade according to perlin noise
        noiseDetail(8, 0.65);
        fadeValue = noise(this.t2);
      }
      if (this.fadeType === 1){ //fade according to perlin noise
        noiseDetail(6, 0.35);
        fadeValue = noise(this.t2*10);
      }
      if (this.fadeType === 2){ //sin/cos fade
        fadeValue = map(sin(this.t2*3),-1,1,0,1)*noise(this.t2/5);
      }
      if (this.fadeType === 3){ //sin/cos fade
        fadeValue = map(sin(this.t2*3),-1,1,0,1)*map(sin(this.t2*.33),-1,1,0,1);
      }
      if (this.fadeType === 4){ //no fade
        fadeValue = 1;
      }

      this.bufferData[i] = fadeValue*waveValue; //actually inserts to calcualted value into the audioBuffer
      netAmplitude+= this.bufferData[i]; //storing
    }
    let newAvgAmp = netAmplitude/(sampleNumber*2);
    let avgAmpDiff = newAvgAmp - this.avgAmplitudeStore;
    this.avgAmplitudeStore = avgAmpDiff; //avg amplitude change per frame of sound, used to control shapes' vertex height
  }


}
