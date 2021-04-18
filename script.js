import { createBoard, TILE_STATUSES, getNeighborTiles, checkWin} from './minesweeper.js'

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesRemainingText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault();
            markTile(tile);
            numMinesLeft(board, NUMBER_OF_MINES);
        })
    })
})

boardElement.style.setProperty("--size", BOARD_SIZE)
minesRemainingText.textContent = NUMBER_OF_MINES;

const markTile = tile => {
    const markable = (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED);
    const noMoreMarksRemain = minesRemainingText.textContent <= 0
    markable ? 
        tile.status === TILE_STATUSES.MARKED || noMoreMarksRemain ? 
            tile.status = TILE_STATUSES.HIDDEN :
            tile.status = TILE_STATUSES.MARKED :
        '';
}

const numMinesLeft = (board, NUMBER_OF_MINES) => {
    const markedTilesCount = board.reduce((count, row) => {
        return (count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length)}, 0);
    minesRemainingText.textContent = NUMBER_OF_MINES - markedTilesCount
}

const revealTile = (board, tile) => {
    const revealable = tile.status === TILE_STATUSES.HIDDEN;
    const isMine = tile.mine === true;
    if (revealable) {
        if (isMine) {
            tile.status = TILE_STATUSES.MINE;
            checkGameEnd('LOSE')
            return;
        } else {
            tile.status = TILE_STATUSES.NUMBER; 
            tile.element.textContent = tile.nearbyMines > 0 ? tile.nearbyMines : '';
        }
        if (tile.nearbyMines === 0) {
            getNeighborTiles(board,tile).forEach(neighbor => revealTile(board, board[neighbor.y][neighbor.x]))
        }
    }
}

const checkGameEnd = status => {
    const lose = status === 'LOSE';
    const win = checkWin(board);

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true })
        boardElement.addEventListener("contextmenu", stopProp, { capture: true })
    }

    if (win) {
        messageText.textContent = "Winner!";
    }
    if (lose) {
        messageText.textContent = "You Lose";
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) {
                    markTile(tile);
                }
                if (tile.mine) {
                    revealTile(board, tile)}
            })
        })
    }
}

const stopProp = (e) => {
    e.stopImmediatePropagation()
  }