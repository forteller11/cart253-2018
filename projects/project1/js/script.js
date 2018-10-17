/*
Charly Yan Miller
Project 1

Description:
  In which a macrophage must eat bacteria before they consume all the food,
  and must avoid poison (by morphing it's shape) to do so sucesfully.


Challenges Rationale --> A.K.A. Why Should Your Marking Be High?
  Challenge ONE: while I did not change prey's/bacteria's position using perlin noise I did add
  give it a acceleration, velocity, position based movement system and I made the bacteria
  look for nearest food (intentionally imperfectly) and the move towards that food
  within the constraints of having a max acceleration and velocity (using vectors etc.)
  Also I used perlin-noise to change the position of an object in exercise2 so I
  have shown I know how to use it already.

  Challenge Two: while the playey/macrophage cannot sprint, that mechanic makes no sense
  within the context of the game as the macrophage does not have hp (at least that isn't a boolean value)
  and therefore could not experience a concrete downside from an increase in speed. However, I showed via
  my implementation from scratch of a movement system (which consistently converts from polar
  to cartesian cordinates) and from my implementation from scratch of arrow key controls
  that I understand both how to increase a players speed (in my game it would be by
  increasing the rate of acceleration and perhaps constraints on velocity and acceleration)
  and that I also know how deal with inputs and resultant changes in gamestate (if statements).

  Challenge Three: I feel like all my changes can be applied to challenge three...
  The main mechanic I would like to highlight is a collision system which I created which
  works for any size or sided geometric, convex shape and allows the shape of the hitbox/macrophage
  to be changed dynamically in game.


  Challenge four: I tuned the variables of the movement system so the player would feel
  adequetly floaty so that they felt immersed in water (like a macrophage?); I also tuned
  the acceleration (and velocity, maxvelocity,maxacceleration...) of bacteria towards
  their food so that they look natural-ish but still were effecient in their task
  of eating.

  Challenge five:Immune system theme, being that the I wanted the player to be able to
  change thier avatars shape it made sense that the avatar become a macrophage because
  they have a famously malluable and flexible cell membrane, also because macrophages
  "chase" bacteria (/prey). I also added some very barebones ambient sound.

Credits:
  I found Daniel Shiffman's series of videos on his channel on evolutionary Steering
  behaviors very inspiring and helpful and they gave me the idea for the movement
  and behavior of the prey/bacteria, however I want to emphasize that no code was copied from his videos.
*/


let inc = 0;
let w = 60;
let boxNumber = 1;
let box = [];
let rotationInc = .3;
let acc = .02; //rate of acceleration
let pointDrag = -1; //is mouse draging points?
let bacteriaPopInitial;
let bacteriaPop = bacteriaPopInitial;
let bacteria = [];
let food = [];
let foodPopInitial;
let foodPop = foodPopInitial;
let poison = [];
let poisonPop;
let poisonInitialize = false; //has poison starting positions been intialized?
let winSnd; //the ambienttrack
let deathSnd;
let textOpacity = 255;
let textOpacity2 = 255;
let lost = 0; //have you lost, 0 or under means no
/*------------
Preload:
load audio files
-------------*/
function preload(){
  ambientSnd = new Audio("audio/ambient.wav");
  deathSnd = new Audio("audio/death.wav");
  winSnd = new Audio("audio/win.wav");
}

/*------------
Setup:
play audio file ambient, create create
create array of food, poison, bacteria and create a macrophage
and intialize all their variables (x,y,....)
-------------*/
function setup() {
  //play ambient sound on loop
  ambientSnd.loop = true;
  ambientSnd.play();

  createCanvas(windowWidth-50,windowHeight-50);
  background(51);

  //spawn bacteria,food and poison pop based on screen size (more if screen size is bigger)
  bacteriaPopInitial = 28*(width/1000);
  bacteriaPop = bacteriaPopInitial;
  foodPopInitial = 220*(width/1000);
  foodPop = foodPopInitial;
  poisonPop = 38*(width/1000);

  //spawn macrophage at center of canvas, w/5 points, spread out points equally with a radius of 64;
  for (i = 0; i < boxNumber; i ++){
      box[i] = new BoxCollider(width/2,height/2,5);
      box[i].equalSpread(64);
      //print(box[i].length)
  }

  //initialize bacteriphage pop (place and set size randomly)
  for (i = 0; i < bacteriaPop; i ++){
    let bacteriaSize = random(4,8);
    bacteria[i] = new Prey(random(width),random(height),bacteriaSize);
  }

  //initialize food (place randomly)
  for (i = 0; i < foodPop; i ++){
    food[i] = new Food(random(width),random(height),4,1);
    }

    //initialize poison (place randomly,
    //later in the script I deal with what happens if poison spawns ontop of the macrophage
    for (i = 0; i < poisonPop; i ++){
      poison[i] = new Poison(random(width),random(height),random(15,25));
    }


}
/*------------
Draw:
Display poison,food,macrophage bacteria
  - for macrophages create a shape between it's points, draw circles at its points, draw
  a circle(nucleas) at its anchor(x,y pos), draw a direction indicator, draw flagella at each points
  - for bacteria draw circle and Flagella
  - for poison and food draw an ellipse

if objects have physics systems call them
  - bacteria looks for and travels towards food
  - macrophage moves based on current velocity & angle and its acceleration is changed according to keyboard inputs

check for collisions between...
  - macrophage-bacteria (bacteria loses hp);
  - bacteria-food(food is deleted, bacteria grows)
  - poison-macrophage (gamestate = lost)

Display text on loss or win and play corresponding sounds

-------------*/
function draw() {
  background(51);
  stroke(255);

  //draw food
  for (i = 0; i < foodPop; i ++){
    food[i].display();
  }
  //draw poison
  for (i = 0; i < poisonPop; i ++){
    poison[i].display();
  }

  //draw, move and deal with collisions of bacteria
  for (i = 0; i < bacteriaPop; i ++){
    //find closest food to bacteria
    let indexNearest = targetFindNearest(i);
    //if that bacteria intersects with that food...
    if ( intersectingPoint(bacteria[i].x,bacteria[i].y,bacteria[i].r,food[indexNearest].x,food[indexNearest].y) && (foodPop > 1)){
      //delete the food, and add the food hp to the bacteria
      bacteria[i].hp += food[indexNearest].hpAffect; //increase hp
      bacteria[i].r += food[indexNearest].hpAffect; //increase radius
      bacteria[i].flagella.historyLength ++; //increase length of flagella.
      food.splice(indexNearest,1); //delete food from array
      foodPop --;
    }
    //based on target posiiton calculate ideal velocity so the bacteria would reach the desired pos in 1 frame
    bacteria[i].desiredVelocity(mouseX,mouseY);
    bacteria[i].accelerationToDesired(); //calc acceleration with constraint so that the bacteria moves towards target
    bacteria[i].accelerate(); //add acceleration to velocity
    bacteria[i].move(); //add velocity to posiiton, wrap around screen
    bacteria[i].display(); //draws bacteria and triggers draw event of bacteria's flagella
  }

  //calcs if player is currently dragging a point
  for (i = 0; i < boxNumber; i ++){
    //if mouse is intersecting point, begin dragging that point (changing its x,y,a,r offsets)
    if ((mouseIsPressed === true)&&(pointDrag === -1)){
        for (j = 0; j < box[i].n; j ++){
          //if mouse intersecting with point begin "drag state"
          if (box[i].checkCollisionPoint(mouseX,mouseY,j) === true){
            pointDrag = j;
          }
        }
    }
    //if player is trying to drag point, move the point by recalcting their positional
    //(cartesian and polar) offsets so that they make the point appear at mouse current mouse position
    if (pointDrag > -1){
      let pt = box[i].point[pointDrag];
      //store x,y offsets incase wanting to revert back to them later.
      let pointXOffPrev = pt.xOff;
      let pointYOffPrev = pt.yOff;
      //find mouse Offset (relative to box[i] pos)
      let mOffX = mouseX - box[i].x;
      let mOffY = mouseY - box[i].y;
      //calc angle offset and radius of mx pos relative to box[i]
      let mOffA = atan2(mOffY,mOffX);
      let mOffR = sqrt(sq(mOffX)+sq(mOffY));
      pt.movePolar(mOffA-box[i].a, mOffR);
      //if the latest transformation to the mouse's pos has resulted in...
      //the net radius' of points being too high
      //then revert to point.offsets to what they were pre transformation
      if ( (box[i].currentTotalRadius() > box[i].maxTotalRadius) ){
        print("OVER MAX RADIUS");
        pt.moveCartesian(pointXOffPrev,pointYOffPrev);
        //if grab reverted to prev position draw black circle sourronding point
        box[i].drawGrab(pointDrag,100,51,51);
      } else{ //if grab translated sucesfully draw white circle sourronding point
        box[i].drawGrab(pointDrag,255,255,255);
      }
    }

    //deal with player input and changes macrophage acceleration and velocity (linear and angular) accordingly
    if (keyIsDown(RIGHT_ARROW)) {
      box[i].angularAcceleration(rotationInc);
    }
    if (keyIsDown(LEFT_ARROW)) {
      box[i].angularAcceleration(-rotationInc);
    }
    if (keyIsDown(UP_ARROW)) {
      box[i].accelerate(acc,0);
    }
    if (keyIsDown(DOWN_ARROW)) {
      box[i].accelerate(-acc,0);
    }
    box[i].move(); //change pos of box based on velocity
    //box[i].fillBackground(0,0,0,100);//fills that isn't the collider w/a certain color
    box[i].displayFlagellum();
    box[i].fillShape(255,255,255,50);
     //calculate current position of points based on the macrophage's rotation and the points position offsets
    box[i].rotate();
    box[i].drawRadiusUI(); //draws UI representing food remaining and current expansion potential.
    box[i].display(); //display points of macrophage
    box[i].displayNucleus(); //displays center of macrophage with a directional indicator
    
     //delete bacteria from array if intersecting with it
     for (let j = 0; j < bacteriaPop; j ++){
         if (box[i].checkCollision(bacteria[j].x,bacteria[j].y) === true){
           bacteria[j].hp -= .2;
           bacteria[j].r -= .2;
           if (bacteria[j].hp < 0){
             bacteria.splice(j,1);
             box[i].maxTotalRadius+=8; //increase potential size
             bacteriaPop --;
           }
         }
     }
     //make sure that poison can't spawn on top of macrophage,
     //check collision of macrophage with posion and change gamestate accordingly
    for (let j = 0; j < poisonPop; j++){
      //if first frame and macrophage is intersecting poison then move poison to random location until its not intersecting
      if (poisonInitialize === false){
        while (box[i].checkCollision(poison[j].x,poison[j].y) === true){ //if first frame of game, move poison elsewhere
          poison[j].x = random(width);
          poison[j].y = random(height);
        }
        //if not first frame and macrophage is intersecting poison, then gamestate = loss from intoxication;
      }else if (box[i].checkCollision(poison[j].x,poison[j].y) === true) {
        lost = 1;
      }
    }
    //if food is less than 5% of its initial population then gamestate = loss from malnourishment
    if (food.length < (foodPopInitial*.05)){
      lost = 2;
    }
    //if bacteria is less than 10% of the population, then you won
    if (bacteria.length < (bacteriaPopInitial*.1)){
      lost = 3;
    }
   }
   //after the first frame of gameplay poisonInitialize will always be set to true
   poisonInitialize = true;


   //dispaly informational text on how to play at the start of the game
   textSize(32);
   textAlign(CENTER);
   noStroke();
   fill(255,255,255,textOpacity);
   text("You're a macrophage.",width/2,64);
   text("Deal with the bacteria before they eat all the food!",width/2,128);
   text("Avoid the poison!",width/2,126+64);
   fill(255,255,255,textOpacity2);
   text("(you can manipulate your size by clicking and dragging)",width/2,256);
   text("(keep shapes convex or the macrophage gets confused)",width/2,256+64);
   textOpacity -= 1;
   textOpacity2 -= .4;

   //display appropriate text and play appropritate sounds on loss/win
   if (lost > 0){
     background(204,57,46);
     fill(255);
     textSize(24);
     textAlign(CENTER);
     ambientSnd.pause();
     if (lost === 1){
       text("a macrophage was infected by poison and died...",width/2,height/2);
       deathSnd.play();
       winSnd.pause();
     }
     if (lost === 2){
       text("a body a macrophage was defending died from malnourishment...",width/2,height/2);
       deathSnd.play();
       winSnd.pause();
     }
     if (lost === 3){ //if the player has won..
       background(60,204,45);
       fill(255);
       text("the macrophage and body endured the threat, you won",width/2,height/2);
       winSnd.play();
       deathSnd.pause();
     }

   }
}

//find the closest food to a given bacteria (intentionally imperfect)
function targetFindNearest(i){
  //find nearest food to bacteria
  let shortestDistSoFar = Infinity;
  let indexClosest = 0; //index of closest food

  //cycle through all foods
  for (j = 0; j < foodPop; j ++){
    //find dist between bacteria and food
    let distanceToFood = sqrt(sq(food[j].x-bacteria[i].x)+sq(food[j].y-bacteria[i].y));
    //if that dist is less than the shortest dist encountered so far
    if (distanceToFood < shortestDistSoFar){
      if (random(1) > 0.85){ //only chooses correctly some of the time (increases randomness and organic-ness)
        shortestDistSoFar = distanceToFood; //set that dist to shortest dist
        indexClosest = j; //make the index of the closest food reference this food [j]
      }
    }
  }
  //set target of bacteria to closest food
  bacteria[i].targetX = food[indexClosest].x;
  bacteria[i].targetY = food[indexClosest].y;
  return indexClosest;
}

//is a circle (x,y,r) intersecting a specefic point (x,y)?
function intersectingPoint(x1,y1,r1,x2,y2){
  if ((x2 < x1+r1) &&(x2 > x1-r1 )){
    if ((y2 < y1+r1) &&(y2 > y1-r1 )){
      return true; //if x,y is intersecting w/point
    }
  }
  else{ //if not colliding
    return false;
  }
}

function mouseReleased(){ //once mouse is released, stop dragging points
  pointDrag = -1;
}

/*
the object resulting from the BoxCollider class represents the macrophage and makes up the
core of this project both programtically,conceptually and creatively.
The class can be understood as dealing with 4 primary things...

movement of anchor: this class has a movement system which works within the paradigm of
position += velocity; velocity += acceleration; it deals with both linear and angular momentum
this way.

Points: every BoxCollider object has several "points" which are translational and rotational
anchored around the anchor (see "movement of anchor section"); the basic paradigm is that
every point has certain offsets relative to the anchor and those offsets are recorded
principally via polar coordinates (angle, radius); when the anchor moves and rotates the
points' current (x,y) position are calculated with these polar offsets in mind.

CollisionSystem: The collision systems check to see if a given position is intersecting
with the imaginary shape created between all the points. This is done basically through a
series of linear inequalities which are created by creating functions between each ajacent point,
if all the inequalities are satisfied then the position MUST be within the imaginary shape
within the points.
Note: this system has proved to only work properly for convex shapes

//Draw the rest of the BoxCollider class deals with the graphical representations of the
data contained within a macrophage object,
*/
class BoxCollider {
  constructor(x,y,n){
    angleMode(DEGREES);
    //x = xpos of parent
    //y = ypos of parent
    //n = number of vertices
    //r = angle in degrees.
    this.x = x;
    this.y = y;
    this.n = n;
    this.a = 0;
    //(anything that doesn't contian "angular" velocity is assumed to be linear velocity related)
    this.velocityX = 0;
    this.velocityY = 0;
    this.drag = 1.01;
    this.maxVelocity = 8;

    this.angularVelocity = 0;
    this.maxAngularVelocity = 2;
    this.angularVelocityDrag = 1.1;
    //set points
    this.point = [];
    this.maxTotalRadius = 100*this.n; //maxium number of radius
    //create a set default pos of points
    for (let i = 0; i < this.n; i ++){
      print(i);
      this.point[i] = new Point(i*20,i*10); //creaet obj and set vars
    }
  }

  angularAcceleration(angularAcceleration){
    //add acceleraiton to angular velocity
    this.angularVelocity += angularAcceleration;
    //constrain angVelocity ot maxspeed
    if (this.angularVelocity < -this.maxAngularVelocity){
      this.angularVelocity = -this.maxAngularVelocity;
    }
    else if (this.angularVelocity > this.maxAngularVelocity){
      this.angularVelocity = this.maxAngularVelocity;
    }

    //after rotation recalculate point x and y's (assuming this(x,y) is the pivot point)
    for (let i = 0; i < this.n; i ++){
      this.point[i].x = cos(this.point[i].aOff+this.a)*this.point[i].rOff;
      this.point[i].y = sin(this.point[i].aOff+this.a)*this.point[i].rOff;
      //this.point[i].a = atan2(this.point[i].y,this.point[i].x);
      //this.point[i].r = sqrt(sq(this.point[i].x)+sq(this.point[i].y));
    }
  }
  rotate(){
    //calc drag on angular velocity
    this.angularVelocity = this.angularVelocity/this.angularVelocityDrag;
    //add velocity to rotation/angle
    this.a += this.angularVelocity;
    //recalculate point x and y's of points (assuming this(x,y) is the pivot point)
    for (let i = 0; i < this.n; i ++){
      this.point[i].x = cos(this.point[i].aOff+this.a)*this.point[i].rOff;
      this.point[i].y = sin(this.point[i].aOff+this.a)*this.point[i].rOff;
      //this.point[i].a = atan2(this.point[i].y,this.point[i].x);
      //this.point[i].r = sqrt(sq(this.point[i].x)+sq(this.point[i].y));
    }
  }
  accelerate(xvec,yvec){
    let accX = xvec;
    let accY = yvec;
    //calc angle and radius of vector
    let accR = sqrt(sq(accX)+sq(accY));
    let accA = atan2(accY,accX);
    //find new vector based on current angle of this
    let accXNew = cos(accA+this.a)*accR;
    let accYNew = sin(accA+this.a)*accR;

    //add acceleration to velocity
    this.velocityX += accXNew;
    this.velocityY += accYNew;

    //constrain to maxVelocity
    if (this.velocityX>this.maxVelocity){
      this.velocityX = this.maxVelocity;
    }
    else if (this.velocityX<-this.maxVelocity){
      this.velocityX = -this.maxVelocity;
    }
    if (this.velocityY>this.maxVelocity){
      this.velocityY = this.maxVelocity;
    }
    else if (this.velocityY<-this.maxVelocity){
      this.velocityY = -this.maxVelocity;
    }

  }

  move(){
    //calc drag
    this.velocityX = this.velocityX/this.drag;
    this.velocityY = this.velocityY/this.drag;
    //add velocity to position
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.wrap(this.x,this.y,90);
    for (let i = 0; i < this.n; i ++){ //every move add histories of
       this.point[i].flagella.addHistory(this.point[i].x+this.x,this.point[i].y+this.y);
    }
  }
  wrap(x,y,r){ //wrap screen and redraw flagella if wrap has occured (so it doesn't leave trail across entire screen)
    if (this.x-r>width){
      this.x = 0-r;
      for (let i = 0; i < this.n; i ++){
         this.point[i].flagella.deleteHistory();
      }
    }
    if (this.x+r<0){
      this.x = width-r;
      for (let i = 0; i < this.n; i ++){
         this.point[i].flagella.deleteHistory();
      }
    }
    if (this.y-r>height){
      this.y = 0-r;
      for (let i = 0; i < this.n; i ++){
         this.point[i].flagella.deleteHistory();
      }
    }
    if (this.y+r<0){
      this.y = height+r;
      for (let i = 0; i < this.n; i ++){
         this.point[i].flagella.deleteHistory();
      }
    }
  }
  checkCollision(x,y){
    // print(x);
    // print(collisionX)
  //  print(y);
  //  print(collisionY)
    let l1;
    let l2;

    for (let i = 0; i < this.n; i ++){
      if (i < this.n-1){ //draw line between current point and next point in array
        l1 = this.point[i];
        l2 = this.point[i+1];
      } else { //if i === last point in array, join it w/first point
        l1 = this.point[i];
        l2 = this.point[0];
      }


      l1.slope = (l2.y-l1.y)/(l2.x-l1.x);
      //find y of function l1-->l2 at collisionX (y = m(x-h)+k)
      //translation occurs so that l1 becomes the cartesian origin
      let lineY = (l1.slope * ( x -  (this.x+l1.x) ) ) + (this.y+l1.y);
      //check inequality (is lineY bigger than or less than collisionY)
      //inequalities change depending on the .greatThan var
      //if all inequalities are true, return true

      //change inequaltiies depending on the quadrant that the line is in
      if (l2.x-l1.x > 0){ //when line is facing down towards the origin (this.x,this.y)
        //l1.r = 0;
        //l1.b = 255;
          if (lineY >= y){
            return false;
          }
      }
      else if (l2.x-l1.x < 0){ //when line is facing up towards the origin (this.x,this.y)
        //l1.r = 255;
        //l1.b = 0;
        if (lineY <= y){
          return false;
        }
      }
      //fill(l1.r,l1.g,l1.b);
      //ellipse(collisionX,lineY,20);
    }
    //if none of the collisions have been false, then collision must be true
    return true;
  }
  checkCollisionPoint(x,y,i){
    //check collision w/a point
    let ptX = this.point[i].x + this.x;
    let ptY = this.point[i].y + this.y;
    let ptRadius = this.point[i].radius;

    if ((mouseX < ptX+ptRadius) &&(mouseX > ptX-ptRadius )){
      if ((mouseY < ptY+ptRadius) &&(mouseY > ptY-ptRadius )){
        return true; //if x,y is intersecting w/point
      }
    }
    else{ //if not colliding
      return false;
    }
  }
  currentTotalRadius() {
    //if all of points radius' combined are bigger than maxTotalRadius then return false, else return true
    let currentRadius = 0;
    for (let i = 0; i < this.n; i ++){
      currentRadius += this.point[i].rOff;
    }
      return currentRadius;
  }

  checkConcave(pointDrag){ //DOES NOT FUNCTION PROPERLY AND ACCORDINGLY IS NOT BEING USED IN THIS PROJECT
    //checks to see if shape is currently concave and returns true if it is.
      //for (i = 0; i <this.n; i++){
        //get indexes of three points
        let angleTotal = 0;
        for (let i = 0; i < this.n; i++ ){
        let j = i;
        let a = this.point[j];
        //cycle through array, if past array lengtht then make index array start (array[[0]])
        j++;
        if (j > this.n-1){
          j = 0;
        }
        let b = this.point[j];

        j++
        if (j > this.n-1){
          j = 0;
        }
        let c = this.point[j];

        //calc dist of lines between point
        let ab = sqrt(sq(b.x-a.x)+sq(b.y-a.y));
      //  print("a b= "+ab);
        //calc dist of lines between point
        let bc = sqrt(sq(c.x-b.x)+sq(c.y-b.y));
        //calc dist of lines between point
        let ca = sqrt(sq(a.x-c.x)+sq(a.y-c.y));

        //law of cosines to get angle of b and add that angle to totalAngle
        let angleB = acos( (sq(ab) + sq(bc) - sq(ca) )  /  (ca*ab) );
        angleTotal += angleB;
        //debug
        // fill(0,255,255,50);
        // ellipse(a.x+this.x,a.y+this.y,40);
        // ellipse(b.x+this.x,b.y+this.y,40);
        // ellipse(c.x+this.x,c.y+this.y,40);
    }


    //use law of cosines to add up all internal angles between points, if > 360 then concave
    return angleTotal;

  }
  fillBackground(r,g,b,a){
    for (let i = 0; i < this.n; i ++){
      let l1;
      let l2;
      if (i < this.n-1){ //draw line between current point and next point in array
        l1 = this.point[i];
        l2 = this.point[i+1];
      } else { //if i === last point in array, join it w/first point
        l1 = this.point[i];
        l2 = this.point[0];
      }

      l1.slope = (l2.y-l1.y)/(l2.x-l1.x);
      loadPixels();
      for(let j = 0; j < width; j ++){
        for(let k = 0; k < height; k ++){
          let lineY = (l1.slope * ( j -  (this.x+l1.x) ) ) + (this.y+l1.y);
          let index = 4*(j+(k*width));

          if (l2.x-l1.x > 0){
              if (lineY >= k){
                pixels[index+0] = r;
                pixels[index+1] = g;
                pixels[index+2] = b;
                pixels[index+3] = a;
              }
          }
          else if (l2.x-l1.x < 0){ //when line is facing up towards the origin (this.x,this.y)
            if (lineY <= k){
              pixels[index+0] = r;
              pixels[index+1] = g;
              pixels[index+2] = b;
              pixels[index+3] = a;
            }
          }
        }
      }
      updatePixels();



      //fill(l1.r,l1.g,l1.b);
      //ellipse(collisionX,lineY,20);
    }
    //if none of the collisions have been false, then collision must be true

  }
  fillShape(r,g,b,a){

    fill(160,130,160,100);
    stroke(255,190,255,200);
    strokeWeight(0.008*this.maxTotalRadius);
    beginShape();
    for (let i = 0; i < this.n; i ++){
      vertex(this.point[i].x+this.x,this.point[i].y+this.y)
    }
    endShape(CLOSE);
  }
  equalSpread(r){ //equally distrbutes an n-number of points around the origin (with an arbitrary radius)
    let aInc = 360/(this.n);
      for (i = 0; i < this.n; i ++){
        this.point[i].movePolar(aInc*i,r);
      }
        this.maxTotalRadius = r*this.n*1.1; //maxium number of radius
  }
  display (){ //display points

    for (let i = 0; i < this.n; i ++){
      fill(180,160,180,255);
      stroke(255,190,255,200);
      strokeWeight(0.008*this.maxTotalRadius);
      ellipse(this.point[i].x+this.x,this.point[i].y+this.y,(this.point[i].radius+this.point[i].rOff)/4);
      //draw (x,y) of points

    }

  }

  displayFlagellum(){
    for (let i = 0; i < this.n; i ++){
      this.point[i].flagella.display(this.velocityX,this.velocityY,this.point[i].radius/16);
    }
  }
  displayNucleus(){
    //draw line starting at anchor which points in opposite direction that macrophage is facing
    strokeWeight(8);
    let rrr = 15;
    let x2 = (cos(this.a+180)*rrr)+this.x;
    let y2 = (sin(this.a+180)*rrr)+this.y;
    line(this.x,this.y,x2,y2);

    fill(180,160,180,255);
    stroke(255,190,255,200);
    strokeWeight(0.008*this.maxTotalRadius);
    //draw nuculeus
    ellipse(this.x,+this.y,this.maxTotalRadius/25);
    strokeWeight(1);
  }

  drawGrab(i,r,g,b){ //draws indicator sourronding whatever point being grabbed
    //i = index of point to drawGrab
    //r g b = color in rgb
    let pt = this.point[i];
    stroke(255,255,255,150);
    fill(r,g,b,70);
    ellipse(pt.x+this.x,pt.y+this.y,pt.radius*3);
  }

  drawRadiusUI(currentTotalRadius){
    //calc current radius
    let currentRadius = 0;
    for (let i = 0; i < this.n; i ++){
      currentRadius += this.point[i].rOff;
    }
    //calc current radius available to be used.
    let currentUnused = this.maxTotalRadius-currentRadius;

    let xO = 50;
    let yO = height-50;
    //draw on screen.
    strokeWeight(8);
    if (!(currentRadius > this.maxTotalRadius-2)){
    //  stroke(100,100,100);
      //line(this.maxTotalRadius+xO,yO,xO,yO);
      stroke(255,180,255);
      line(currentUnused+xO,yO,xO,yO);
      stroke(255,255,255);
      strokeWeight(1);
    }else{
      //stroke(100,100,100);
      //line(this.maxTotalRadius+xO,yO,xO,yO);
      stroke(255,255,255);
      strokeWeight(1);
    }

    //draw food remaining
    strokeWeight(8);
    stroke(150,186,150);
    let xO2 = map(foodPop,0,foodPopInitial,0,width);
    line(xO,yO+16,xO2-(xO*2),yO+16);
    strokeWeight(1);

  }


} //end of class BoxCollider

/*
(overview of the purpose and function of the Point Class above the boxCollider Class)
*/
class Point {
  constructor(x,y){
    //calc offsets from parent based on (relative x,y offset from parents)
    this.xOff = x; //xoff from parent
    this.yOff = y; //yoff from parent
    this.slope = 1; //default slope
    this.radius = 22;
    //randomize color


    this.flagella = new Flagella(64); //every point has its own flagella
    this.flagella.r = 255;
    this.flagella.g = 190;
    this.flagella.b = 255;

    this.rOff = sqrt(sq(this.xOff)+sq(this.yOff));
    //  this.r = this.rOff;

    this.aOff = atan2(this.yOff,this.xOff);
    //  this.a = this.aOff;
  }
  moveCartesian(x,y){ //recalculates a and r offsets (polar) based on new (cartesian) x,y offsets
    this.xOff = x;
    this.yOff = y;
    this.aOff = atan2(this.yOff,this.xOff);
    this.rOff = sqrt(sq(this.xOff)+sq(this.yOff));
  }
  movePolar(a,r){ //calcs cartesian offsets to this. based on polar offset values
    this.aOff = a;
    this.rOff = r;

    this.xOff = cos(this.aOff)*this.rOff;
    this.yOff = sin(this.aOff)*this.rOff;
  }
}
//end of point object

/*------------
a bacteria/prey will always try to move towards a specefic point on the screen (targetX/Y)
and to do this uses a completely cartesian movement system (always x,y vectors never angles and radius')
which uses acceleration velocity and position.

The function which selects this target is located in script.js and finds the nearest food to the bacteria
every bacteria contains its on flagella which it displays on top of a circle which corresponds to its current hp.
-------------*/

class Prey {
  constructor(x,y,r){
    this.x = x; //position
    this.y = y;
    this.r = r; //radius
    this.hp = 1; //once below 0 bacteria is dead
    this.xVel = 0; //velocity
    this.yVel = 0;
    this.maxVel = .8;
    this.xAcc = 0; //acceleration
    this.yAcc = 0;
    this.desiredVelX; //desired vel
    this.desiredVelY; //desired vel
    this.maxAcc = 0.04;
    this.targetX = width/2; //target to travel to
    this.targetY = height/2;

    this.flagella = new Flagella(16); //every bacteria has its own flagella
    this.flagella.r = 244;
    this.flagella.g = 200;
    this.flagella.b = 150;
    // this.point = [new Preypoint(0,10), new Preypoint(0,-10)];
  }

  desiredVelocity(targetX,targetY){
    //calc velocity necessary to reach target in 1 frame
    this.desiredVelX = (this.targetX-this.x);
    this.desiredVelY = (this.targetY-this.y);

  }
  accelerationToDesired(){ //change acceleration to try to achieve desired velocity, keeping in mind constraint maxAcc
    this.xAcc = constrain(this.desiredVelX,-this.maxAcc,this.maxAcc);
    this.yAcc = constrain(this.desiredVelY,-this.maxAcc,this.maxAcc);
  }

  accelerate(){ //adds acc to velocity
    //this.xAcc = random(-1,1);
    //this.yAcc = random(-1,1);
    this.xVel += this.xAcc;
    this.yVel += this.yAcc;

    //constrain to maxSpeed (I dont know how to use constrain)
    if (this.xVel > this.maxVel){
      this.xVel = this.maxVel
    }
    if (this.yVel > this.maxVel){
      this.yVel = this.maxVel
    }
    if (this.xVel < -this.maxVel){
      this.xVel = -this.maxVel
    }
    if (this.yVel < -this.maxVel){
      this.yVel = -this.maxVel
    }
  }
  move(){ //adds velocity to pos
    this.x += this.xVel;
    this.y += this.yVel;
    this.wrap(this.x,this.y,this.r);
    let rr = 2;
    this.flagella.addHistory(this.x+random(-rr,rr),random(-rr,rr)+this.y);
  }
  wrap(x,y,r){ //wrap screen, restart drawing flagella (so it doesn't leave trail across entire screen)
    if (this.x-r>width){
      this.x = 0;
      this.flagella.deleteHistory();
    }
    if (this.x+r<0){
      this.x = width;
         this.flagella.deleteHistory();
    }
    if (this.y-r>height){
      this.y = 0;
      this.flagella.deleteHistory();
    }
    if (this.y+r<0){
      this.y = height;
      this.flagella.deleteHistory();

    }
  }

  display(){
    this.flagella.display();
    fill(140,120,90);
    strokeWeight(1);
    stroke(244,200,150);
    ellipse(this.x,this.y,this.r);

    //ellipse(this.targetX,this.targetY,10); //draw ellipse around current target
  }
}
// end of class

/*
The flagella basically draws a trail of (x,y) histories of another object
*/

class Flagella {
  constructor(historyLength){
  this.x = [];
  this.y = [];
  this.historyLength = historyLength;
  this.r = 255;
  this.g = 255;
  this.b = 255;
  }
  addHistory(x,y){
    //adds new x,y pos at end of array
    let rRange = 1;
    this.x.push(x+random(-rRange,rRange));
    this.y.push(y+random(-rRange,rRange));

    //if array too big then remove latest history (first elements on array)
    if (this.x.length >= this.historyLength){
      this.x.splice(0,1);
      this.y.splice(0,1);
    }
  }
  deleteHistory(){ //removes all (x,y)history
    this.x.splice(0,this.x.length);
    this.y.splice(0,this.y.length);
  }
  display(){ //draws history of x pos
    //x = xpos of anchor
    //y = ypos of anchor
    stroke(this.r,this.g,this.b,255);
    for (let i = this.x.length; i > 0; i --){
      //ellipse(this.x[i],this.y[i],radius);
      if (i < this.x.length){ //if not last element, draw line between pos histories
        strokeWeight((i/16)+1);
        line(this.x[i],this.y[i],this.x[i+1],this.y[i+1]);
      }
    }
  }
}
//end of class Flagella

class Food{
  constructor(x,y,radius,hpAffect){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hpAffect = hpAffect; //what happens to a prey's hp when eating this obj?
  }
  display(){
    fill(150,186,150);
    noStroke();
    ellipse(this.x,this.y,this.radius);
  }
}
//end of class food

class Poison{
  constructor(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  display(){
    fill(185,255,80);
    noStroke();
    ellipse(this.x,this.y,this.radius);
  }
}
