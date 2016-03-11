var osc;
var playing = false;

function setup() {
    var myCanvasX = createCanvas(600, 400);
    myCanvasX.parent('p5-soundball');

    backgroundColor = color(255, 0, 255);
    textAlign(CENTER);

    osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(240);
    osc.amp(0);
    osc.start();
}

function draw() {
    background(backgroundColor);
    text('click to play', width / 2, height / 2);

    textSize(32);
    text("word", 10, 30);
    fill(0, 102, 153);
    text("word", 10, 60);
    fill(50, 102, 153, 51);
    text("word", 10, 90);
}

function mouseClicked() {
    if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
        if (!playing) {
            // ramp amplitude to 0.5 over 0.1 seconds
            osc.amp(0.5, 0.05);
            playing = true;
            backgroundColor = color(0, 255, 255);
        } else {
            // ramp amplitude to 0 over 0.5 seconds
            osc.amp(0, 0.5);
            playing = false;
            backgroundColor = color(255, 0, 255);
        }
    }
}
