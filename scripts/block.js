//TODO: Singleton
var Block = (function () {
    var move, rotate

    move = function () {

    };

    rotate = function (axis) {

    };

    return {
        initializeBlock: function () {
            this.position = {
                x: 0,
                y: 0,
                z: 0
            };
            this.shape = [];
            return this;
        }
        // move: move
        // rotate: rotate
    }
}());