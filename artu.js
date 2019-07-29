/* artu.js - a small canvas drawing library
 * Authors: Martin J. Del Río, Ignacio E. Losiggio
 */

/* TODO: Eliminar puntos demasiado cercanos o repetidos */
let canvas;
let ctx;
let isDrawing;
let commands = [];

function startu() {
	canvas = document.getElementById('artu-canvas');
	ctx = canvas.getContext('2d');

	/* Default values */
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.strokeStyle = '#1A1C2C';
	ctx.lineWidth = 10;
	ctx.fillStyle = '#FFCD75';

	commands.push({type: 'fill', fillStyle: '#FFCD75'});
	redraw();

	/* TODO: Mover el código de los controles a un lugar mejor. */

	/* Mouse controls */
	canvas.addEventListener('mousedown', e => {
		let rect = canvas.getBoundingClientRect();
		startLine(e.clientX - rect.left, e.clientY - rect.top);
	});
	canvas.addEventListener('mouseup', endLine);
	document.addEventListener('mousemove', e => {
		if (isDrawing) {
			let rect = canvas.getBoundingClientRect();
			addSegment(e.clientX - rect.left, e.clientY - rect.top);
		}
	});

	/* Touch controls */
	canvas.addEventListener('touchstart', e => {
		e.preventDefault();
		let rect = canvas.getBoundingClientRect();
		/* TODO: ¿Soportar multitouch? */
		let touch = e.changedTouches[0]
		startLine(touch.clientX - rect.left, touch.clientY - rect.top);
	});
	canvas.addEventListener('touchmove', e => {
		if (isDrawing) {
			e.preventDefault();
			let rect = canvas.getBoundingClientRect();
			/* TODO: ¿Soportar multitouch? */
			let touch = e.changedTouches[0]
			addSegment(touch.clientX - rect.left, touch.clientY - rect.top);
		}
	});
	canvas.addEventListener('touchend', endLine);
	canvas.addEventListener('touchcancel', endLine);
}

function startLine(x, y) {
	isDrawing = true;

	commands.push({
		type: 'stroke',
		strokeStyle: ctx.strokeStyle,
		lineWidth: ctx.lineWidth,
		segments: [{x, y}]
	});

	addSegment(x, y);
}

function endLine() {
	isDrawing = false;
}

function addSegment(x, y) {
	const line = commands[commands.length - 1]
	const prev = line.segments[line.segments.length - 1];
	line.segments.push({x, y});

	ctx.beginPath();
	ctx.moveTo(prev.x, prev.y);
	ctx.lineTo(x, y);
	ctx.stroke();
}

function fill() {
	commands.push({type: 'fill', fillStyle: ctx.fillStyle});
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function redraw() {
	for (command of commands) {
		switch(command.type) {
		case 'fill':
			ctx.fillStyle = command.fillStyle;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			break;
		case 'stroke':
			ctx.strokeStyle = command.strokeStyle;
			ctx.lineWidth = command.lineWidth;
			ctx.beginPath();
			ctx.moveTo(command.segments[0].x, command.segments[1].y);
			for (point of command.segments.slice(1))
				ctx.lineTo(point.x, point.y);
			ctx.stroke();
			break;
		}
	}
}

function clearCanvas() {
	commands = [commands[0]];
	redraw();
}

function setColor(color) {
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
}

function setWidth(i) {
	ctx.lineWidth = i;
}

function undo() {
	ctx.save();
	if(commands.length > 1)
		commands.pop();
	redraw();
	ctx.restore();
}

document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && event.key === 'z')
		undo();
});

document.addEventListener('DOMContentLoaded', startu);

/* El código acá abajo es necesario para doodlest, pero no es parte de la
 * lógica propia de dibujado. */

let tiempoInicio = new Date();
let timeoutMax = 60 * 10;
let segundosrestantes;
let puedeSubmitear = true;

function saveToServer() {
	if (segundosrestantes > timeoutMax - (60 * 1.5)) {
		alert("Hey! You drew a little too fast! Try to spend a little more time on your drawing!");
		return;
	}

	if(!puedeSubmitear) return;
	puedeSubmitear = false;

	window.onbeforeunload = null;

	/* Como las imagenes se guardan internamente en 300x264 creo un canvas
	 * nuevo para resizear el output */
	const resizeCanvas = document.createElement("canvas");
	resizeCanvas.height = 264;
	resizeCanvas.width = 300;

	const resizeCtx = resizeCanvas.getContext('2d');
	resizeCtx.drawImage(canvas, 0, 0, 300, 264);

	const dataURL = resizeCanvas.toDataURL();
	const imagefield = document.getElementById('image');
	// TODO agregar coso
	imagefield.value = dataURL;
	document.getElementById("imageform").submit();
}

function cuentaRegresiva() {
	let timeNow = new Date();
	segundosrestantes = timeoutMax - ((timeNow - tiempoInicio) / 1000);
	let timeLeftText = document.getElementById('timeleft');

	if(segundosrestantes < timeoutMax / 2)
		$("#timeleft").addClass('text-warning').removeClass('text-muted');
	if(segundosrestantes < 60)
		$("#timeleft").addClass('text-danger').removeClass('text-warning');

	let minutes = Math.floor(segundosrestantes / 60);
	let seconds = Math.floor(segundosrestantes % 60);
	let tiempo = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

	if(segundosrestantes >= 0) {
		timeLeftText.innerHTML = "Time left: " + tiempo;
		document.title= "(" + tiempo + ") Draw! - Doodlest";
	}

	if(segundosrestantes <= 0)
		saveToServer();
}

window.onbeforeunload = function darLastima() {
	return "Do you really want to leave? You may lose unsaved changes!";
};

setInterval(cuentaRegresiva, 1000);
