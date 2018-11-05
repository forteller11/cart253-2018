class Paddle {
  constructor(upKey, downKey, leftKey, rightKey, fluidKey, r, g, b) {
    //stores key codes to move and shoot fluid from the paddle
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;

    //rgb color values of paddle
    this.r = r; //this is also used to check whether the player is the right or left paddle
    this.g = g;
    this.b = b;
    this.score = 0; //tracks the score of each paddle
    this.scored = 0; //used to flash the screen the colour of the paddle on score


    this.x;
    this.y;
    this.accX = 5;
    this.accY = 7;
    this.velX = 0; //velocity
    this.velY = 0; //velocity
    this.maxVelY = 14;
    this.maxVelX = 6;
    this.drag = 2.4;
    this.width = 16;
    this.height = 80;
    this.fillMeter = 0; //what % of the paddle will be filled on collision w/ball?
    this.sWeight = 1; //used to interpolate between min and max stroke widths (1 = min, 2 = max)

    //shape
    this.shape = new Shape(this.x, this.y, 0, 4);
    shapes.push(this.shape);
    //bottom right
    this.shape.vertAOff[0] = atan2(this.height/2,this.width/2);
    this.shape.vertR[0] = sqrt(sq(this.height/2)+sq(this.width/2));
    //bottom left
    this.shape.vertAOff[1] = atan2(-this.height/2,this.width/2);
    this.shape.vertR[1] = sqrt(sq(-this.height/2)+sq(this.width/2));
    //upper left
    this.shape.vertAOff[2] = atan2(-this.height/2,-this.width/2);
    this.shape.vertR[2] = sqrt(sq(-this.height/2)+sq(-this.width/2));
    //upper right
    this.shape.vertAOff[3] = atan2(this.height/2,-this.width/2);
    this.shape.vertR[3] = sqrt(sq(this.height/2)+sq(-this.width/2));

    this.shape.update();
    this.shape.display();

    //oscillator
    this.oscAdrenaline = new p5.Oscillator();
    this.oscAdrenaline.setType('sawtooth');
    this.oscAdrenaline.freq(this.oscAdrenalineFreq);
    this.oscAdrenaline.amp(0);
    this.oscAdrenaline.start();
  }

  update(){
    this.accelerate(); //deal with inputs
    this.changePos(); //move
    this.updateOscillator();
    this.checkBallCollision();
    //display
    this.displayScore(); //paddles score
    this.displayFillMeter(); //meter in paddle
    this.displayPaddle(); //outline of paddle
    this.shape.x = this.x;
    this.shape.y = this.y;
    this.shape.update();
    this.shape.display();
  }

  updateOscillator(){
    //changes frequency and amp based of oscillator based off net velocities of paddles
    this.oscAdrenalineFreq = 2 * (abs(this.velX*2) + abs(this.velY) + 20);
    this.oscAdrenalineAmp = .005 * (abs(this.velX*2) + abs(this.velY));
    this.oscAdrenaline.amp(this.oscAdrenalineAmp);
    this.oscAdrenaline.freq(this.oscAdrenalineFreq);
  }

  displayFillMeter() {
    //fills in the paddle briefly with a meter repsenting how hard the ball was hit last
    let w = this.width / 2;
    let h = this.height / 2;
    let x1 = -w + this.x;
    let x2 = w + this.x;
    let y1 = -h + this.y; //top of paddle
    let y2 = h + this.y; //bottom of paddle
    //map the 0-1 value of the fillMeter to the bottom and top of the paddle;
    this.fillMeter = constrain(this.fillMeter, 0, 1); //constrain to 0-1 so meter doesnt bleed over strokes of paddle
    let y1Dynamic = map(this.fillMeter, 0, 1, y2, y1);
    this.fillMeter *= 0.97; //shrink the meter every frame


    rectMode(CORNERS);
    noStroke();

    fill(0);
    rect(x1, y2, x2, y1);
    //when ball is hit draws fill with full color, fading to black quickly
    fill(this.r, this.g, this.b);
    rect(x1, y2, x2, y1Dynamic);
  }

  displayPaddle() {
    let w = this.width / 2;
    let h = this.height / 2;
    let x1 = -w + this.x;
    let x2 = w + this.x;
    let y1 = -h + this.y;
    let y2 = h + this.y;

    this.sWeight *= .9;
    constrain(this.sWeight, 0, 1);
    stroke(this.r, this.g, this.b);
    //draw paddle with width and color, increase stroke weight as paddle is closer to center of screen

    let strokeW = map(this.sWeight, 0, 1, minStrokeWidth, maxStrokeWidth);

    strokeWeight(strokeW);
    line(x1, y1, x2, y1);
    line(x2, y1, x2, y2);
    line(x2, y2, x1, y2);
    line(x1, y2, x1, y1);
  }

  accelerate() {
    //check for inputs and change velocity accordingly
    if ((keyIsDown(this.upKey)) ||
      (keyIsDown(this.downKey)) ||
      (keyIsDown(this.rightKey)) ||
      (keyIsDown(this.leftKey))) {
      //add acceleration according to inputs
      if (keyIsDown(this.upKey)) {
        this.velY -= this.accY;
      }
      if (keyIsDown(this.downKey)) {
        this.velY += this.accY;
      }
      if (keyIsDown(this.leftKey)) {
        this.velX -= this.accX;
      }
      if (keyIsDown(this.rightKey)) {
        this.velX += this.accX;
      }
      //here i apply drag so that the player seems to accelerate more at lower speeds,
      //and less quickly at higher speeds --> creates for a nice ramp of acceleration which feels better
      //because the horizontal play-space is smaller than the vertical, you can move less quickly horizontally than vertically
      this.velX = this.velX / (this.drag / 1.6);
      this.velY = this.velY / (this.drag / 1.4);
    }
    //if not currently accelerate apply more drag so that the player
    //does not seem "floaty" and stops rather quickly
    else {
      //apply drag
      this.velX = this.velX / this.drag;
      this.velY = this.velY / this.drag;

    }
    //constrain velocities
    this.velX = constrain(this.velX, -this.maxVelX, this.maxVelX);
    this.velY = constrain(this.velY, -this.maxVelY, this.maxVelY);
  }

  changePos() { //changes position based on velocity
    //adds velocity to position
    this.x += this.velX;
    this.y += this.velY;

    let w = (this.width / 2) + minStrokeWidth / 2;
    let h = (this.height / 2) + minStrokeWidth / 2;

    //constrain x positions based on if the paddle is left or right, constrains y pos identically
    if (this.r > 200) { //if right paddle
      this.x = constrain(this.x, (width / 2) + w + w, width - w);
    } else {
      this.x = constrain(this.x, w, (width / 2) - w - w);
    }
    this.y = constrain(this.y, h, height - h);
  }

  checkBallCollision() {
    let w = this.width / 2;
    let h = this.height / 2;
    let r = ball.radius;
    let x = this.x;
    let y = this.y;
    let xx = ball.x;
    let yy = ball.y;

    //////////////NEW (increased robust-ness of collision relative to exercise4)
    //if ball is colliding with paddle...
    if ((xx < x + w + r) && (xx > x - w - r)) {
      if ((yy < y + h + r) && (yy > y - h - r)) {

        ball.r = this.r;
        ball.g = this.g;
        ball.b = this.b;


        //save balls velocity for later calculations deaing with the effect of the ball on the paddle's velocity
        let ballVelXStore = ball.velX;
        let ballVelYStore = ball.velY;
        let thisVelXStore = this.velX;
        let thisVelYStore = this.velY;

        //deal with changes to the ball's x velocity....
        //make sure the ball is travelling towards the center of the screen (towards the oppponents court)
        if ((ball.velX > 0) && (ballVelXStore >= thisVelXStore)) { //right paddle
          ball.velX *= -1;
        } else if ((ball.velX < 0) && (ballVelXStore < thisVelXStore)) { //left paddle
          ball.velX *= -1;
        }
        //increase xvelocity of ball based on xvel of paddle
        ball.velX += this.velX / 10;
        //increase/decrease xvel of ball depending on how close the paddle
        //is to the center of the screen (closer = faster xvel)

        let spdInc; //a multiplier from .6-1.5 based on how close the paddle is to the middle of the screen
        if (this.r >= 200) { //for the right paddle
          spdInc = map(this.x, width / 2, width, 1.5, 0.6);
        } else if (this.r < 200) { //for the left paddle
          spdInc = map(this.x, 0, width / 2, 0.6, 1.5);
        }
        ball.velX = ball.velX * spdInc;
        //if ball hits paddle from left and still has a greater xvelocity then paddle
        //then make the balls xvel = paddle's x vel so it doesnt collide again with the paddle next frame
        if ((ball.velX >= this.velX) && (ballVelXStore >= thisVelXStore)) {
          ball.velX = this.velX;
        }
        //if ball hits paddle from right and still has a lower xvelocity then paddle
        //then make the balls xvel = paddle's x vel so it doesnt collide again with the paddle next frame
        else if ((ball.velX < this.velX) && (ballVelXStore < thisVelXStore)) {
          ball.velX = this.velX;
        }


        // deal with changes to the ball's y velocity....
        //change yvelocity of ball based on where the collision has occured
        //(collision w/center of the paddle = 0 ball.yvel
        //hits with the edges make the ball bounce away from the center
        ball.velY = (ball.y - this.y) / 20;
        ball.velY += this.velY / 4; //increase yvel of ball based on yvel of paddle

        //move the ball outside the paddle hitbox (right paddle)
        while ((ball.x < x + w + r) && (ball.x > x - w - r) &&
          (ball.y < y + h + r) && (ball.y > y - h - r)) {
          if (ballVelXStore >= thisVelXStore) {
            //ball.x -= ball.velX/ball.velX; OORRR
            ball.x--;
            ball.y -= (ball.velY) / ball.velX;
          } else if (ballVelXStore < thisVelXStore) {
            //ball.x += ball.velX/ball.velX; ORRR
            ball.x++;
            ball.y += (ball.velY) / ball.velX;
          }
        }

        this.velX = ballVelXStore * 1.5; //make paddles bounce back on collsion based on the ball's xvelocity
        this.velY = ballVelYStore * 1.5; //make paddles bounce back on collsion based on the ball's yvelocity

        let xMagnitude = abs(ball.velX);
        //change sound and animations/graphics based upon x speed of ball
        ball.whiteFlash = map(xMagnitude, 0, ball.maxVelX, 0, 3); //makes ball flash white
        ball.sizeFlash = map(xMagnitude, 0, ball.maxVelX, 1, 1.8); //makes ball briefly enlarge
        //this.hit = map(xMagnitude,0,ball.maxVelX,0,1); //
        this.fillMeter = map(xMagnitude, 0, ball.maxVelX, 0, 1);
        this.sWeight = map(xMagnitude, 0, ball.maxVelX, 1, 2); //makes ball briefly enlarge
        //increase frequency of oscillator
        oscAmbienceFreq += map(xMagnitude, 0, ball.maxVelX, 0, 40) + 10;
      }
    }
  }

  displayScore() {
    //for everypoint each paddle draws a dotted line near the middle of the map in thier own color
    // once the dotted line reaches the edge of the canvas the dotted line is wrapped around the screen
    let hPI;
    if (this.r >= 200) { //if right offset score by positive
      hPI = horzPaddleIndent;
    } else { //if left offset by negative
      hPI = -horzPaddleIndent;
    }

    let lineAmount = 40; //amount of dotted lines (spaces included)
    let lineH = height / lineAmount; //height in pixels of every line
    stroke(this.r, this.g, this.b);
    strokeWeight(minStrokeWidth);
    for (let i = 0; i < this.score; i++) {
      //used to wrap the lines vertically once at edge of canvas, will = 0 until this.score > 20
      let yOffset = floor(map(i, 0, 20, 0, 1));
      let y1 = ((lineH * i) * 2) + (lineH / 2) - (width * yOffset);
      let y2 = y1 + lineH;
      let xOffset = floor(map(i, 0, 20, 1, 2)); //as the score wraps vetically, offset it horiziontally aswell
      let xx = (width / 2) + (hPI * xOffset);
      line(xx, y1, xx, y2); //draws line
    }
  }

  flashOnScore() { //fills the screen with the paddle color that fades as this.scored is decremented.
    //this.score is set to 1 whenever the ball ball is scored in the opponents court.
    if (this.scored > 0) {
      background(this.r * this.scored, this.g * this.scored, this.b * this.scored);
      this.scored -= 0.02;
    }
  }
}
