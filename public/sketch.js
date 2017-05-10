var socket;
var canvasHeight = window.innerHeight;
var canvasWidth = window.innerWidth;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(51);

    socket = io.connect('http://localhost:3000');
    socket.on('mouse', newDrawing);
}

function newDrawing(data) {
    noStroke();
    fill(255, 0, 100);
    ellipse(data.x, data.y, 20, 20);
}

function touchStarted() {
    drawing();
    
}

function mousePressed() {
    drawing();
}

function touchMoved() {
    drawing();
}

function mouseDragged() {
    drawing();
}

function drawing() {
    var data = {
        x: mouseX,
        y: mouseY
    }
    socket.emit('mouse', data);
    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);
}