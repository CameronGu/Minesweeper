import { createBoard, TILE_STATUSES } from './minesweeper.js'

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 50;

const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesRemainingText = document.querySelector("[data-mine-count]")

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(tile);
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

const revealTile = (tile) => {
    const revealable = tile.status === TILE_STATUSES.HIDDEN;
    const isMine = tile.mine === true;
    revealable ? isMine ? tile.status = TILE_STATUSES.MINE : tile.status = TILE_STATUSES.NUMBER: '';
}

