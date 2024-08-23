let gridSize = 50;
let intervalId; 
let generationCount = 0; 
let cellColor = '#3498db'; 
let gridColor = '#000000'; 
let bgColor = '#f5f5f5'; 
let cells = []; 

initializeGame = () => {
    gridSize = parseInt(document.getElementById('size').value); 
    generationCount = 0;

    clearInterval(intervalId); 
    document.getElementById('generation').innerText = 'Поколение: 0';

    cellColor = document.getElementById('cell-color').value; 
    gridColor = document.getElementById('grid-color').value; 
    bgColor = document.getElementById('bg-color').value; 

    document.body.style.backgroundColor = bgColor; 

    createGrid(); 

    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
}

const speedInput = document.getElementById('speed');

startGame = () => {
    if (!intervalId) {
        intervalId = setInterval(generateNextGeneration, 200);
    }
    const newSpeed = parseInt(speedInput.value);
    clearInterval(intervalId); 
    intervalId = setInterval(generateNextGeneration, newSpeed); 
};

stopGame = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

createGrid = () => {
    const canvas = document.getElementById('grid-canvas'); 
    const ctx = canvas.getContext('2d'); 

    canvas.width = window.innerWidth * 0.95; 
    canvas.height = window.innerHeight * 0.75; 

    ctx.strokeStyle = gridColor; 

    cells = Array.from({ length: gridSize * gridSize }, () => Math.random() < 0.2);

    drawCells(); 
}

toggleCell = (event) => {
    const canvas = document.getElementById('grid-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - 10) / ((canvas.width - 20) / gridSize));
    const y = Math.floor((event.clientY - rect.top - 10) / ((canvas.height - 20) / gridSize));

    const index = y * gridSize + x;
    cells[index] = !cells[index]; 

    drawCells(); 
}

drawCells = () => {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    for (let i = 0; i <= gridSize; i++) {
        const x = 10 + (i / gridSize) * (canvas.width - 20);
        const y = 10 + (i / gridSize) * (canvas.height - 20);

        ctx.beginPath();
        ctx.moveTo(x, 10);
        ctx.lineTo(x, canvas.height - 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(canvas.width - 10, y);
        ctx.stroke();
    }

    const cellSizeW = (canvas.width - 20) / gridSize;
    const cellSizeH = (canvas.height - 20) / gridSize;

    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            if (cells[index]) {
                ctx.fillStyle = cellColor; 
                ctx.fillRect(10 + j * cellSizeW, 10 + i * cellSizeH, cellSizeW, cellSizeH);
            }
        }
    }
}

generateNextGeneration = () => {
    const nextGenerationState = [];

    for (let i = 0; i < cells.length; i++) {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize);
        const neighbors = countNeighbors(x, y);

        let nextCellState = cells[i];

        if (cells[i]) {
            if (neighbors < 2 || neighbors > 3) {
                nextCellState = false; 
            }
        } else {
            if (neighbors === 3) {
                nextCellState = true; 
            }
        }

        nextGenerationState.push(nextCellState);
    }

    cells = nextGenerationState; 

    generationCount++;
    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
    drawCells(); 
}

countNeighbors = (x, y) => {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const neighborX = (x + i + gridSize) % gridSize;
            const neighborY = (y + j + gridSize) % gridSize;
            const neighborIndex = neighborY * gridSize + neighborX;

            if (cells[neighborIndex] && !(i === 0 && j === 0)) {
                count++; 
            }
        }
    }

    return count;
}

initializeGame();

document.getElementById('grid-canvas').addEventListener('click', toggleCell);

window.addEventListener('resize', () => {
    const canvas = document.getElementById('grid-canvas'); 

    canvas.width = window.innerWidth * 0.95; 
    canvas.height = window.innerHeight * 0.75; 
    drawCells();
});