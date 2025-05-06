<template>
    <div class="min-h-screen bg-emerald-800 flex items-center justify-center px-4">

    <div class="max-w-md w-full text-center">
        <h1 class="text-4xl font-semibold text-emerald-400  mb-1">Sudoku Solver</h1>
        <p class="text-emerald-300 mb-4">
            Generate a new Sudoku puzzle and solve it automatically using a backtracking algorithm.
        </p>
        <div class="overflow-x-auto">
        <table class="table-fixed border-separate border-spacing-1 mx-auto">

            <tbody>
            <tr v-for="(row, i) in sudoku" :key="i">
                <td
                    v-for="(cell, j) in row"
                    :key="j"
                    class="w-12 h-12 text-xl text-center text-emerald-300 align-middle bg-emerald-700 font-mono transition-all duration-300 rounded-md"
                    :class="[
                        (j % 3 === 0 && j !== 0) ? 'ml-3' : '',
                        (i % 3 === 0 && i !== 0) ? 'mt-3' : '',
                        solved && cell !== 0 ? 'bg-green-200 text-green-800 font-semibold animate-pulse' : ''
                    ]"
                    >
                    {{ cell !== 0 ? cell : '' }}
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        <p class="text-emerald-200 text-sm mb-6">
            You can choose to visualize the solving process step by step, or get the final result instantly, in both cases,
            you'll see the real algorithm execution time.
        </p>
        <div class="flex justify-center gap-4 mt-6">
        <button
            @click="solveSudoku"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
        >
            Solve
        </button>
        <button
            @click="fetchSudoku"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
        >
            New
        </button>
        </div>

        <div class="mt-4 flex items-center justify-center gap-2 text-emerald-200 text-sm">
            <input type="checkbox" id="visual" v-model="visualize" class="accent-green-500" />
            <label for="visual">Visualize solving process</label>
        </div>


        <div class="mt-6 text-sm text-emerald-300" v-if="elapsedTime !== null">
        🧠 Solved in <span class="font-bold">{{ elapsedTime.toFixed(2) }}</span> ms
        </div>
    </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue'
    
    const apiUrl = 'https://sudoku-api.vercel.app/api/dosuku'
    const sudoku = ref([])
    const solved = ref(false)
    const elapsedTime = ref(null)
    const cancelSolve = ref(false)
    const visualize = ref(false)


    
    function fetchSudoku() {
        cancelSolve.value = true      
        solved.value = false
        elapsedTime.value = null
        sudoku.value = Array(9).fill().map(() => Array(9).fill(0))  

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                sudoku.value = data.newboard.grids[0].value
            })
            .catch(err => console.error('Fetch error:', err))
    }


    onMounted(fetchSudoku)
    
    async function solveSudoku() {
        cancelSolve.value = true
        await sleep(10)

        const board = sudoku.value.map(row => [...row])
        cancelSolve.value = false

        const time = measureSolveTime()

        const success = visualize.value
            ? await solveWithVisualization(board)
            : solveSudokuCore(board)

        if (success && !cancelSolve.value) {
            sudoku.value = board
            solved.value = true
        }

        elapsedTime.value = time 
    }


    function measureSolveTime() {
        const testBoard = sudoku.value.map(row => [...row])
        const start = performance.now()
        solveSudokuCore(testBoard)
        const end = performance.now()
        return end - start
    }


    async function solveWithVisualization(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (cancelSolve.value) return false

                        board[i][j] = num
                        sudoku.value = board.map(row => [...row])
                        await sleep(1)

                        if (isValid(board)) {
                            const result = await solveWithVisualization(board)
                            if (result) return true
                        }

                        board[i][j] = 0
                        sudoku.value = board.map(row => [...row])
                        await sleep(1)
                    }
                    return false
                }
            }
        }
        return true
    }
    
    function isValid(board) {
        for (let i = 0; i < 9; i++) {
        if (!isUnique(board[i])) return false
        const col = board.map(row => row[i])
        if (!isUnique(col)) return false
        }
    
        for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            const block = []
            for (let i = r; i < r + 3; i++) {
            for (let j = c; j < c + 3; j++) {
                block.push(board[i][j])
            }
            }
            if (!isUnique(block)) return false
        }
        }
    
        return true
    }
  
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function isUnique(arr) {
        const nums = arr.filter(n => n !== 0)
        return new Set(nums).size === nums.length
    }

    function solveSudokuCore(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        board[i][j] = num
                        if (isValid(board)) {
                            if (solveSudokuCore(board)) return true
                        }
                        board[i][j] = 0
                    }
                    return false
                }
            }
        }
        return true
    }

</script>
  
  