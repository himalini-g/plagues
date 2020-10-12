let torsos = [];
let heads = [];
let leftLegs = [];
let rightLegs = [];
let rightArms = [];
let leftArms = [];
let hail = [];
let frogLeft = [];
let frogRight = [];
let hailParticles = [];
let frogParticles = [];
let showSkel = true;
let TOP = 0.9;
let BOTTOM = 0.3;
let backgroundColor;
let humans = [];
let numHumans = 10;
let plagueStart = -1;
let plagueDuration = 10.0;
let plagueReset = false;
let curPlague = [];
let curPlagueStr = '';
function preload(){
  
  torsos.push(loadImage('assets/body1_c1.png'));
  torsos.push(loadImage('assets/body3_c1.png'));
  torsos.push(loadImage('assets/body4_c1.png'));
  torsos.push(loadImage('assets/bodiesclothing1_c1.png'));
  torsos.push(loadImage('assets/bodiesclothing2_c1.png'));
  torsos.push(loadImage('assets/bodiesclothing3_c1.png'));
  torsos.push(loadImage('assets/bodiesclothing4_c1.png'));
  heads.push(loadImage('assets/head1_c1.png'));
  heads.push(loadImage('assets/head2_c1.png'));
  heads.push(loadImage('assets/head3_c1.png'));
  leftLegs.push(loadImage('assets/leftleg1_c1.png'));
  leftLegs.push(loadImage('assets/leftleg2_c1.png'));
  leftLegs.push(loadImage('assets/leftleg3_c1.png'));
  rightLegs.push(loadImage('assets/rightleg1_c1.png'));
  rightLegs.push(loadImage('assets/rightleg2_c1.png'));
  rightLegs.push(loadImage('assets/rightleg3_c1.png'));
  leftArms.push(loadImage('assets/leftarm1_c1.png'));
  leftArms.push(loadImage('assets/leftarm2_c1.png'));
  rightArms.push(loadImage('assets/rightarm1_c1.png'));
  rightArms.push(loadImage('assets/rightarm2_c1.png'));
  hail.push(loadImage('assets/hail1.png'));
  hail.push(loadImage('assets/hail2.png'));
  hail.push(loadImage('assets/hail3.png'));
  frogLeft.push(loadImage('assets/frog_still_left.png'));
  frogLeft.push(loadImage('assets/frog_jump_left.png'));
  frogRight.push(loadImage('assets/frog_still_right.png'));
  frogRight.push(loadImage('assets/frog_jump_right.png'));

  

}
  


function setup() {
  createCanvas(19 * 50,  9 * 50);

  for(var i = 0; i < numHumans; i++){
    var h = new Human();
    var x = random() * width;
    var y = random(BOTTOM, TOP) * height;
    var bWidth = width / 20;
    var bHeight = bWidth
    h.set(bWidth, bHeight, x, y, str(i));
  
    humans.push(h);
    
  }
  humans.sort((a, b) => (a.y > b.y) ? 1 : -1);
  for(var i = 0; i < 100; i++){
    hailParticles[i] = new Particle();
    hailParticles[i].hailSet();
    frogParticles[i] = new Particle();
    frogParticles[i].frogSet();
  }

  backgroundColor = color(227, 184, 132);
  for(var i = 0; i < hail.length; i ++){
    var scale = max(15 / hail[i].width, 15/ hail[i].height);
    hail[i] = hail[i].resize(hail[i].width * scale, hail[i].height * scale)
   
  }
  for(var i = 0; i < frogLeft.length; i ++){
    var scale = max(40 / frogLeft[i].width, 40/ frogLeft[i].height);
    frogLeft[i] = frogLeft[i].resize(frogLeft[i].width * scale, frogLeft[i].height * scale)
   
  }
  for(var i = 0; i < frogRight.length; i ++){
    var scale = max(40 / frogRight[i].width, 40/ frogRight[i].height);
    frogRight[i] = frogRight[i].resize(frogRight[i].width * scale, frogRight[i].height * scale)
   
  }
}
function mousePressed() {
  for(var i = 0; i < humans.length; i++){
    humans[i].mouseUpdate();
  }

  
}

function keyPressed() {
  
  if (keyCode == DOWN_ARROW) {
    showSkel = !showSkel;
  }

  if(keyCode == LEFT_ARROW){
    plagueStart = minute()* 60 + second();
    curPlague = frogParticles;
    var plague = random(0, 1);
    if(plague < 0.5){
      curPlague = frogParticles;
      curPlagueStr = 'frog';
      
    }
    if(plague > 0.5){
      curPlague = hailParticles;
      curPlagueStr = 'hail';
    }


  }
}
 function collision(){
  var delta = 10000;
  for (var i = 0; i < curPlague.length; i++) {
    for(var j = 0; j < humans.length; j ++){
      for(var k = 0; k < humans[j].myParticles.length; k ++){
        if(humans[j].active){
          var dist= sq((pow(curPlague[i].px - humans[j].myParticles[k].px, 2 )+ pow(curPlague[i].py - humans[j].myParticles[k].py, 2 )));
          if(dist < delta ){
            humans[j].myParticles[k].addForce(random(-10, 10), curPlague[i].vy);
            humans[j].collisionCounter += 1;
            if(humans[j].collisionCounter > humans[j].collisionLimit && humans[j].deathTime == -1 ){
              humans[j].deathTime = (minute() * 60) + second();
              
            }
          }
        }
      }
    }
 
  }

 }
 
function draw() {
  background(backgroundColor);
  var curTime =  minute() * 60 + second();
  if(plagueStart != -1){
    plagueReset = true;
   
    for (var i = 0; i < curPlague.length; i++) {
      curPlague[i].addForce(0, 0.6); // gravity!
      if(plagueStart + plagueDuration >= curTime || (plagueStart + plagueDuration <curTime && !curPlague[i].reset) ){
        curPlague[i].update();
        plagueReset = false;
      }
      if(curPlagueStr == 'frog'){
        curPlague[i].frogRender();
      }
      if(curPlagueStr =='hail'){
        curPlague[i].hailRender();

      }
    }
    if(plagueReset && plagueStart + plagueDuration < curTime ){
      plagueStart = -1;
      curPlague = [];
    }
  }
 
  
  
  
  

  for(var i = 0; i < humans.length; i++){
    humans[i].render();
    humans[i].updater();
  }
  for(var i = humans.length - 1 ; i >= 0; i--){
    if(humans[i].dead){
      humans.splice(i, 1);
    }
  }
  if(humans.length < numHumans){
    while(humans.length < numHumans){
      var h = new Human();
      var x = random() * width;
      var y = random(BOTTOM, TOP) * height;
      var bWidth = width / 20;
      var bHeight = bWidth
      h.set(bWidth, bHeight, x, y, str(i));
    
      humans.push(h);
    }
    humans.sort((a, b) => (a.y > b.y) ? 1 : -1);
  }

  
  collision();
 
 
 
 
}

var Human = function Human() {
  this.shadowArray = [];
  this.dead = false;
  this.stopRender = false;
  this.deathTime = -1;
  this.deathDuration = 2;
  this.collisionCounter = 0;
  this.collisionLimit = 0;
  this.alpha = 255;
  this.z = -1;
  this.myParticles = [];
  this.mySprings = [];
  this.bWidth = width / 15;
  this.bHeight = height / 15;
  this.x = width / 2;
  this.y = height / 2;
  this.floor = height;
  this.whichParticleIsGrabbed = -1;
  this.torsoImage = -1;
  this.tScale = -1;
  this.leftArmImage = -1;
  this.laScale = -1;
  this.rightArmImage = -1;
  this.raScale = -1;
  this.headImage = -1;
  this.hScale = -1;
  this.leftLegImage = -1;
  this.llScale = -1;
  this.rightLegImage = -1;
  this.rlScale = -1;
  this.clothingImage = -1;
  this.cScale = -1;
  this.armLength = -1;
  this.name = ''
  this.active = false;
  this.set = function(bWidth, bHeight, x , y, name='') {
    this.collisionLimit = int(random(0, 100));
    this.z = y / height;
    this.bWidth = bWidth;
    this.bHeight = bHeight;
    this.x = x;
    this.y = y;
    this.name = name;
    
    this.createParticles();
    this.createSpringMeshConnectingParticles(); 
    this.assignImages();
    
    
  };
  this.sizeIm = function(im, w, h, f=1.0){
    var scale = max(w / im.width, h / im.height);
    return scale * f;    
  };
  this.assignImages = function(){
    this.torsoImage = random(torsos);
    this.tScale = this.sizeIm(this.torsoImage, this.bWidth, this.bHeight);
    this.headImage = random(heads);
    this.hScale = this.sizeIm(this.headImage, this.bWidth * 0.8, 0);

    
    var legIndex = int(random(0, leftLegs.length));
    var armIndex = int(random(0, rightArms.length));
    
    
  
    this.leftArmImage = leftArms[armIndex];
    this.laScale = this.sizeIm(this.leftArmImage, this.armLength, 0, 0.7);
    this.rightArmImage = rightArms[armIndex];
    this.raScale = this.sizeIm(this.rightArmImage, this.armLength, 0, 0.7);
    this.leftLegImage = leftLegs[legIndex];
    this.llScale = this.sizeIm(this.leftLegImage, this.bHeight, 0, 0.9);
    this.rightLegImage = rightLegs[legIndex];
    this.rlScale = this.sizeIm(this.rightLegImage,this.bHeight, 0, 0.9);
    
  };
  this.createParticles = function() {
    var particle0 = new Particle(); 
    var particle1 = new Particle(); 
    var particle2 = new Particle(); 
    var particle3 = new Particle();
    var particle4 = new Particle();
    var particle5 = new Particle();
    var particle6 = new Particle();
    var particle7 = new Particle();
    var particle8 = new Particle();
    var particle9 = new Particle();
    var particle10 = new Particle();

    var bodyWidth = this.bWidth;
    var bodyHeight = this.bHeight;
   
   
    var x = this.x;
    var y = this.y;
    this.floor = y;
    var offset =  bodyHeight * 2 + height;
    particle0.set(x,y - offset, '0', this.floor);
    particle1.set(x + bodyWidth,y - offset, '1',  this.floor);
    particle2.set(x, y + bodyHeight - offset, '2',  this.floor);
    particle3.set(x + bodyWidth,y + bodyHeight - offset, '3',  this.floor);
    particle4.set(x + bodyWidth / 2, (y -bodyHeight / 2) - offset, '4',  this.floor);
    particle5.set(x - bodyWidth / 4, (y + bodyHeight * 2) - offset, '5', this.floor);
    particle6.set(x + bodyWidth * 1.25, (y + bodyHeight * 2) - offset, '6', this.floor);
    particle7.set(x - bodyWidth / 4, y + bodyHeight - offset, '7',  this.floor);
    particle8.set(x + bodyWidth *1.25, y + bodyHeight - offset, '8',  this.floor);
    particle9.set(x + bodyWidth / 3, (y + bodyHeight * 2) - offset, '9', this.floor);
    particle10.set(x + bodyWidth * 2 / 3, (y + bodyHeight * 2) - offset, '10', this.floor);
    
    this.armLength = sqrt(pow(particle0.px -  particle7.px,2) + pow(particle0.py -  particle7.py,2));
    this.myParticles.push(particle0);
    this.myParticles.push(particle1);
    this.myParticles.push(particle2);
    this.myParticles.push(particle3);
    this.myParticles.push(particle4);
    this.myParticles.push(particle5);
    this.myParticles.push(particle6);
    this.myParticles.push(particle7);
    this.myParticles.push(particle8);
    this.myParticles.push(particle9);
    this.myParticles.push(particle10);
  };
  this.createSpringMeshConnectingParticles = function(){
    // The spring constant. 
    var K = 0.1; 

    // Stitch the particles together by springs.
    var p0 = this.myParticles[0];
    var p1 = this.myParticles[1];
    var p2 = this.myParticles[2];
    var p3 = this.myParticles[3]; 
    var p4 = this.myParticles[4];
    var p5 = this.myParticles[5];
    var p6 = this.myParticles[6];
    var p7 = this.myParticles[7];
    var p8 = this.myParticles[8];
    var p9 = this.myParticles[9];
    var p10 = this.myParticles[10];

    var aSpring0 = new Spring(); 
    aSpring0.set (p0, p1, K);
    this.mySprings.push(aSpring0);

    var aSpring1 = new Spring(); 
    aSpring1.set (p1, p2, K);
    this.mySprings.push(aSpring1);

    var aSpring2 = new Spring(); 
    aSpring2.set (p0, p2, K);
    this.mySprings.push(aSpring2);

    var aSpring3 = new Spring();
    aSpring3.set(p3, p0, K);
    this.mySprings.push(aSpring3);

    var aSpring4 = new Spring();
    aSpring4.set(p3, p1, K);
    this.mySprings.push(aSpring4);

    var aSpring5 = new Spring();
    aSpring5.set(p2, p3, K);
    this.mySprings.push(aSpring5);

    var aSpring6 = new Spring();
    aSpring6.set(p1, p4, K);
    this.mySprings.push(aSpring6);

    var aSpring7 = new Spring();
    aSpring7.set(p0, p4, K);
    this.mySprings.push(aSpring7);

    var aSpring8 = new Spring();
    aSpring8.set(p2, p5, K);
    this.mySprings.push(aSpring8);

    var aSpring9 = new Spring();
    aSpring9.set(p5, p3, K);
    this.mySprings.push(aSpring9);

    var aSpring10 = new Spring();
    aSpring10.set(p2, p6, K);
    this.mySprings.push(aSpring10);

    var aSpring11 = new Spring();
    aSpring11.set(p6, p3, K);
    this.mySprings.push(aSpring11);

    var aSpring12 = new Spring();
    aSpring12.set(p4, p3, K);
    this.mySprings.push(aSpring12);

    var aSpring13 = new Spring();
    aSpring13.set(p4, p2, K);
    this.mySprings.push(aSpring13);

    var aSpring14 = new Spring();
    aSpring14.set(p0, p7, K);
    this.mySprings.push(aSpring14);

    var aSpring15 = new Spring();
    aSpring15.set(p1, p8, K);
    this.mySprings.push(aSpring15);

    var aSpring16 = new Spring();
    aSpring16.set(p7, p2, K);
    this.mySprings.push(aSpring16);

    var aSpring17 = new Spring();
    aSpring17.set(p8, p3, K);
    this.mySprings.push(aSpring17);
    
    var aSpring18 = new Spring();
    aSpring18.set(p9, p5, K);
    this.mySprings.push(aSpring18);

    var aSpring19 = new Spring();
    aSpring19.set(p10, p6, K);
    this.mySprings.push(aSpring19);

    var aSpring20 = new Spring();
    aSpring20.set(p9, p3, K);
    this.mySprings.push(aSpring20);

    var aSpring21 = new Spring();
    aSpring21.set(p10, p2, K);
    this.mySprings.push(aSpring21);

    var aSpring22 = new Spring();
    aSpring22.set(p9, p1, K);
    this.mySprings.push(aSpring22);

    var aSpring23 = new Spring();
    aSpring23.set(p10, p0, K);
    this.mySprings.push(aSpring23);

    var aSpring24 = new Spring();
    aSpring24.set(p5, p1, K);
    this.mySprings.push(aSpring24);

    var aSpring25 = new Spring();
    aSpring25.set(p6, p0, K);
    this.mySprings.push(aSpring25);

    var aSpring26 = new Spring();
    aSpring26.set(p9, p10, K);
    this.mySprings.push(aSpring26);

  };
  this.placeBodyImage = function(im, p, q,s, offset=0,isLimb=false){
    var tx = (p.px +  q.px) / 2;
    var ty = (p.py +  q.py) / 2;
    var dy = p.py - q.py;
    var dx = p.px - q.px;
    var tAngle = offset + atan2(dy, dx);
    var shadowCol = color(169, 137, 98);
    push();
 
    ellipseMode(CENTER);
    fill(shadowCol);
    this.shadowArray.push(tx);
    this.shadowArray.push(im.width* s);
    // ellipse(tx, this.floor, im.width* s, 15);
    pop();
      
    push();

    translate(tx, ty);
    rotate(tAngle);
    imageMode(CENTER);
    
 
    image(im, 0, 0, im.width * s, im.height * s);
  
    
    pop();

   
   
    
  };
  
  this.mouseUpdate = function(){
  // If the mouse is pressed, 
  // find the closest particle, and store its index.
    this.whichParticleIsGrabbed = -1;
    var maxDist = 10;
    for (var i=0; i<this.myParticles.length; i++) {
      var dx = mouseX - this.myParticles[i].px;
      var dy = mouseY - this.myParticles[i].py;
      var dh = sqrt(dx*dx + dy*dy);
      if (dh < maxDist) {
        maxDist = dh;
        this.whichParticleIsGrabbed = i;
      }
    }
    
  };
  this.render = function(){
    // this.shadowXL = 99999;
    // this.shadowXR = -1;
    // this.shadowY = this.floor;
    for (var i=0; i<this.shadowArray.length - 1; i+=2) {
      var tx = this.shadowArray[i];
      var imW = this.shadowArray[i + 1];
      push();
      var shadowCol = color(169, 137, 98);
      ellipseMode(CENTER);
      fill(shadowCol);
      
      ellipse(tx, this.floor, imW, 15);
      pop();
    }
    this.shadowArray = [];

    for (var i=0; i<this.myParticles.length; i++) {
      this.myParticles[i].addForce(0, 0.15); // gravity!
      this.myParticles[i].update(); // update all locations
      if(this.myParticles[i].px < this.shadowXL){
        this.shadowXL = this.myParticles[i].px;
      }
      if(this.myParticles[i].px > this.shadowXR){
        this.shadowXR = this.myParticles[i].px;
      }
    }
    if (mouseIsPressed && (this.whichParticleIsGrabbed > -1)) {
      // If the user is grabbing a particle, peg it to the mouse.
      this.myParticles[this.whichParticleIsGrabbed].px = mouseX;
      this.myParticles[this.whichParticleIsGrabbed].py = mouseY;
    }
    if(this.myParticles[5].py >= this.myParticles[5].floor ){
      this.active = true;
    }
    
    // push();
    // ellipseMode(CENTER);
    // fill(0, 0, 0, 100);
    
    // ellipse((this.shadowXR + this.shadowXL) / 2, this.shadowY + 5, this.shadowXR - this.shadowXL, 10);
    // pop();

    for (var i=0; i<this.mySprings.length; i++) {
      this.mySprings[i].update(); // update all springs
    }
    this.placeBodyImage(this.rightArmImage, this.myParticles[1], this.myParticles[8],this.raScale, PI / 2);
    this.placeBodyImage(this.leftArmImage, this.myParticles[0], this.myParticles[7], this.laScale, PI / 2);
    this.placeBodyImage(this.leftLegImage,this.myParticles[2], this.myParticles[5], this.llScale,  PI / 2);
    this.placeBodyImage(this.rightLegImage,this.myParticles[3], this.myParticles[6],this.rlScale, PI / 2);
    this.placeBodyImage(this.torsoImage, this.myParticles[0],this.myParticles[3],this.tScale, PI  * 3/ 4);
   
    this.placeBodyImage(this.headImage, this.myParticles[4],  this.myParticles[4],this.hScale,);
    if(showSkel){
      for (var i=0; i<this.mySprings.length; i++) {
        this.mySprings[i].render(); // render all springs
      }

      for (var i=0; i<this.myParticles.length; i++) {
        this.myParticles[i].render(); // render all particles
      }
      text(this.name, this.myParticles[4].px, this.myParticles[4].py - 20);
      text(this.collisionCounter, this.myParticles[4].px, this.myParticles[4].py - 40);
      text(this.dead, this.myParticles[4].px, this.myParticles[4].py - 60);
    }
    fill(0); 
    noStroke();
  };

  this.updater = function(){
    var curTime = (minute() * 60 ) + second();

    
    if(this.deathTime != -1 && this.deathTime + this.deathDuration < curTime){
      this.mySprings = []; 
    }
    // if(this.deathTime != -1 && this.deathTime + 2*this.deathDuration < curTime){
    //   this.stopRender = true;
    // }
    if(this.deathTime != -1 && this.deathTime + 4*this.deathDuration < curTime){
      this.dead = true;
      
    }
  }

}



//==========================================================
var Particle = function Particle() {
  this.px = 0;
  this.py = 0;
  this.vx = 0;
  this.vy = 0;
  this.mass = 1.1;
  this.damping = random(0.9, 0.98);
  this.name = ''
  this.bFixed = false;
  this.bLimitVelocities = true;
  this.bPeriodicBoundaries = false;
  this.bHardBoundaries = true;
  this.floor = height;
  this.hailImage = -1;
  this.frogStillImage = -1;
  this.frogJumpImage = -1;
  this.scale = -1;
  this.hailParticle = false;
  this.frogParticle = false;
  this.rv = 0;
  this.starty = 0;
  this.reset = true;
  
  
  // Initializer for the Particle
  this.set = function(x, y, name = '', floor = height) {
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.damping = 0.98;
    this.mass = 1;
    this.name = name;
    this.floor = floor;
    this.rv = 0;

  };
  this.hailSet = function( floor = height) {
    this.px = random(0.1, 0.9)* width;
    this.py = random(-20, -3000);
    this.starty =this.py; 
    this.vx = 0;
    this.vy = 15;
    
    this.mass = random(0.8, 1.1);
    this.floor = random(0.4, 0.8)* height;
    this.hailImage = random(hail);
    this.scale = max(15/ this.hailImage.width, 15/ this.hailImage.height);
    this.blimitVelocities = false;
    this.hailParticle = true;
    this.damping = 0.92;
    this.angle = 0;
    this.rv = random(0.1, 0.9) * PI;

    
  };
  this.frogSet = function(floor = height){
 
    this.px = random(0.1, 0.9)* width;
    this.py = random(-20, -3000);
    this.starty =this.py; 
    this.vx = 0;
    this.vy = 15;
    
    this.mass = random(0.8, 1.1);
    this.floor = random(0.4, 0.8)* height;
    var frogList = [frogLeft, frogRight];
    var frog = random([0, 1]);
    this.frogStillImage = frogList[frog][0];
    this.frogJumpImage = frogList[frog][0];
    this.dir = frog;
    if(this.dir == 0){
      this.dir = -1;
    }

    this.scale = max(15/ this.hailImage.width, 15/ this.hailImage.height);
    this.blimitVelocities = false;
    this.hailParticle = true;
    this.damping = 0.92;
    this.angle = 0;
    this.rv = random(0.1, 0.1) * PI;
    this.frogParticle = true;

  }

  // Add a force in. One step of Euler integration.
  this.addForce = function(fx, fy) {
    var ax = fx / this.mass;
    var ay = fy / this.mass;
    this.vx += ax;
    this.vy += ay;
  };

  // Update the position. Another step of Euler integration.
  this.update = function() {
    this.reset = false;
    if (this.bFixed === false){
      this.vx *= this.damping;
      this.vy *= this.damping;
  
      this.limitVelocities();
      this.handleBoundaries();
      this.px += this.vx;
      this.py += this.vy;
      this.angle += this.rv;
    }
    
  };

  this.limitVelocities = function() {
    if (this.bLimitVelocities) {
      var speed = sqrt(this.vx * this.vx + this.vy * this.vy);
      var maxSpeed = 10;
      if (speed > maxSpeed) {
        this.vx *= maxSpeed / speed;
        this.vy *= maxSpeed / speed;
      }
    }
  };

  this.handleBoundaries = function() {
    if (this.bPeriodicBoundaries) {
      if (this.px > width) this.px -= width;
      if (this.px < 0) this.px += width;
      if (this.py > height) this.py -= height;
      if (this.py < 0) this.py += height;
    } else if (this.bHardBoundaries) {
      if (this.px >= width){
        this.vx = abs(this.vx)*-1;
      }
      if (this.px <= 0){
        this.vx = abs(this.vx);
      }
      if (this.py >= this.floor){
        this.vy = abs(this.vy)*-1;
      }
      if (!this.hailParticle && this.py <= 0){
        this.vy = abs(this.vy);
      }
      if(this.hailParticle && this.py >= this.floor && this.vx == 0){

        this.addForce(random(-4, 4), 0);
      }
      if(this.hailParticle && this.py >= this.floor && abs(this.vy) < 4){
        this.px = random(0.05, 0.95) * width;
        this.py = random(-50, -500);
        this.starty = this.py;
        this.vx = -this.vx;
        this.reset = true;
      }
    }
  };

  this.render = function() {
    fill(0);
    ellipse(this.px, this.py, 9, 9);
    text(this.name, this.px + 4, this.py + 4);
  };
  this.hailRender = function(){
   
    push();
    ellipseMode(CENTER);
    var alpha = map(this.py, 0, this.floor, 0, 100);
     
    fill(0, 0, 0,alpha);
    translate(this.px, this.floor);
    // ellipse(this.px, this.py, 10, 15);

    ellipse(0 ,5, 20, 10);
    pop();
    push();
    
    ellipseMode(CENTER);
    fill(0, 0, 0, 255);
    imageMode(CENTER);
    translate(this.px, this.py);
    rotate(this.angle);
    image(this.hailImage, 0, 0);
    pop();

  };
  this.frogRender = function(){
    push();
    ellipseMode(CENTER);
    var alpha = map(this.py, 0, this.floor, 0, 100);
     
    fill(0, 0, 0,alpha);
    translate(this.px, this.floor);
    // ellipse(this.px, this.py, 10, 15);

    ellipse(0 ,5, 20, 10);
    pop();
    push();
    
    ellipseMode(CENTER);
    fill(0, 0, 0, 255);
    imageMode(CENTER);
    translate(this.px, this.py);
    rotate(this.angle);
    image(this.frogStillImage, 0, 0);
    pop();
    
  }
 
}


//==========================================================
var Spring = function Spring() {
  var p;
  var q;
  var restLength;
  var springConstant;

  this.set = function(p1, p2, k) {
    p = p1;
    q = p2;
    var dx = p.px - q.px;
    var dy = p.py - q.py;
    restLength = sqrt(dx * dx + dy * dy);
    springConstant = k;
  };

  this.update = function() {
    var dx = p.px - q.px;
    var dy = p.py - q.py;
    var dh = sqrt(dx * dx + dy * dy);

    if (dh > 1) {
      var distention = dh - restLength;
      var restorativeForce = springConstant * distention; // F = -kx
      var fx = (dx / dh) * restorativeForce;
      var fy = (dy / dh) * restorativeForce;
      p.addForce(-fx, -fy);
      q.addForce( fx,  fy);
    }
  };

  this.render = function() {
    stroke(0);
    line(p.px, p.py, q.px, q.py);
  };
}