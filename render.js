/**
 * Starter code created by Hans Dulimarta.
 */

// Kevin Anderson

var gl;
var sizeInput, outMessage;
var posAttr, vertexBuff, prog;
var mazeArray = {
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
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(mazeArray.vertices), gl.STATIC_DRAW);

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
		mazeArray.vertices.length / 2); /* we are drawing four vertices */
}

function drawEntry() {
	// create a buffer
	vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

	// copy the vertices data
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(mazeArray.entry), gl.STATIC_DRAW);

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
		mazeArray.entry.length / 2); /* we are drawing four vertices */
}

function drawExit() {
	// create a buffer
	vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

	// copy the vertices data
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(mazeArray.exit), gl.STATIC_DRAW);

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
		mazeArray.exit.length / 2); /* we are drawing four vertices */
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
		mazeArray = setupMaze(sz);
		console.log(mazeArray);
	}
}

/* TODO: You may add more functions as needed */

function setupMaze(size) {
	let maze = {
		cells: [],
		entryCell: null,
		exitCell: null,
	};

	//initialize the maze with cells
	for(let i = 0; i < size; i++) {
		for(let j = 0; j < size; j++) {
			let cell = {
				x: i,
				y: j,
				leftSide: [],
				rightSide: [],
				topSide: [],
				bottomSide: []
			}
			cell.leftSide.push(i, j);
			cell.leftSide.push(i + 1, j);
			cell.topSide.push(i + 1, j);
			cell.topSide.push(i + 1, j + 1);
			cell.rightSide.push(i + 1, j + 1);
			cell.rightSide.push(i, j + 1);
			cell.bottomSide.push(i, j + 1);
			cell.bottomSide.push(i, j);

			maze.cells.push(cell);
		}
	}

	// find enterance and exit
	let entryPoint = getEndPoint(size);
	let entrySide = getEndPointOrientation();

	let entryCell = {
		x: null,
		y: null,
		sides: []
	};

	// 0 is a horizontal and 1 is vertical
		switch(entrySide) {
		case 0:
			entryCell.x = entryPoint;
			entryCell.y = 0;
			entryCell.sides.push(entryPoint, 0);
			entryCell.sides.push(entryPoint + 1, 0);
			entryCell.sides.push(entryPoint + .5, 1);
			entryCell.sides.push(entryPoint, 0);
			entryCell.sides.push(entryPoint, .5);
			break;
		case 1:
			entryCell.x = entryPoint;
			entryCell.y = size;
			entryCell.sides.push(entryPoint, size);
			entryCell.sides.push(entryPoint + 1, size);
			entryCell.sides.push(entryPoint + .5, size - 1);
			entryCell.sides.push(entryPoint, size);
			entryCell.sides.push(entryPoint, .5);
			break;
		case 2:
			entryCell.x = 0;
			entryCell.y = entryPoint;
			entryCell.sides.push(0, entryPoint);
			entryCell.sides.push(0, entryPoint + 1);
			entryCell.sides.push(1, entryPoint + .5);
			entryCell.sides.push(0, entryPoint);
			entryCell.sides.push(.5, entryPoint);
			break;
		case 3:
			entryCell.x = size;
			entryCell.y = entryPoint;
			entryCell.sides.push(size, entryPoint);
			entryCell.sides.push(size, entryPoint + 1);
			entryCell.sides.push(size - 1, entryPoint + .5);
			entryCell.sides.push(size, entryPoint);
			entryCell.sides.push(.5, entryPoint);
			break;
	}

	maze.entryCell = entryCell;

	let exitPoint = getEndPoint(size);
	let exitSide =  entrySide;

	while(exitSide === entrySide) {
		exitSide = getEndPointOrientation();
	}

	let exitCell = {
		x: null,
		y: null,
		sides: []
	};

	switch(exitSide) {
		case 0:
			exitCell.x = exitPoint;
			exitCell.y = 0;
			exitCell.sides.push(exitPoint, 0);
			exitCell.sides.push(exitPoint + 1, 1);
			exitCell.sides.push(exitPoint + 1, 0);
			exitCell.sides.push(exitPoint, 1);
			exitCell.sides.push(exitPoint, 0);
			break;
		case 1:
			exitCell.x = exitPoint;
			exitCell.y = size;
			exitCell.sides.push(exitPoint, size);
			exitCell.sides.push(exitPoint + 1, size - 1);
			exitCell.sides.push(exitPoint + 1, size);
			exitCell.sides.push(exitPoint, size - 1);
			exitCell.sides.push(exitPoint, 0);
			break;
		case 2:
			exitCell.x = 0;
			exitCell.y = exitPoint;
			exitCell.sides.push(0, exitPoint);
			exitCell.sides.push(1, exitPoint + 1);
			exitCell.sides.push(0, exitPoint + 1);
			exitCell.sides.push(1, exitPoint);
			exitCell.sides.push(0, exitPoint);
			break;
		case 3:
			exitCell.x = size;
			exitCell.y = exitPoint;
			exitCell.sides.push(size, exitPoint);
			exitCell.sides.push(size - 1, exitPoint + 1);
			exitCell.sides.push(size, exitPoint + 1);
			exitCell.sides.push(size - 1, exitPoint);
			exitCell.sides.push(0, exitPoint);
			break;
	}

	maze.exitCell = exitCell;
	console.log(maze);
	
	//create path through the maze
	let currentCell = maze.entryCell;
	let visited = [];

	while(visited.length !== maze.cells.length) {
		let nextCell = getNextCell(currentCell, size);

		if(nextCell) {
			let visitedCell = visited.find((cell) => {
				return cell.x === nextCell.x && cell.y === nextCell.y;
			});

			if(!visitedCell) {
				visited.push(currentCell);
				console.log(size, nextCell);
				currentCell = removeSides(currentCell, nextCell.dir, 0);
				currentCell = maze.cells.find((cell) => {
					return cell.x === nextCell.x && cell.y === nextCell.y;
				});
				currentCell = removeSides(currentCell, nextCell.dir, 1);
			} else {
				break;
			}
		}		
	}

	console.log(visited);
	
	return convertToVertices(maze, size);
}

function getNextCell(currentCell, size) {
	let nextCell = null;
	let direction = getRandomInt(0, 4);
	let currentRow = null;
	let nextRow = null;

	switch (direction) {
		case 0: // down
			if(currentCell.x - 1 >= 0) {
				nextCell = {
					x: currentCell.x - 1,
					y: currentCell.y,
					dir: 0
				};
			} else {
				return nextCell;
			}
			break;
		case 1: // up
			if(currentCell.x + 1 < size) {
				nextCell = {
					x: currentCell.x + 1,
					y: currentCell.y,
					dir: 1
				};
			} else {
				return nextCell;
			}
			break;
		case 2: // left
			if(currentCell.y - 1 >= 0) {
				nextCell = {
					x: currentCell.x,
					y: currentCell.y - 1,
					dir: 2
				};
			} else {
				return nextCell;
			}
			break;
		case 3: // right
			if(currentCell.y + 1 < size) {
				nextCell = {
					x: currentCell.x,
					y: currentCell.y + 1,
					dir: 3
				};
			} else {
				return nextCell;
			}
			break;
	}

	return nextCell;
}

function removeSides(cell, dir, second) {
	if(second) {
		switch (dir) {
			case 0: // up
				cell.topSide = [];
				break;
			case 1: // down
				cell.bottomSide = [];
				break;
			case 2: // right
				cell.rightSide = [];
				break;
			case 3: // left
				cell.leftSide = [];
				break;
		}
	} else {
		switch (dir) {
			case 0: // down
				cell.bottomSide = [];
				break;
			case 1: // up
				cell.topSide = [];
				break;
			case 2: // left
				cell.leftSide = [];
				break;
			case 3: // right
				cell.rigthSide = [];
				break;
		}
	}

	//console.log('removeSides' , cell, dir);
	return cell;
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

function convertToVertices(maze, size) {
	let convertedMaze = {
		vertices: [],
		entry: [],
		exit: [],
		path: []
	};

	for(let i = 0; i < maze.cells.length; i++) {
		for(let j = 0; j < maze.cells[i].leftSide.length; j++) {
			convertedMaze.vertices.push(convertVertex(maze.cells[i].leftSide[j], size));
		}
		for(let j = 0; j < maze.cells[i].rightSide.length; j++) {
			convertedMaze.vertices.push(convertVertex(maze.cells[i].rightSide[j], size));
		}
		for(let j = 0; j < maze.cells[i].topSide.length; j++) {
			convertedMaze.vertices.push(convertVertex(maze.cells[i].topSide[j], size));
		}
		for(let j = 0; j < maze.cells[i].bottomSide.length; j++) {
			convertedMaze.vertices.push(convertVertex(maze.cells[i].bottomSide[j], size));
		}
	}

	for(let i = 0; i < maze.entryCell.sides.length; i++) {
		convertedMaze.entry.push(convertVertex(maze.entryCell.sides[i], size));
	}

	for(let i = 0; i < maze.exitCell.sides.length; i++) {
		convertedMaze.exit.push(convertVertex(maze.exitCell.sides[i], size));
	}

	return convertedMaze;
}