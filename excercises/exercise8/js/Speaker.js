class Speaker{
constructor(){
  this.gain = 1;
  this.functions = [];
  this.data = [];
}
update(){
  this.changeGain();
  this.changeData();
  if (this.gain > 0){
    //play
  }
}
this.changeGain(){
  //gain depends on distTOPlayer, don't
}
changeData(){
//perhaps use changeGain here, so that chnages aren't abrupt?
}


}
