var Engine = function () {
    var typeIndex, baseGeometry, additionalGeometry,
        controls, x, y, z, staticBlocks,
        lastFrameTime, gameStepTime, frameTimeDifference, time,

    // Test Functions
        testCleanUpRow, testCleanUpRowWithMoreElements,
    // Help Functions
        joinSubElements, getAvailableMesh, getCoordinates, getIndexByCoordinates,
    // Main Functions
        generateBlock, getNewShapeSkeleton, drawBlock,
        setBlockPosition, changeStateToStatic,
        checkFullFlat, removeFlat, moveFlatDown,
        setUp, render;

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
        // (m * Tetris.blockSize - (Tetris.gameFieldConfig.width / 2)) + (Tetris.blockSize / 2) = index
        // (m * Tetris.blockSize - (Tetris.gameFieldConfig.width / 2)) = index  - (Tetris.blockSize/2);
        //  m * Tetris.blockSize = (Tetris.gameFieldConfig.width / 2) + index - (Tetris.blockSize/2);
        // m = (Tetris.gameFieldConfig.width / 2) + index  - (Tetris.blockSize/2) / Tetris.blockSize;
    };

    getIndexByCoordinates = function (c) {
        return ((Tetris.gameFieldConfig.width / 2) + c - (Tetris.blockSize / 2)) / Tetris.blockSize;
    }

    generateBlock = function () {
        Block.shape = []; // nullify
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

            var cubeOutline = new THREE.EdgesHelper(additionalGeometry, 0x1f1f1f);
            cubeOutline.material.linewidth = 2;
            Tetris.scene.add(cubeOutline);

            joinSubElements(baseGeometry, additionalGeometry);
        }


        Block.shape = baseGeometry;
        return this;
    };

    setBlockPosition = function () {// TODO: make [boundingBoxConfig.segmentHeigh] public
        Block.shape.position.x = 30;//Math.floor(Math.random() * 10 - Tetris.blockSize / 2);
        Block.shape.position.z = 30;//Math.floor(Math.random() * 10 - Tetris.blockSize / 2);

        Block.shape.position.y = Tetris.gameFieldConfig.height / 2; // TODO: tuning
        /*Block.shape.position = new THREE.Vector3(
         Block.position.x,
         Block.position.y,
         Block.position.z); */


        Block.shape.rotation = {x: 0, y: 0, z: 0};
        Block.shape.overdraw = true;

        return this;
    };

    joinSubElements = function (base, additional) {
        baseGeometry.add(additionalGeometry);
    };

    getAvailableMesh = function () {
        if (Physijs) {
            return new Physijs.BoxMesh(
                new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize),
                new THREE.MeshBasicMaterial({color: randColor},
                    PHYSI_MESH_CONSTS.FRICTION,
                    PHYSI_MESH_CONSTS.RESTITUTION),
                PHYSI_MESH_CONSTS.MASS
            );
        }

        else {

            /* return new THREE.SceneUtils.createMultiMaterialObject(new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), [
             new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
             new THREE.MeshBasicMaterial({color: randColor})
             ]);*/

            return new THREE.Mesh(
                new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize),
                new THREE.MeshBasicMaterial({color: randColor, transperant: true})
            );
        }
    };

    checkCollision = function () {

        //FIXME: Must be moved out of here
        Tetris.scene.updateMatrixWorld();
        Block.shape.updateMatrixWorld();

        /*        console.log("x: " + Block.shape.position.x + ", y: " + Block.shape.position.y + ", z:" + Block.shape.position.z);
         for (var index = 0; index < Block.shape.children.length; index += 1) {
         var vector = new THREE.Vector3();
         vector.setFromMatrixPosition( Block.shape.children[index].matrixWorld );
         console.log("x: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
         */
        var collisionType = {};

        for (var index = 0; index < Block.shape.children.length; index += 1) {

            var child = Block.shape.children[index];
            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition(child.matrixWorld);


            if ((vector.y - (Tetris.blockSize / 2)) <= -(Tetris.gameFieldConfig.height / 2 )) { //Bottom collision
                // console.log("Bottom collision: x: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
                collisionType.GROUND = true;
                //break;
            }

            if (vector.x - (Tetris.blockSize / 2) <= -(Tetris.gameFieldConfig.width / 2)) {
                //console.log("X Wall collision: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
                //     collisionType = Tetris.collisionObject.WALLX;
                collisionType.WALLXNegative = true;
                //alert("Wall collision");
            }

            if (vector.x + (Tetris.blockSize / 2) >= (Tetris.gameFieldConfig.width) / 2) {
                collisionType.WALLXPositive = true;
            }

            if (vector.z - (Tetris.blockSize / 2) <= -(Tetris.gameFieldConfig.width / 2)) {
                //console.log("X Wall collision: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
                //    collisionType = Tetris.collisionObject.WALLZ;
                collisionType.WALLZNegative = true;

                //alert("Wall collision");
            }

            if (vector.z + (Tetris.blockSize / 2) >= (Tetris.gameFieldConfig.depth) / 2) {
                collisionType.WALLZPositive = true;
            }
        }

        /*else if(Math.abs(Block.shape.position.x) <= Tetris.blockSize / 2 || (Block.shape.position.x >= Tetris.gameFieldConfig.width - 1) / Tetris.gameFieldConfig.blockSize) {
         alert("X wall collision.");
         } else if(Math.abs(Block.shape.position.z) <= Tetris.blockSize / 2 ||(Block.shape.position.x >= Tetris.gameFieldConfig.width - 1) / Tetris.gameFieldConfig.blockSize) {
         alert("Z wall collision");
         } */

        return collisionType;
    };

    function moveToStaticBlocks(staticBlocks, element) {
        var x = element.position.x,
            y = element.position.y, // -270
            z = element.position.z;
        // console.log('X ' + x + ' Y ' + y + ' Z ' + z);
        var coord = ((Tetris.gameFieldConfig.width / 2) + y - (Tetris.blockSize / 2)) / Tetris.blockSize;
        console.log(coord);
        if (!staticBlocks[x]) {
            staticBlocks[x] = [];
        }
        if (!staticBlocks[x][y]) {
            staticBlocks[x][y] = [];
        }
        staticBlocks[x][y][z] = element;
        var isFlatFull = checkFullFlat(staticBlocks, element, x, y, z);

        if (!isFlatFull) {
            //console.log("Not FULL");
            Tetris.scene.add(staticBlocks[x][y][z]);
        }
        else {
            removeFlat(staticBlocks, x, y, z);
            // TODO: 
            moveFlatDown(staticBlocks, x, y, z);
        }
    }

    changeStateToStatic = function (block) {

        for (var subBlock = 0; subBlock < block.children.length; subBlock += 1) {
            block.children[subBlock].position.y += block.position.y;
            block.children[subBlock].position.x += block.position.x;
            block.children[subBlock].position.z += block.position.z;
            var newStatic = block.children[subBlock].clone();
            moveToStaticBlocks(staticBlocks, newStatic);
        }

    };

    checkFullFlat = function (staticBlocks, element, x, y, z) {
        staticBlocks[x][y][z] = element;
        var maxCubesCount = Tetris.gameFieldConfig.segmentWidth;

        for (var j = 0; j < maxCubesCount; j += 1) {
            var axis_Y = getCoordinates(j);
            var count = 0; // because we search a flat

            for (var i = 0; i < maxCubesCount; i += 1) {
                var axis_X = getCoordinates(i);

                for (var k = 0; k < maxCubesCount; k += 1) {
                    var axis_Z = getCoordinates(k);
                    // DEBUG: console.log("X " + x + " Y " + y + " Z" + z);
                    if (staticBlocks[axis_X] && staticBlocks[axis_X][axis_Y] && staticBlocks[axis_X][axis_Y][axis_Z]) {
                        // console.log(staticBlocks[axis_X][axis_Y][axis_Z]);
                        // console.log('~~~~~~~~~~~~~~');
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
        console.log('REMOVE');
        for (var k = 0; k < Tetris.gameFieldConfig.segmentWidth; k += 1) {
            var index_Y = getCoordinates(k);

            for (var i = 0; i < Tetris.gameFieldConfig.segmentWidth; i += 1) {
                var index_X = getCoordinates(i);

                for (var j = 0; j < Tetris.gameFieldConfig.segmentWidth; j += 1) {

                    var index_Z = getCoordinates(j);
                    if (staticBlocks[index_X] && staticBlocks[index_X][index_Y] && staticBlocks[index_X][index_Y][index_Z]) {

                        Tetris.scene.remove(staticBlocks[index_X][index_Y][index_Z]);
                        //staticBlocks[index_X][index_Y][index_Z] = 'EMPTY';
                    }

                }

            }
        }
    };

    moveFlatDown = function (staticBlocks, x, y, z) {
        var index = getIndexByCoordinates(y);

        // loop from the flat to remove to the upper one
        for (var index = 0; index < Tetris.gameFieldConfig.segmentWidth - 1; index += 1) { // -1 ?
            var currentY = getCoordinates(index);
            var upperY = getCoordinates(index + 1);
            staticBlocks[x][currentY] = staticBlocks[x][upperY];
        }
        staticBlocks[x][270] = [];
    };

    setUp = function () {
        Tetris.initScene();
        controls = new THREE.OrbitControls(Tetris.camera, Tetris.renderer.domElement);
        Block.initializeBlock(Tetris.blockSize);
        Utilities.cleanScreen();
        generateBlock();
        // document.addEventListener('onkeypress', onKeyPress, false);
    };

    window.onkeyup = function (e) {

        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 88) {
            Block.rotate(AXIS.X);
        }

        if (key == 89) {
            Block.rotate(AXIS.Y);
        }

        if (key == 90) {
            Block.rotate(AXIS.Z);

        }

        else {
            Block.moveByUser(AXIS.X, key);
            Block.moveByUser(AXIS.Z, key);
        }
    };

    var lastFrameTime = Date.now();
    var gameStepTime = 1000;
    var frameTimeDifference = 0;

    render = function () {

        time = Date.now();
        frameTimeDifference += time - lastFrameTime;
        lastFrameTime = time;

        if (frameTimeDifference > gameStepTime) {
            frameTimeDifference = 0;

            for (var i = 0; i < Tetris.blockSize; i++) {

                var collisionType = checkCollision(true);

                if (collisionType.GROUND == true) {
                    changeStateToStatic(Block.shape);
                    Tetris.scene.remove(Block.shape);
                    //Tetris.renderer.render(Tetris.scene, Tetris.camera);
                    //console.dir(staticBlocks);
                    generateBlock();
                    break;
                }
                Block.move(0, -1, 0);
            }
            Tetris.renderer.render(Tetris.scene, Tetris.camera);
        }
        Tetris.renderer.render(Tetris.scene, Tetris.camera);
        Tetris.stats.update();
        controls.update();
        requestAnimationFrame(render);
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
                Tetris.scene.add(mesh);
                staticBlocks[x][y][z] = mesh;
            }
        }
    };

    testCleanUpRowWithMoreElements = function () {
        console.log('~~~~~~~~~~~~~~~~~~~');
        console.log('TEST CLEANING ROW: function testCleanUpRow() called in getEngine. Removable: true :D');
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


    return {

        getEngine: function (block, tetris, utilities) {
            this.Tetris = tetris;
            this.Block = block;
            this.Utilities = utilities;
            setUp();
            staticBlocks = [];
            //testCleanUpRow();
           // testCleanUpRowWithMoreElements();
            return this;
        },
        run: render
    }
}();

