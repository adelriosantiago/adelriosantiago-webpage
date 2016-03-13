var distances = [];
var maxDistance;
var spacer;

function setup() {
    var myCanvas = createCanvas(600, 400);
    myCanvas.parent('p5-container');

    maxDistance = dist(width / 2, height / 2, width, height);
    for (var x = 0; x < width; x++) {
        distances[x] = []; //Create nested array
        for (var y = 0; y < height; y++) {
            var distance = dist(width / 2, height / 2, x, y);
            distances[x][y] = distance / maxDistance * 255;
        }
    }
    spacer = 30;
    strokeWeight(15);
}

function draw() {
    /*if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    ellipse(mouseX, mouseY, 5, 5);*/

    for (var x = 0; x < width; x += spacer) {
        for (var y = 0; y < height; y += spacer) {
            var distance = dist(mouseX, mouseY, x, y);
            distances[x][y] = distance / maxDistance * 255;
            stroke(distances[x][y]);
            point(x + spacer / 2, y + spacer / 2);
        }
    }
}