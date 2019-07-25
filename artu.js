var lastMouseX = undefined;
var lastMouseY = undefined;
var wasReleased = true;
var defaultBackgroundColor = "#ffcd75";
var lineColor = "#1a1c2c";
var strokeSize = 10;
var steps = [];
var minDrawDistance = 5;
var pg;
var scale = 1;
var mouseWasPressedInside = false;
var isMobile = false;
var tiempoInicio = new Date();
var timeoutMax = 60*10;
var segundosrestantes;
var puedeSubmitear = true;

function setup() {
    var divW = document.getElementById("canvas").offsetWidth;
    scale = divW / 500;
    var divH = Math.round(440 * scale);
    var canvas = createCanvas(divW, divH);
    canvas.parent('canvas');
    createPg();
    mouseX = -10;
    mouseY = -10;
    var dc = document.querySelector("#defaultCanvas0");
    dc.addEventListener("touchmove", function(e){
        e.preventDefault();
        return;
    });
}

function draw(){
    //Draw picture
    drawCanvas();

    // Draw cursor
    if(!isMobile){
        strokeWeight(strokeSize * scale);
        stroke(0, 128);
        point(mouseX, mouseY);
    }

    // Draw
    if(mouseIsPressed && mouseWasPressedInside && mouseInside()){
        if(wasReleased){
            wasReleased = false;
        }else{
            pg.stroke(lineColor);
            pg.strokeWeight(strokeSize * scale);
            pg.line(lastMouseX, lastMouseY, mouseX, mouseY);
        }
    }

    // Store mouse position
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

function mouseInside(){
    return (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height);
}

function mousePressed(){
    if(mouseInside()){
        saveStep();
        mouseWasPressedInside = true;
    }else{
        mouseWasPressedInside = false;
    }
}

function mouseReleased(){
    wasReleased = true;
}

function drawCanvas(){
    image(pg, 0, 0);
}

function saveStep(){
    var step = createGraphics(pg.width, pg.height);
    step.image(pg, 0, 0);
    steps.push(step);
}

function fillBack(){
    saveStep();
    pg.background(lineColor);
}

function clearCanvas(){
    saveStep();
    createPg();
}

function setColor(color){
    lineColor = color;
}

function setWidth(i){
    strokeSize = i;
}

function createPg(){
    pg = createGraphics(width, height);
    pg.background(defaultBackgroundColor);
}

function undo(){
    if(steps.length > 0)
        pg = steps.pop();
    else{
        createPg();
    }
}

function touchStarted() {
    isMobile = true;
    mousePressed();
}

window.onbeforeunload = function() {
    return "Do you really want to leave? You may lose unsaved changes!";
};

function saveToServer(){
    if (segundosrestantes > timeoutMax - (60 * 1.5)){
        alert("Hey! You drew a little too fast! Try to spend a little more time on your drawing!");
        return;
    }

    if(!puedeSubmitear) return;
    puedeSubmitear = false;

    window.onbeforeunload = null;

    //las imagenes se tienen que guardar en 300x264
    //Creo un canvas nuevo para resizear el output
    var originalCanvas = document.getElementById("defaultCanvas0");
    // Create canvas for resizing
    var resizeCanvas = document.createElement("canvas");
    resizeCanvas.height = 264;
    resizeCanvas.width = 300;
    var resizeCtx = resizeCanvas.getContext('2d');
    // Put original canvas contents to the resizing canvas
    resizeCtx.drawImage(originalCanvas, 0, 0, 300, 264);

    //Guardo el output
    var dataURL = resizeCanvas.toDataURL();
    var imagefield = document.getElementById('image');
    // TODO agregar coso
    imagefield.value = dataURL;
    document.getElementById("imageform").submit(); 
}

var cuentaabajo = setInterval(function(){
    var timeNow = new Date();
    segundosrestantes = timeoutMax - ((timeNow - tiempoInicio) / 1000);
    var timeLeftText = document.getElementById('timeleft');
    if(segundosrestantes < timeoutMax / 2) $("#timeleft").addClass('text-warning').removeClass('text-muted');
    if(segundosrestantes < 60) $("#timeleft").addClass('text-danger').removeClass('text-warning');
    var minutes = Math.floor(segundosrestantes / 60);
    var seconds = Math.floor(segundosrestantes % 60);
    var tiempo = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    if(segundosrestantes >= 0){
        timeLeftText.innerHTML = "Time left: " + tiempo;
        document.title= "(" + tiempo + ") Draw! - Doodlest";
    }
    if(segundosrestantes <= 0) saveToServer();
}, 1000);

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z') {
    undo();
  }
});
