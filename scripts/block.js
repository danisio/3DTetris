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

    // TODO: Check if the block have the time to be rotated! If you rotate it when it is near the bottom, it breaks the collision
    rotate = function (axis) {
        var shape = this.shape;
        multiplier;

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
            var isRotationPosible = checkRotationPossibility(shape, multiplier);

            if (isRotationPosible) {
                for (var ind = 0; ind < shape.children.length; ind += 1) {

                    var temp = multiplier * shape.children[ind].position.y;
                    shape.children[ind].position.y = multiplier * shape.children[ind].position.x;
                    shape.children[ind].position.x = temp;
                }
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

        Block.shape.position.x += x; //* blockSize;
        //     Block.position.x += x;
        Block.shape.position.y += y; // * blockSize;
        //Block.shape.position.y += y;
        Block.shape.position.z += z; // * blockSize;
        //   Block.position.z += z;
    }

    moveByUser = function (axis, key) {

        /*
         if (axis == 'x' && key == 37) {

         Block.shape.position.x -= Tetris.blockSize;

         console.log('left arrow');
         }

         if (axis == 'x' && key == 39) {
         Block.shape.position.x += Tetris.blockSize;
         console.log('right arrow');
         }

         if (axis == 'z' && key == 38) {
         Block.shape.position.z -= Tetris.blockSize;
         console.log('up arrow');
         }

         if (axis == 'z' && key == 40) {
         Block.shape.position.z += Tetris.blockSize;
         console.log('down arrow');
         } */

        //    if(oldShapePosition.x != Block.shape.position.x || oldShapePosition.z != Block.shape.position.z) {

        for(var i = 0; i < Tetris.blockSize / 2; i++) {

            var collisionType = checkCollision();
            if (collisionType.WALLX == true && axis == 'x') {
                break;
            }
            else if (collisionType.WALLZ == true && axis == 'z') {
                break;
            }

            if (axis == 'x' && key == 37) {

                Block.shape.position.x -= 1;

                //  console.log('left arrow');
            }

            if (axis == 'x' && key == 39) {
                Block.shape.position.x += 1;
                //   console.log('right arrow');
            }

            if (axis == 'z' && key == 38) {
                Block.shape.position.z -= 1;
                //   console.log('up arrow');
            }

            if (axis == 'z' && key == 40) {
                Block.shape.position.z += 1;
                //  console.log('down arrow');
            }
        }

        Tetris.renderer.render(Tetris.scene, Tetris.camera);
        // }

        return this;
    };

    // TODO: Think about encapsulation. The method use gamefield width (600)
    var isOutOfBottomBound = function (shape) {
        for (var index = 0; index < shape.children.length; index += 1) {
            var child = shape.children[index];
            if ((child.position.y + (Block.shape.position.y - (blockSize / 2)) ) <= -(600 / 2 )) {
                return true;
            }
        }
        return false;
    };

    function checkRotationPossibility(shape, multiplier) {

        var element = shape.clone();

        var ind,
            index,
            temp,
            heightsByCoordX = [],
            maxValueCoordX = 2,
            maxHeight;

        for (ind = 0; ind < element.children.length; ind += 1) {

            temp = multiplier * element.children[ind].position.y;
            element.children[ind].position.y = multiplier * element.children[ind].position.x;
            element.children[ind].position.x = -temp;
        }

        if (!isOutOfBottomBound(element)) {

            return true;
        }
        else {
            return false;
        }
    }

    Object.defineProperty(block, 'shape', {
        get: function () {
            return this._shape;
        },
        set: function (value) {
            this._shape = value;
        }
    });

    return {
        initializeBlock: block.init,
        moveByUser: moveByUser,
        rotate: rotate,
        move: move
    }
}(Tetris.blockSize));