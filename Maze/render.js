/**
 * Starter code created by Hans Dulimarta.
 */

// Kevin Anderson

var gl;
var sizeInput, outMessage;
var posAttr, vertexBuff, prog;
var maze = {
	vertices: [],
	entry: [],
	exit: [],
	path: []
}

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
	
	drawMaze();
	drawEntry();
	drawExit();
}

function drawMaze() {
	// create a buffer
	vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

	// copy the vertices data
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(maze.vertices), gl.STATIC_DRAW);

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
		maze.vertices.length / 2); /* we are drawing four vertices */
}

function drawEntry() {
	// create a buffer
	vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

	// copy the vertices data
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(maze.entry), gl.STATIC_DRAW);

	// obtain a reference to the shader variable (on the GPU)
	posAttr = gl.getAttribLocation(prog, "vertexPos");
	gl.enableVertexAttribArray(posAttr);
	
	gl.vertexAttribPointer(posAttr,
		2,         /* number of components per attribute, in our case (x,y) */
		gl.FLOAT,  /* type of each attribute */
		false,     /* does not require normalization */
		0,         /* stride: number of bytes between the beginning of consecutive attributes */
		0);        /* the offset (in bytes) to the first component in the attribute array */
	gl.drawArrays(gl.LINE_STRIP,
		0,  /* starting index in the array */
		maze.entry.length / 2); /* we are drawing four vertices */
}

function drawExit() {
	// create a buffer
	vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

	// copy the vertices data
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(maze.exit), gl.STATIC_DRAW);

	// obtain a reference to the shader variable (on the GPU)
	posAttr = gl.getAttribLocation(prog, "vertexPos");
	gl.enableVertexAttribArray(posAttr);
	
	gl.vertexAttribPointer(posAttr,
		2,         /* number of components per attribute, in our case (x,y) */
		gl.FLOAT,  /* type of each attribute */
		false,     /* does not require normalization */
		0,         /* stride: number of bytes between the beginning of consecutive attributes */
		0);        /* the offset (in bytes) to the first component in the attribute array */
	gl.drawArrays(gl.LINE_STRIP,
		0,  /* starting index in the array */
		maze.exit.length / 2); /* we are drawing four vertices */
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
		path: []
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
			maze.entry.push(entryPoint, 0);
			maze.entry.push(entryPoint + 1, 0);
			maze.entry.push(entryPoint + .5, 1);
			maze.entry.push(entryPoint, 0);
			maze.entry.push(entryPoint, .5);
			break;
		case 1:
			maze.entry.push(entryPoint, size);
			maze.entry.push(entryPoint + 1, size);
			maze.entry.push(entryPoint + .5, size - 1);
			maze.entry.push(entryPoint, size);
			maze.entry.push(entryPoint, .5);
			break;
		case 2:
			maze.entry.push(0, entryPoint);
			maze.entry.push(0, entryPoint + 1);
			maze.entry.push(1, entryPoint + .5);
			maze.entry.push(0, entryPoint);
			maze.entry.push(.5, entryPoint);
			break;
		case 3:
			maze.entry.push(size, entryPoint);
			maze.entry.push(size, entryPoint + 1);
			maze.entry.push(size - 1, entryPoint + .5);
			maze.entry.push(size, entryPoint);
			maze.entry.push(.5, entryPoint);
			break;
	}

	let exitPoint = getEndPoint(size);
	let exitSide =  entrySide;

	while(exitSide === entrySide) {
		exitSide = getEndPointOrientation();
	}

	switch(exitSide) {
		case 0:
			maze.exit.push(exitPoint, 0);
			maze.exit.push(exitPoint + 1, 1);
			maze.exit.push(exitPoint + 1, 0);
			maze.exit.push(exitPoint, 1);
			maze.exit.push(exitPoint, 0);
			break;
		case 1:
			maze.exit.push(exitPoint, size);
			maze.exit.push(exitPoint + 1, size - 1);
			maze.exit.push(exitPoint + 1, size);
			maze.exit.push(exitPoint, size - 1);
			maze.exit.push(exitPoint, 0);
			break;
		case 2:
			maze.exit.push(0, exitPoint);
			maze.exit.push(1, exitPoint + 1);
			maze.exit.push(0, exitPoint + 1);
			maze.exit.push(1, exitPoint);
			maze.exit.push(0, exitPoint);
			break;
		case 3:
			maze.exit.push(size, exitPoint);
			maze.exit.push(size - 1, exitPoint + 1);
			maze.exit.push(size, exitPoint + 1);
			maze.exit.push(size - 1, exitPoint);
			maze.exit.push(0, exitPoint);
			break;
	}


	//create path through the maze
	

	console.log(entrySide, exitSide, exitPoint);
	return convertToVertices(maze, size);
}

function convertToVertices(maze, size) {
	let convertedMaze = {
		vertices: [],
		entry: [],
		exit: [],
		path: []
	};

	for(let i = 0; i < maze.vertices.length; i++) {
		convertedMaze.vertices.push(convertVertex(maze.vertices[i], size));
	}

	for(let i = 0; i < maze.entry.length; i++) {
		convertedMaze.entry.push(convertVertex(maze.entry[i], size));
	}

	for(let i = 0; i < maze.exit.length; i++) {
		convertedMaze.exit.push(convertVertex(maze.exit[i], size));
	}

	return convertedMaze;
}

function convertVertex(num, size) {
	let canvasSize = 256;
	return ((num * ((canvasSize * 2) / size)) - canvasSize) / canvasSize;
}

function getEndPoint(size) {
	return getRandomInt(1, size - 2);
}

// 0 is a horizontal and 1 is vertical
function getEndPointOrientation() {
	return getRandomInt(0, 3);
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function solveMaze() {
	
}