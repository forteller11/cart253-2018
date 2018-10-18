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
    this.hit = 0; //set to 1 if the ball has been hit, continually decrements

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
    this.fillMeter = .5; //what % of the paddle will be filled on collision w/ball?
    this.strokeWeight = (minStrokeWidth + maxStrokeWidth) / 2;
  }
  displayfillMeter() {
    //fills in the paddle repsenting how close to the center of the screen the paddle is
    let w = this.width / 2;
    let h = this.height / 2;
    let x1 = -w + this.x;
    let x2 = w + this.x;
    let y1 = -h + this.y; //top of paddle
    let y2 = h + this.y; //bottom of paddle
    //map the 0-1 value of the fillMeter to the bottom and top of the paddle;
    let y1Dynamic = map(this.fillMeter, 0, 1, y2, y1);

    rectMode(CORNERS);
    noStroke();

    fill(0);
    rect(x1, y2, x2, y1);
    //when ball is hit draws fill with full color, fading to black quickly
    fill(this.r * this.hit, this.g * this.hit, this.b * this.hit);
    rect(x1, y2, x2, y1Dynamic);
  }

  displayPaddle() {
    let w = this.width / 2;
    let h = this.height / 2;
    let x1 = -w + this.x;
    let x2 = w + this.x;
    let y1 = -h + this.y;
    let y2 = h + this.y;
    stroke(255);
    stroke(this.r, this.g, this.b);
    //draw paddle with width and color, increase stroke weight as paddle is closer to center of screen
    if (this.r > 200) {
      this.strokeWeight = map(this.x, width, width / 2, minStrokeWidth, maxStrokeWidth);
    } else {
      this.strokeWeight = map(this.x, 0, width / 2, minStrokeWidth, maxStrokeWidth);
    }
    strokeWeight(this.strokeWeight);
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

    let w = (this.width / 2) + this.strokeWeight / 2;
    let h = (this.height / 2) + this.strokeWeight / 2;

    //constrain x positions based on if the paddle is left or right, constrains y pos identically
    if (this.r > 200) { //if right paddle
      this.x = constrain(this.x, (width / 2) + w + w, width - w);
      this.fillMeter = map(this.x, width / 2 + w + w, width - w, 1.3, 0);
      this.fillMeter = constrain(this.fillMeter, 0, 1);
    } else {
      this.x = constrain(this.x, w, (width / 2) - w - w);
      this.fillMeter = map(this.x, w, (width / 2) - w - w, 0, 1.3);
      this.fillMeter = constrain(this.fillMeter, 0, 1);
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

    //if ball is colliding with paddle...
    if ((xx < x + w + r) && (xx > x - w - r)) {
      if ((yy < y + h + r) && (yy > y - h - r)) {
        ball.hit = 1;
        this.hit = 1;
        ball.r = this.r;
        ball.g = this.g;
        ball.b = this.b;
        oscAmbienceFreq += 50;
        //save balls velocity for later calculations deaing with the effect of the ball on the paddle's velocity
        let ballVelXStore = ball.velX;
        let ballVelYStore = ball.velY;
        let thisVelXStore = this.velX;

        //deal with changes to the ball's x velocity....
        //make sure the ball is travelling towards the center of the screen (towards the oppponents court)
        if ((ball.velX > 0) && (ballVelXStore > thisVelXStore)) { //right paddle
          ball.velX *= -1;
        } else if ((ball.velX < 0) && (ballVelXStore < thisVelXStore)) { //left paddle
          ball.velX *= -1;
        }
        //increase xvelocity of ball based on xvel of paddle
        ball.velX += this.velX / 10;
        //increase/decrease xvel of ball depending on how close the paddle
        //is to the center of the screen (closer = faster xvel)
        let spdInc;
        if (this.r > 200) { //for the right paddle
          spdInc = map(this.x, width / 2, width, 1.5, 0.6);
        } else if (this.r < 200) { //for the left paddle
          spdInc = map(this.x, 0, width / 2, 0.6, 1.5);
        }
        print(spdInc);
        ball.velX = ball.velX * spdInc;
        //make sure that the ball is moving at least as fast as the paddle (or else ball wud go through paddle)
        if ((ball.velX > this.velX) && (ballVelXStore > thisVelXStore)) {
          ball.velX = this.velX;
        } else if ((ball.velX < this.velX) && (ballVelXStore< thisVelXStore)) {
          ball.velX = this.velX;
        }
        //deal with changes to the ball's y velocity....
        //change yvelocity of ball based on where the collision has occured
        //(collision w/center of the paddle = 0 ball.yvel
        //hits with the edges make the ball bounce away from the center
        ball.velY = (ball.y - this.y) / 20;
        ball.velY += this.velY / 4; //increase yvel of ball based on yvel of paddle

        //move the ball outside the paddle hitbox (right paddle)
        while ((ball.x < x + w + r) && (ball.x > x - w - r) &&
          (ball.y < y + h + r) && (ball.y > y - h - r)) {
          if (ballVelXStore > thisVelXStore) {
            ball.x--;
          } else if (ballVelXStore < thisVelXStore) {
            ball.x++;
          }
        }

        this.velX = ballVelXStore * 1.5; //make paddles bounce back on collsion based on the ball's xvelocity
        this.velY = ballVelYStore * 1.5; //make paddles bounce back on collsion based on the ball's yvelocity
      }
    }
  }

  displayScore() {
    //for everypoint each paddle draws a dotted line near the middle of the map in thier own color
    // once the dotted line reaches the edge of the canvas the dotted line is wrapped around the screen
    let hPI;
    if (this.r > 200) { //if right offset score by positive
      hPI = horzPaddleIndent;
    } else { //if left offset by negative
      hPI = -horzPaddleIndent;
    }

    let lineAmount = 40; //amount of dotted lines (spaces included)
    let lineH = height / lineAmount; //height in pixels of every line
    stroke(this.r, this.g, this.b);
    strokeWeight(minStrokeWidth);
    for (i = 0; i < this.score; i++) {
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

  decrHit() { //decrements this.hit var
    //this.hit is set to one on collison w/ball
    if (this.hit > 0) {
      this.hit -= 0.015;
    }
  }




}
