
var Controller = function () {

    var run;

    var AXIS = {
        X: 'x',
        Y: 'y',
        Z: 'z'
    };

    function readUserInput(e) {
        var rotated = false,
        key = e.keyCode ? e.keyCode : e.which;

        if (key == 88) {
            rotated = this.Block.rotate(AXIS.X);
        } else if (key == 89|| key ==67) {
            rotated = this.Block.rotate(AXIS.Y);
        } else if (key == 90) {
            rotated = this.Block.rotate(AXIS.Z);
        } else {
            this.Block.moveByUser(key);
        }

        if(rotated == true) {
            Tetris.sounds.rotate.play();
        }
    }

    run = function(block) {
        addEventListener('keyup', readUserInput);
    }

    return {
        getController: function (tetris, block, utilities) {
            this.Tetris = tetris;
            this.Block = block;
            this.Utilities = utilities;
            return this;
        },
        run: run
    }
}();
