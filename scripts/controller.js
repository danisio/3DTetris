var Controller = function () {

    var init;

    function readUserInput() {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 88) {
            Block.rotate(AXIS.X);
        } else if (key == 89) {
            Block.rotate(AXIS.Y);
        } else if (key == 90) {
            Block.rotate(AXIS.Z);
        } else {
            Block.moveByUser(AXIS.X, key);
            Block.moveByUser(AXIS.Z, key);
        }
    }

    init = function(block) {
        addEventListener('keyup', readUserInput);
    }

    return {
        getController: function (tetris, block, utilities) {
            this.Tetris = tetris;
            this.Block = block;
            this.Utilities = utilities;
            init();
            return this;
        },
        run: run
    }
}();
