// Demonstration of multiple force acting on
// bodies (Mover class)
// Bodies experience gravity continuously
// Bodies experience fluid resistance when in "water"

// Five moving bodies
var movers = [];

// Liquid
var liquid;

//Sound
var osc;

function setup() {
    var myCanvasX = createCanvas(800, 400);
    myCanvasX.parent('p5-bounce');

    osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(240);
    osc.amp(0.5, 0.05);

    reset();
}

function draw() {
  background(127);

  for (var i = 0; i < movers.length; i++) {
    // Gravity is scaled by mass here!
    var gravity = createVector(0, 0.1*movers[i].mass);
    // Apply gravity
    movers[i].applyForce(gravity);

    // Update and display
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
  }
}

function mousePressed() {
  reset();
}

// Restart all the Mover objects randomly
function reset() {
  for (var i = 0; i < 9; i++) {
    movers[i] = new Mover(1, 40+i*70, 150 + random(10, 100));
  }
}

function Mover(m,x,y) {
  this.mass = m;
  this.position = createVector(x,y);
  this.velocity = createVector(0,0);
  this.acceleration = createVector(0,0);
}

// Newton's 2nd law: F = M * A
// or A = F / M
Mover.prototype.applyForce = function(force) {
  var f = p5.Vector.div(force, this.mass);
  this.acceleration.add(f);
};

Mover.prototype.update = function() {
  // Velocity changes according to acceleration
  this.velocity.add(this.acceleration);
  // position changes by velocity
  this.position.add(this.velocity);
  // We must clear acceleration each frame
  this.acceleration.mult(0);
};

Mover.prototype.display = function() {
  stroke(0);
  strokeWeight(2);
  fill(255,127);
  ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16);
};

// Bounce off bottom of window
Mover.prototype.checkEdges = function () {
    if (this.position.y > (height - this.mass * 8)) {
        // A little dampening when hitting the bottom
        this.position.y = (height - this.mass * 8) - 1;
        this.velocity.y *= -1; //-1.005 and -1.006
        osc.freq(240 * this.mass);
        osc.start();
        osc.stop(0.25);
    }
};
