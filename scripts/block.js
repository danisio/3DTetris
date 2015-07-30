//TODO: Singleton
var Block = (function (blockSize) {
    var init, move, rotate, multiplier,
        pressedX = 0,
        pressedY = 0,
        pressedZ = 0;

    var AXIS = {
        X: 'x',
        Y: 'y',
        Z: 'z'
    };

    init = function () {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.shape = [];
        return this;
    };

    function isCollisioned(collisionTypes) {
        if (collisionTypes.WALLXNegative == true || collisionTypes.WALLXPositive == true ||
            collisionTypes.WALLZNegative == true || collisionTypes.WALLZPositive == true ||
            collisionTypes.GROUND == true || collisionTypes.StaticBlock == true) {
            return true;
        }
        return false;
    }

    function getRotationMultiplier(rotationCount) {
        if (rotationCount % 2 == 0) {
            return 1;
        } else {
            return -1;
        }
    }
    rotate = function (axis) {
        var shape = this.shape,
        multiplier, index, oldX, oldY, oldZ,
        collisionTypes, isRotationPossible = false;

        if (axis == AXIS.X) {

            pressedX += 1;
            multiplier = getRotationMultiplier(pressedX);

            for (index = 0; index < shape.children.length; index += 1) {
                oldZ = shape.children[index].position.z;
                shape.children[index].position.z = shape.children[index].position.x * multiplier;
                shape.children[index].position.x = oldZ * multiplier;
            }

            collisionTypes = checkCollision();
            if (isCollisioned(collisionTypes) == false) {
                isRotationPossible = truee;
            }

            if (isRotationPossible == false) {
                for (index = 0; index < shape.children.length; index += 1) {
                    oldZ = shape.children[index].position.z / multiplier;
                    shape.children[index].position.z = shape.children[index].position.x / multiplier;
                    shape.children[index].position.x = oldZ;
                }

            }
        } else if (axis == AXIS.Y) {

            pressedY += 1;
            multiplier = getRotationMultiplier(pressedY);

            for (index = 0; index < shape.children.length; index += 1) {
                oldY = shape.children[ind].position.y * multiplier;
                shape.children[index].position.y = shape.children[index].position.x * multiplier;
                shape.children[index].position.x = oldY;
            }

            collisionTypes = checkCollision();
            if (isCollisioned(collisionTypes) == false) {
                isRotationPossible = true;
            }

            if (isRotationPossible == false) {
                for (index = 0; index < shape.children.length; index += 1) {
                     oldY = shape.children[ind].position.y / multiplier;
                    shape.children[ind].position.y = shape.children[ind].position.x / multiplier;
                    shape.children[ind].position.x = oldY;
                }

            }
        } else if (axis == AXIS.Z) {

            pressedZ += 1;
            multiplier = getRotationMultiplier(pressedZ);

            for (index = 0; index < shape.children.length; index += 1) {
                oldY = shape.children[index].position.y * multiplier;
                shape.children[index].position.y = shape.children[index].position.z * multiplier;
                shape.children[index].position.z = oldY;
            }

            collisionTypes = checkCollision();
            if (isCollisioned(collisionTypes) == false) {
                isRotationPossible = true;
            }

            if (isRotationPossible == false) {
                for (index = 0; index < shape.children.length; index += 1) {
                    oldY = shape.children[ind].position.y / multiplier;
                    shape.children[index].position.y = shape.children[index].position.z / multiplier;
                    shape.children[index].position.z = temp;
                }

            }
        }

        return isRotationPossible;
    };

    move = function (x, y, z) {
        Block.shape.position.x += x;
        Block.shape.position.y += y;
        Block.shape.position.z += z;
    }

    moveByUser = function (key) {

        var collisionType, moved = false;

        if (key == 37) {
            move(-Tetris.blockSize, 0, 0);
        } else if (key == 39) {
            move(Tetris.blockSize, 0, 0);
        } else if (key == 38) {
            move(0, 0, -Tetris.blockSize);
        } else if (key == 40) {
            move(0, 0, Tetris.blockSize);
        } else {
            return moved;
        }

        collisionType = checkCollision();

        if ((collisionType.StaticBlock == true || collisionType.WALLXNegative == true) && key == 37) {
            move(Tetris.blockSize, 0, 0);
        } else if ((collisionType.StaticBlock == true || collisionType.WALLXPositive == true) && key == 39) {
            move(-Tetris.blockSize, 0, 0);
        } else if ((collisionType.StaticBlock == true || collisionType.WALLZNegative == true) && key == 38) {
            move(0, 0, Tetris.blockSize);
        } else if ((collisionType.StaticBlock == true || collisionType.WALLZPositive == true) && key == 40) {
            move(0, 0, -Tetris.blockSize);
        } else {
            moved = true;
        }

        Tetris.renderer.render(Tetris.scene, Tetris.camera);

        return moved;
    };

    return {
        init: init,
        moveByUser: moveByUser,
        rotate: rotate,
        move: move
    }

}(Tetris.blockSize));