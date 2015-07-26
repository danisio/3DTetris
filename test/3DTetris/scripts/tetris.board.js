window.Tetris = window.Tetris || {};

Tetris.Board = (function(tetris) {

    board = {};
    board.field = [];

    board.FieldCellStates = { EMPTY: 0, OCCUPIED: 1 };

    board.init = function(boardSizeX, boardSizeY, boardSizeZ) {

        for(var x = 0; x <= boardSizeX; x++) {
            board.field[x] = [];
            for(var y = 0; y <= boardSizeY; y++) {
                board.field[x][y] = [];
                for(var z = 0; z <= boardSizeZ; z++) {
                    board.field[x][y][z] = board.FieldCellStates.EMPTY;
                }
            }
        }
    }



}) (Tetris);