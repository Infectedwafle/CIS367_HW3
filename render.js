/**
 * Starter code created by Hans Dulimarta.
 */

// Kevin Anderson

var gl;
var sizeInput, outMessage;
var posAttr, vertexBuff, prog;
var maze = [];
/* TODO: Add more variable declarations here */

function main() {
	let canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL (canvas, null);
	let button = document.getElementById("gen");
	sizeInput = document.getElementById("size");
	outMessage = document.getElementById("msg");
	button.addEventListener("click", buttonClicked);
	ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
	.then (program => {
		gl.useProgram(program);

		prog = program;

		render();
	});
}

function drawScene() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.viewport(0, 0, 512, 512);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.lineWidth(20);

	// create a buffer
	vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

	// copy the vertices data
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(maze), gl.STATIC_DRAW);

	// obtain a reference to the shader variable (on the GPU)
	posAttr = gl.getAttribLocation(prog, "vertexPos");
	gl.enableVertexAttribArray(posAttr);
	
	gl.vertexAttribPointer(posAttr,
		2,         /* number of components per attribute, in our case (x,y) */
		gl.FLOAT,  /* type of each attribute */
		false,     /* does not require normalization */
		0,         /* stride: number of bytes between the beginning of consecutive attributes */
		0);        /* the offset (in bytes) to the first component in the attribute array */
	gl.drawArrays(gl.LINES,
		0,  /* starting index in the array */
		maze.length / 2); /* we are drawing four vertices */
}

function render() {
	drawScene();
	requestAnimationFrame(render);
}

function buttonClicked() {
	let sz = sizeInput.valueAsNumber;
	if (!sz) {
		outMessage.innerHTML = "Must set size in the input box";
	} else {
		outMessage.innerHTML = "I have to generate a maze of size " + sz + "x" + sz;
		maze = setupMaze(sz);
	}
}

/* TODO: You may add more functions as needed */

function setupMaze(size) {
	let maze = {
		vertices: [],
		entry: [],
		exit: [],
		path: [],
	};
	for(let i = 0; i < size; i++) {
		for(let j = 0; j < size; j++) {
			maze.vertices.push(i, j);
			maze.vertices.push(i + 1, j);
			maze.vertices.push(i + 1, j);
			maze.vertices.push(i + 1, j + 1);
			maze.vertices.push(i + 1, j + 1);
			maze.vertices.push(i, j + 1);
			maze.vertices.push(i, j + 1);
			maze.vertices.push(i, j);
		}
	}

	// find enterance and exit
	let entryPoint = getEndPoint(size);
	let entrySide = getEndPointOrientation();

	// 0 is a horizontal and 1 is vertical
	switch(entrySide) {
		case 0:
			maze.vertices.push(entryPoint);
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
	}

	let exitPoint = getEndPoint(size);
	let exitSide = getEndPointOrientation();

	if(exitSide) {
		maze.vertices.splice((exitPoint * 16) -2, 4);
	} else {
		maze.vertices.splice((exitPoint * (size) * 16), 4);
	}

	console.log(entryPoint, entrySide, exitPoint, exitSide, maze.length);
	return convertToVertices(maze, size);
}

function convertToVertices(maze, size) {
	let vertexMaze = [];
	let canvasSize = 256;

	for(let i = 0; i < maze.vertices.length; i++) {
		vertexMaze.push(((maze.vertices[i] * ((canvasSize * 2) / size)) - canvasSize) / canvasSize);
	}

	return vertexMaze;
}

function getEndPoint(size) {
	return getRandomInt(0, size - 1);
}

// 0 is a horizontal and 1 is vertical
function getEndPointOrientation() {
	return getRandomInt(0, 4);
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}