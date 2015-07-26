//TODO: Singleton
var Block = (function (blockSize) {
    var move, rotate, multiplier,
        pressedX = 0,
        pressedY = 0,
        pressedZ = 0;

    var block = {};

    block.init = function () {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.shape = [];
        return this;
    }

    var rotate = function (axis) {
        var shape = this.shape;
        multiplier;

        console.log(shape.children[0].position.y);

        if (axis == 'x') {
            pressedX += 1;
            if (pressedX % 2 == 0) {
                multiplier = 1
            } else {
                multiplier = -1
            }
            for (var ind = 0; ind < shape.children.length; ind += 1) {

                var temp = multiplier * shape.children[ind].position.z;
                shape.children[ind].position.z = multiplier * shape.children[ind].position.x;
                shape.children[ind].position.x = temp;
            }
        }

        if (axis == 'y') {
            pressedY += 1;
            if (pressedY % 2 == 0) {
                multiplier = 1
            } else {
                multiplier = -1
            }
            for (var ind = 0; ind < shape.children.length; ind += 1) {

                var temp = multiplier * shape.children[ind].position.y;
                shape.children[ind].position.y = multiplier * shape.children[ind].position.x;
                shape.children[ind].position.x = temp;
            }
        }


        if (axis == 'z') {
            pressedZ += 1;
            if (pressedZ % 2 == 0) {
                multiplier = -1
            } else {
                multiplier = 1
            }
            for (var ind = 0; ind < shape.children.length; ind += 1) {
                var temp = multiplier * shape.children[ind].position.y;
                shape.children[ind].position.y = multiplier * shape.children[ind].position.z;
                shape.children[ind].position.z = temp;
            }
        }

        return this;
    };

    move = function (x, y, z) {

        Block.shape.position.x += x * blockSize;
        //     Block.position.x += x;
        Block.shape.position.y += y * blockSize;
        //    Block.position.y += y;
        Block.shape.position.z += z * blockSize;
        //   Block.position.z += z;
    }

    moveByUser = function (axis, key) {

        if (axis == 'x' && key == 37) {
            console.log(this.shape.position.x);
            this.shape.position.x -= Tetris.blockSize;
            console.log('left arrow');
            console.log(this.shape.position.x);
        }

        if (axis == 'x' && key == 39) {
            this.shape.position.x += Tetris.blockSize;
            console.log('right arrow');
        }

        if (axis == 'z' && key == 38) {
            this.shape.position.z -= Tetris.blockSize;
            console.log('up arrow');
        }

        if (axis == 'z' && key == 40) {
            this.shape.position.z += Tetris.blockSize;
            console.log('down arrow');
        }
        return this;
    };

    Object.defineProperty(block, 'shape', {
        get: function () {
            return this._shape;
        },
        set: function (value) {
            this._shape = "alabalaportokalq" // or why it doesnt effect the shape
        }
    });

    return {
        initializeBlock: block.init,
        moveByUser: moveByUser,
        rotate: rotate,
        move: move
    }
}(Tetris.blockSize));