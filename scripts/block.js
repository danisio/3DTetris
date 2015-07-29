//TODO: Singleton
var Block = (function (blockSize) {
    var init, move, rotate, multiplier,
        pressedX = 0,
        pressedY = 0,
        pressedZ = 0;

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
        var shape = this.shape, multiplier, index,
            collisionTypes, isRotationPossible;

        if (axis == 'x') {

            multiplier = getRotationMultiplier(pressedX);

            for (index = 0; index < shape.children.length; index += 1) {
                shape.children[index].position.z = multiplier * shape.children[index].position.x;
                shape.children[index].position.x = multiplier * shape.children[index].position.z;
            }

            collisionTypes = checkCollision();
            isRotationPossible = true;
            if (isCollisioned(collisionTypes) == true) {
                isRotationPossible = false;
            }

            if (isRotationPossible == false) {
                for (index = 0; index < shape.children.length; index += 1) {
                    shape.children[index].position.z = shape.children[index].position.x / multiplier;
                    shape.children[index].position.x = shape.children[index].position.z / multiplier;
                }
            } else {
                pressedX += 1;
            }

            Tetris.sounds.rotate.play(); //TODO: Move this out of here into the controller.js

        } else if (axis == 'y') {

            multiplier = getRotationMultiplier(pressedY);

            for (index = 0; index < shape.children.length; index += 1) {
                shape.children[index].position.y = multiplier * shape.children[index].position.x;
                shape.children[index].position.x = multiplier * shape.children[index].position.y;
            }

            collisionTypes = checkCollision();
            isRotationPossible = true;
            if (isCollisioned(collisionTypes) == true) {
                isRotationPossible = false;
            }

            if (isRotationPossible == false) {
                for (var index = 0; index < shape.children.length; index += 1) {
                    shape.children[index].position.y = shape.children[index].position.x / multiplier;
                    shape.children[index].position.x = shape.children[index].position.y / multiplier;
                }
            } else {
                pressedY += 1;
            }

            Tetris.sounds.rotate.play();

        } else if (axis == 'z') {

            multiplier = getRotationMultiplier(pressedZ);

            for (index = 0; index < shape.children.length; index += 1) {
                shape.children[index].position.y = multiplier * shape.children[index].position.z;
                shape.children[index].position.z = multiplier * shape.children[index].position.y;
            }

            collisionTypes = checkCollision();
            isRotationPossible = true;
            if (isCollisioned(collisionTypes) == true) {
                isRotationPossible = false;
            }

            if (isRotationPossible == false) {
                for (index = 0; index < shape.children.length; index += 1) {
                    shape.children[index].position.y = shape.children[index].position.z / multiplier;
                    shape.children[index].position.z = shape.children[index].position.y / multiplier;
                }
            } else {
                pressedZ += 1;
            }

            Tetris.sounds.rotate.play();
        }

        return this;
    };

    move = function (x, y, z) {
        this.shape.position.x += x;
        this.shape.position.y += y;
        this.shape.position.z += z;
        Tetris.sounds['move'].play(); //TODO: Move sounds playing into controller.js, and make move functions to return true or false so you play or not play sound
    }

    moveByUser = function (key) {

        var collisionType;

        if (key == 37) {
            move(-Tetris.blockSize, 0, 0);
        } else if (key == 39) {
            move(Tetris.blockSize, 0, 0);
        } else if (key == 38) {
            move(0, 0, -Tetris.blockSize);
        } else if (key == 40) {
            move(0, 0, Tetris.blockSize);
        } else {
            return;
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
        }

        Tetris.renderer.render(Tetris.scene, Tetris.camera);

        return this;
    };

    return {
        init: init,
        moveByUser: moveByUser,
        rotate: rotate,
        move: move
    }

}(Tetris.blockSize));