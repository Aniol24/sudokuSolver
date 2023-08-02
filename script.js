const apiUrl = 'https://sudoku-api.vercel.app/api/dosuku';
src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
let sudoku_get_api;

fetch(apiUrl)
    .then(response => {

        if (!response.ok) {
            throw new Error('Error lmao get some bitches.');
        }
        return response.json();
    })
    .then(data => {

        sudoku_get_api = data.newboard.grids[0].value;
        getSudokuArray(data.newboard.grids[0].value);

    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

function getSudokuArray(data){
    const sudoku = data;

    // Function to generate the HTML table for the sudoku board
    function generateSudokuTable() {
        var container = document.getElementById("sudokuBoard");
        container.innerHTML = "";

        for (var i = 0; i < 9; i++) {
            var rowElement = document.createElement("tr");
            for (var j = 0; j < 9; j++) {
                var cellElement = document.createElement("td");
                cellElement.textContent = sudoku[i][j] !== 0 ? sudoku[i][j] : "";
                cellElement.classList.add("grid-cell"); // Add the grid-cell class to the cell
                rowElement.appendChild(cellElement);
            }
            container.appendChild(rowElement);
        }
    }

    generateSudokuTable();
}

function newSudoku(){
    const apiUrl = 'https://sudoku-api.vercel.app/api/dosuku';
    fetch(apiUrl)
        .then(response => {

            if (!response.ok) {
                throw new Error('Error lmao get some bitches.');
            }
            return response.json();
        })
        .then(data => {

            sudoku_get_api = data.newboard.grids[0].value;
            getSudokuArray(data.newboard.grids[0].value);

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    document.getElementById("solved-in").textContent = "";
}

function start(){

    const startTime = performance.now();
    solve(sudoku_get_api);
    const endTime = performance.now();

    const timeElapsed = endTime - startTime;

    document.getElementById("solved-in").textContent = "Solved in: "+timeElapsed+" milliseconds";
}

function solve(sudoku){

    const solved_sudoku = backtracking(sudoku);

    getSudokuArray(solved_sudoku);

}

function backtracking(sudoku){

    if(isSolved(sudoku)){
        return sudoku;
    }else{
        let posi = 0;
        let posj = 0;
        for(let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudoku[i][j] === 0) {
                    posi = i;
                    posj = j;
                    break;
                }
            }
        }
        for (let i = 1; i < 10; i++) {
            sudoku[posi][posj] = i;
            if (isCorrect(sudoku)) {
                if (backtracking(sudoku)) {
                    return sudoku;
                }
            }
            sudoku[posi][posj] = 0;
        }
        return false;
    }
}

function isCorrect(sudoku){

    for(let i = 0; i <9; i++){
        if(!filaCorrecte(sudoku[i])){
            return false;
        }
        for (let j = 0; j < 9; j++) {
            if(!columnaCorrecte(sudoku, j)){
                return false;
            }
        }
    }
    if(!blocCorrecte(sudoku)){
        return false;
    }
    return true;

}

function blocCorrecte(sudoku){

    for (let blockRow = 0; blockRow < 9; blockRow += 3) {
        for (let blockCol = 0; blockCol < 9; blockCol += 3) {
            const block = [];
            for (let i = blockRow; i < blockRow + 3; i++) {
                for (let j = blockCol; j < blockCol + 3; j++) {
                    if (sudoku[i][j] !== 0) {
                        if (block.includes(sudoku[i][j])) {
                            return false;
                        }
                        block.push(sudoku[i][j]);
                    }
                }
            }
        }
    }
    return true;

}

function columnaCorrecte(sudoku, column){

    const nombresUnics = new Set();

    for (let i = 0; i < 9; i++) {

        if(sudoku[i][column] !== 0){
            const nombreActual = sudoku[i][column];

            if (nombresUnics.has(nombreActual)) {
                return false;
            }

            nombresUnics.add(nombreActual);
        }
    }

    return true;
}

function filaCorrecte(fila_sudoku){

    const nombresUnics = new Set();

    for (let i = 0; i < fila_sudoku.length; i++) {

        if(fila_sudoku[i] !== 0){
            const nombreActual = fila_sudoku[i];

            if (nombresUnics.has(nombreActual)) {
                return false;
            }

            nombresUnics.add(nombreActual);
        }
    }

    return true;
}

function isSolved(sudoku){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(sudoku[i][j] === 0){
                return false;
            }
        }
    }
    return true;
}


