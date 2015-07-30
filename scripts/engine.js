var Engine = function () {
    var typeIndex, baseGeometry, additionalGeometry,
        controls, x, y, z, staticBlocks,
        lastFrameTime = Date.now(),
        gameStepTime = 1000,
        frameTimeDifference = 0, time,

    // Test Functions
        testCleanUpRow, testCleanUpRowWithMoreElements,
    // Help Functions
        joinSubElements, getAvailableMesh, getCoordinates, getIndexByCoordinates,
    // Main Functions
        endGameUIFunction, generateBlock, getNewShapeSkeleton, drawBlock,
        setBlockPosition, changeStateToStatic,
        checkFullFlat, removeFlat, moveFlatDown,
        init, run;

    var PHYSI_MESH_CONSTS = {
        MASS: 10,
        FRICTION: .9,
        RESTITUTION: .0 // bouncing
    };

    var AXIS = {
        X: 'x',
        Y: 'y',
        Z: 'z'
    };

    getCoordinates = function (m) {
        return (m * Tetris.blockSize - (Tetris.gameFieldConfig.width / 2)) + (Tetris.blockSize / 2);
    };

    getIndexByCoordinates = function (c) {
        return ((Tetris.gameFieldConfig.width / 2) + c - (Tetris.blockSize / 2)) / Tetris.blockSize;
    };

    generateBlock = function () {
        Block.shape = [];
        Block.mesh = [];
        getNewShapeSkeleton();
        drawBlock();
        setBlockPosition();
        Tetris.scene.add(Block.shape);

        return this;
    };

    getNewShapeSkeleton = function () {
        typeIndex = Math.floor(Math.random() * Utilities.Tetrominoes.length);
        for (var ind = 0; ind < Utilities.Tetrominoes[typeIndex].length; ind += 1) {

            Block.mesh[ind] = Utilities.cloneVector(Utilities.Tetrominoes[typeIndex][ind]);
        }
        return this;
    };

    drawBlock = function () {
        randColor = Utilities.Colors[Math.floor(Math.random() * Utilities.Colors.length)];

        baseGeometry = getAvailableMesh();

        for (var i = 0; i < Block.mesh.length; i++) {
            additionalGeometry = getAvailableMesh();
            additionalGeometry.position.x = Tetris.blockSize * Block.mesh[i].x;
            additionalGeometry.position.y = Tetris.blockSize * Block.mesh[i].y;
            // Tetris.scene.add(cubeOutline);

            joinSubElements(baseGeometry, additionalGeometry);
        }


        Block.shape = baseGeometry;
        return this;
    };

    setBlockPosition = function () {
        Block.shape.position.x = 30;
        Block.shape.position.z = 30;
        Block.shape.position.y = (Tetris.gameFieldConfig.height / 2) - (Tetris.blockSize / 2); // TODO: tuning
        Block.shape.rotation = {x: 0, y: 0, z: 0};
        Block.shape.overdraw = true;
        return this;
    };

    joinSubElements = function (base, additional) {
        baseGeometry.add(additionalGeometry);
    };

    getAvailableMesh = function () {

        var texture = new THREE.ImageUtils.loadTexture("images/outline.gif");
        texture.anisotropy = Tetris.renderer.getMaxAnisotropy();
        var material = new THREE.MeshBasicMaterial({color: randColor, map: texture});

        return new THREE.Mesh(new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), material);
    };

    checkCollision = function () {

        var index, vector,
            child, x, y, z,
            collisionType = {};

        //Updates world positions of piece blocks
        Tetris.scene.updateMatrixWorld();
        Block.shape.updateMatrixWorld();

        for (index = 0; index < Block.shape.children.length; index += 1) {

            child = Block.shape.children[index];
            vector = new THREE.Vector3();
            vector.setFromMatrixPosition(child.matrixWorld);

            if ((vector.y - (Tetris.blockSize / 2 )) < -(Tetris.gameFieldConfig.height / 2 )) {
                collisionType.GROUND = true;
            }

            if (vector.x - (Tetris.blockSize / 2 ) < -(Tetris.gameFieldConfig.width / 2)) {
                collisionType.WALLXNegative = true;
            }

            if (vector.x + (Tetris.blockSize / 2) > (Tetris.gameFieldConfig.width) / 2) {
                collisionType.WALLXPositive = true;
            }

            if (vector.z - (Tetris.blockSize / 2) < -(Tetris.gameFieldConfig.width / 2)) {
                collisionType.WALLZNegative = true;
            }

            if (vector.z + (Tetris.blockSize / 2) > (Tetris.gameFieldConfig.depth) / 2) {
                collisionType.WALLZPositive = true;
            }

            // Checking collision with static blocks
            x = getIndexByCoordinates(vector.x);
            y = getIndexByCoordinates(vector.y);
            z = getIndexByCoordinates(vector.z);

            if (!!staticBlocks && !!staticBlocks[x] && !!staticBlocks[x][y] && !!staticBlocks[x][y][z]) {
                collisionType.StaticBlock = true;
            }
        }

        return collisionType;
    };

    function moveToStaticBlocks(staticBlocks, element) {
        var x, y, z, isFlatFull;

        x = getIndexByCoordinates(element.position.x);
        y = getIndexByCoordinates(element.position.y);
        z = getIndexByCoordinates(element.position.z);

        if (!staticBlocks[x]) {
            staticBlocks[x] = [];
        }

        if (!staticBlocks[x][y]) {
            staticBlocks[x][y] = [];
        }

        staticBlocks[x][y][z] = element;
        isFlatFull = checkFullFlat(staticBlocks, element, x, y, z);

        if (!isFlatFull) {
            Tetris.scene.add(staticBlocks[x][y][z]);
        } else {
            removeFlat(staticBlocks, x, y, z);
            moveFlatDown(staticBlocks, y);
            if (staticBlocks[x] && staticBlocks[x][y] && staticBlocks[x][y][z]) {
                staticBlocks[x][y][z] = undefined;
            }
        }
    }

    changeStateToStatic = function (block) {
        var index;

        for (index = 0; index < block.children.length; index += 1) {
            block.children[index].position.x += block.position.x;
            block.children[index].position.y += block.position.y;
            block.children[index].position.z += block.position.z;
            moveToStaticBlocks(staticBlocks, block.children[index].clone());
        }

    };

    checkFullFlat = function (staticBlocks, element, x, y, z) {
        staticBlocks[x][y][z] = element;
        //console.log('CHECK FLAT');
        var maxCubesCount = Tetris.gameFieldConfig.segmentWidth;

        for (var j = 0; j < maxCubesCount; j += 1) {
            var count = 0; // because we search a flat

            for (var i = 0; i < maxCubesCount; i += 1) {

                for (var k = 0; k < maxCubesCount; k += 1) {
                    if (staticBlocks[i] && staticBlocks[i][j] && staticBlocks[i][j][k]) {

                        count += 1;
                    }
                }
            }
            // console.log('COUNT: ' + count);
            if (count == 100) {
                return true;
                count = 0;
            }
        }


        return false;
    };

    removeFlat = function (staticBlocks, x, y, z) {
        //console.log('REMOVE');
        var y = y;

        for (var i = 0; i < Tetris.gameFieldConfig.segmentWidth; i += 1) {

            for (var j = 0; j < Tetris.gameFieldConfig.segmentWidth; j += 1) {

                if (staticBlocks[i] && staticBlocks[i][y] && staticBlocks[i][y][j]) {
                    Tetris.scene.remove(staticBlocks[i][y][j]);
                }
            }
        }
    };

    moveFlatDown = function (staticBlocks, y) {
        // console.log("Y in flat down: " + y);
        // loop from the flat to remove to the upper one
        /* console.log('STATICS BEFORE:');
         console.log(staticBlocks);
         console.log('~~~~~~~~~~~~~~`');*/

        for (var index = y; index < Tetris.gameFieldConfig.segmentWidth - 2; index += 1) {
            for (var x = 0; x < Tetris.gameFieldConfig.segmentWidth; x += 1) {

                /* console.log('X :' + x);
                 console.log('INDEX: ' + index);
                 console.log(staticBlocks[x][index]);
                 console.log(staticBlocks[x][index + 1]);
                 console.log('=========');*/

                if (staticBlocks[x][index + 1]) {
                    staticBlocks[x][index] = staticBlocks[x][index + 1];

                    for (var z = 0; z < Tetris.gameFieldConfig.segmentWidth; z += 1) {
                        if (staticBlocks[x][index][z]) {
                            /* console.log('ELEMENT with y??: ');
                             console.log(staticBlocks[x][index][z]);
                             console.log('============##===========');*/
                            staticBlocks[x][index][z].position.y -= Tetris.blockSize;
                        }

                    }
                }
                if (staticBlocks[x][index] && staticBlocks[x][index].length != 0) {  // if now is []
                    staticBlocks[x][index] = undefined;
                }
            }


        }
        /*  console.log('STATICS AFTER:');
         console.log(staticBlocks);
         console.log('~~~~~~~~~~~~~~`');

         console.log('UP:');*/
        //console.log(staticBlocks[x][9]);
        // staticBlocks[x][9] = [];
        //console.log(staticBlocks[x][9]);
    };


    testCleanUpRow = function () {
        console.log('~~~~~~~~~~~~~~~~~~~');
        console.log('TEST CLEANING ROW: function testCleanUpRow() called in getEngine. Removable: true :D');
        console.log('~~~~~~~~~~~~~~~~~~~~');

        var y = -270; // the most bottom y

        for (var j = 0; j < Tetris.gameFieldConfig.segmentWidth; j += 1) {
            var x = getCoordinates(j);

            for (var i = 0; i < Tetris.gameFieldConfig.segmentWidth; i += 1) {
                var z = getCoordinates(i);

                if (staticBlocks[x] === undefined) staticBlocks[x] = [];
                if (staticBlocks[x][y] === undefined) staticBlocks[x][y] = [];

                var mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize),
                    new THREE.MeshBasicMaterial({color: Utilities.Colors[Math.floor(Math.random() * 6)]})
                );

                mesh.overdraw = true;
                // console.log("X: " + x, " Y " + y + " Z " + z);

                mesh.position.x = x;
                mesh.position.y = y;
                mesh.position.z = z;
                if (x != 270 && y != 270) {
                    Tetris.scene.add(mesh);
                }
                staticBlocks[i][0][j] = mesh;
            }
        }
//staticBlocks[0][0][0] = undefined;
        return staticBlocks;
    };

    testCleanUpRowWithMoreElements = function () {
        console.log('~~~~~~~~~~~~~~~~~~~');
        console.log('TEST CLEANING ROW #2: function testCleanUpRowWithMoreElements() called in getEngine. Removable: true :D');
        console.log('~~~~~~~~~~~~~~~~~~~~');

        // var y = -270; // the most bottom y
        for (var k = 0; k < 3; k += 1) {
            var y = getCoordinates(k);

            for (var j = 0; j < Tetris.gameFieldConfig.segmentWidth; j += 1) {
                var x = getCoordinates(j);

                for (var i = 0; i < Tetris.gameFieldConfig.segmentWidth; i += 1) {
                    var z = getCoordinates(i);

                    if (staticBlocks[x] === undefined) staticBlocks[x] = [];
                    if (staticBlocks[x][y] === undefined) staticBlocks[x][y] = [];

                    var mesh = new THREE.Mesh(
                        new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize),
                        new THREE.MeshBasicMaterial({color: Utilities.Colors[Math.floor(Math.random() * 6)]})
                    );

                    mesh.overdraw = true;
                    // console.log("X: " + x, " Y " + y + " Z " + z);

                    mesh.position.x = x;
                    mesh.position.y = y;
                    mesh.position.z = z;
                    Tetris.scene.add(mesh);
                    staticBlocks[x][y][z] = mesh;
                }
                if (k == 2 && j == 5) {
                    return;
                }
            }
        }
    };

    init = function () {
        Tetris.initScene();
        controls = new THREE.OrbitControls(Tetris.camera, Tetris.renderer.domElement);
        Block.init(Tetris.blockSize);
        Controller.getController(Block, Tetris, Utilities).run();
        Utilities.cleanScreen();
        generateBlock();
    };

    run = function () {

        var collisionType;

        time = Date.now();
        frameTimeDifference += time - lastFrameTime;
        lastFrameTime = time;

        if (frameTimeDifference > gameStepTime) {

            frameTimeDifference = 0;

            Block.move(0, -Tetris.blockSize, 0);

            collisionType = checkCollision();

            if (collisionType.GROUND == true || collisionType.StaticBlock == true) {
                Block.move(0, Tetris.blockSize, 0);
                changeStateToStatic(Block.shape);
                Tetris.scene.remove(Block.shape);
                generateBlock();
                collisionType = checkCollision();
                if (collisionType.StaticBlock == true) {
                    endGameUIFunction();
                }
            }
        }

        Tetris.renderer.render(Tetris.scene, Tetris.camera);
        //Tetris.stats.update();
        controls.update();
        requestAnimationFrame(run);
    };


    return {
        getEngine: function (tetris, block, utilities, endGameFunction) {
            this.Tetris = tetris;
            this.Block = block;
            this.Utilities = utilities;
            endGameUIFunction = endGameFunction;
            init();
            staticBlocks = [];
            return this;
        },
        run: run,
        test: function(){
            return{
                blocks:staticBlocks.slice()
            }
        }

    }
}();

