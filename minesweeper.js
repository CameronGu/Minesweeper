export const createBoard = (boardSize, numberOfMines) => {
    let gameBoard = createEmptyBoard(boardSize);
    const mineLocations = getMineLocations(boardSize, numberOfMines);
    console.log(mineLocations)
    placeMines(gameBoard, mineLocations);
    markMinesNearby(gameBoard, mineLocations);
    return gameBoard;
}

export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
}

const createEmptyBoard = (boardSize) => {
    const board = new Array(boardSize).fill(0)
    .map((e,y) => new Array(boardSize).fill({y,})
    .map((tile,i,a) => {
        const element = document.createElement("div");
        element.dataset.status = TILE_STATUSES.HIDDEN;
        return (
            tile = {
                x: i, 
                y: a[i].y, 
                mine: false, 
                nearbyMines: 0, 
                element,
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    return this.element.dataset.status = value;
                },
            }
        )
    }));
    return board;
}

const getMineLocations = (boardSize, numberOfMines) => {
    const getRandNum = (numLessThan) => Math.floor(Math.random() * numLessThan);
    let mineLocations = [];
    while (mineLocations.length < numberOfMines) {
        const x = getRandNum(boardSize);
        const y = getRandNum(boardSize);
        console.log(mineLocations);
        console.log([x,y],mineLocations.includes([x,y]))
        console.log(mineLocations.some(e => e.id === `${x}${y}`))
        if (mineLocations.some(e => e.id === `${x}${y}`)) {
            console.log('included',[x,y]);
        } else {
            mineLocations.push({x,y,id:`${x}${y}`})
        }
    }
    return mineLocations;
}

const placeMines = (gameBoard, mineLocations) => {
    mineLocations.forEach(location => {
        const x = location.x;
        const y = location.y;
        const tile = gameBoard[y][x];
        tile.mine = true;
    })
}

const markMinesNearby = (gameBoard, mineLocations) => {
    const isValidNeighbor = (x,y) => {
        const boardSize = gameBoard.length;
        const validX = x >= 0 && x < boardSize;
        const validY = y >= 0 && y < boardSize;
        return validX && validY ? gameBoard[y][x].mine !== true : false;
    }
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
    mineLocations.forEach((location) => {
        directions.forEach(direction => {
            const mineX = location.x;
            const mineY = location.y;
            const neighborX = mineX + transpositions[direction].x;
            const neighborY = mineY + transpositions[direction].y;
            if (isValidNeighbor(neighborX,neighborY)) {
                const tile = gameBoard[neighborY][neighborX];
                tile.nearbyMines++;
                tile.element.textContent = tile.nearbyMines;
            }
        })
    })
}

// console.log(createBoard(10,10))