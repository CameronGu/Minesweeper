export const createBoard = (boardSize, numberOfMines) => {
    let gameBoard = createEmptyBoard(boardSize)
    const mineLocations = getMineLocations(boardSize, numberOfMines)
    placeMines(gameBoard, mineLocations);
    markMinesNearby(gameBoard, mineLocations);
    return gameBoard;
}

const createEmptyBoard = (boardSize) => {
    const board = new Array(boardSize).fill(0)
    .map((e,y) => new Array(boardSize).fill({y,})
    .map((tile,i,a) => 
    tile = {
        x: i, 
        y: a[i].y, 
        mine: false, 
        hidden: true, 
        nearbyMines: 0, 
        marked: false
    }));
    return board;
}

const getMineLocations = (boardSize, numberOfMines) => {
    const getRandNum = (numLessThan) => Math.floor(Math.random() * numLessThan);
    let mineLocations = [];
    while (mineLocations.length < numberOfMines) {
        const x = getRandNum(boardSize);
        const y = getRandNum(boardSize);
        !mineLocations.includes([x,y]) ? mineLocations.push([x,y]) : '';
    }
    return mineLocations;
}

const placeMines = (gameBoard, mineLocations) => {
    mineLocations.forEach(([mineX,mineY]) => gameBoard[mineY][mineX].mine = true);
}

const markMinesNearby = (gameBoard, mineLocations) => {
    const isValidNeighbor = ([x,y]) => {
        const validX = x >= 0 && x < boardSize;
        const validY = y >= 0 && y < boardSize;
        return validX && validY ? gameBoard[y][x].mine === false : false;
    }
    const boardSize = gameBoard.length;
    const transpositions = {
        n: {x:0,y:-1},
        ne: {x:1,y:-1},
        e: {x:1,y:0},
        se: {x:1,y:1},
        s: {x:0,y:1},
        sw: {x:-1,y:1},
        w: {x:-1,y:0},
        nw: {x:-1,y:-1}
    }
    const directions = ['n','ne','e','se','s','sw','w','nw'];
    mineLocations.forEach(([mineX,mineY]) => {
        directions.forEach(direction => {
            let [neighborX, neighborY] = [mineX + transpositions[direction].y, mineY + transpositions[direction].x];
            isValidNeighbor([neighborX,neighborY]) ? gameBoard[neighborY][neighborX].nearbyMines++ : '';
        })
    })
}

console.log(createBoard(10,10))