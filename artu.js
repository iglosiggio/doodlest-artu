/* TODO: Eliminar puntos demasiado cercanos o repetidos */
/* TODO: Implementar saveToServer() */
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
	ctx.closePath();
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
			ctx.closePath();
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

function undo(){
	if(commands.length > 1)
		commands.pop();
	redraw();
}

document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && event.key === 'z')
		undo();
});

document.addEventListener('DOMContentLoaded', startu);
