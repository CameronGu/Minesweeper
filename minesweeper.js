export const createBoard = (boardSize, numberOfMines) => {
    let gameBoard = createEmptyBoard(boardSize);
    const mineLocations = getMineLocations(boardSize, numberOfMines);
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
        if (!mineLocations.some(e => e.id === `${x}${y}`)) {
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

const isValidNeighbor = (gameBoard,[x,y]) => {
    const boardSize = gameBoard.length;
    const validX = x >= 0 && x < boardSize;
    const validY = y >= 0 && y < boardSize;
    return validX && validY ? gameBoard[y][x].mine !== true : false;
}

export const getNeighborTiles = (gameBoard, {x,y}) => {
    const transpositions = [{x:0,y:-1}, {x:1,y:-1}, {x:1,y:0}, {x:1,y:1}, {x:0,y:1}, {x:-1,y:1}, {x:-1,y:0}, {x:-1,y:-1}];
    const validNeighbors = [];
    for (const transposition of transpositions) {
        const testX = x + transposition.x;
        const testY = y + transposition.y;
        isValidNeighbor(gameBoard,[testX, testY]) ? validNeighbors.push({x: testX, y: testY}) : '';
    }
    return validNeighbors;
}

const markMinesNearby = (gameBoard, mineLocations) => {
    mineLocations.forEach(mineLocation => {
        getNeighborTiles(gameBoard,mineLocation).forEach(neighborLocation => {
            const tile = gameBoard[neighborLocation.y][neighborLocation.x]
            tile.nearbyMines++;
        })
    });
}

export const checkWin = gameBoard => {
    return gameBoard.every(row => {
        return row.every(tile => {
            return (
                tile.status === TILE_STATUSES.NUMBER ||
                (tile.mine &&
                    (tile.status === TILE_STATUSES.HIDDEN ||
                        tile.status === TILE_STATUSES.MARKED)
                )
            )
        })
    })
}