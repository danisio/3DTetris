var Engine = function () {
    var typeIndex, baseGeometry, additionalGeometry,
        generateBlock, getNewShapeSkeleton, drawBlock,
        setBlockPosition, joinSubElements, getAvailableMesh,
        setUp, render, controls, x, y, z;

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

    generateBlock = function () {
        Block.shape = []; // nullify
        Block.mesh = [];
        getNewShapeSkeleton();
        drawBlock();
        setBlockPosition();
        Block.shape.name = "test";
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

            joinSubElements(baseGeometry, additionalGeometry);
        }

        Block.shape = baseGeometry;
        return this;
    };

    setBlockPosition = function () {// TODO: make [boundingBoxConfig.segmentHeigh] public
        Block.position.x = Math.floor(Math.random() * 10 - Tetris.blockSize / 2);
        Block.position.z = Math.floor(Math.random() * 10 - Tetris.blockSize / 2);

        Block.position.y = Tetris.gameFieldConfig.height / 2 + Tetris.blockSize / 2; // TODO: tuning
        Block.shape.position = new THREE.Vector3(
            Block.position.x,
            Block.position.y,
            Block.position.z);


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
            return new THREE.Mesh(
                new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize),
                new THREE.MeshBasicMaterial({color: randColor})
            );
        }
    }

    setUp = function () {
        Tetris.initScene();
        controls = new THREE.OrbitControls(Tetris.camera, Tetris.renderer.domElement);
        Block.initializeBlock(Tetris.blockSize);
        Utilities.cleanScreen();
        generateBlock();
        // document.addEventListener('onkeypress', onKeyPress, false);
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
        for (var index = 0; index < Block.shape.children.length; index += 1) {

            var child = Block.shape.children[index];
            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition( child.matrixWorld );

            if ((vector.y - (Tetris.blockSize / 2)) <= -(Tetris.gameFieldConfig.height / 2 )) { //Bottom collision
                console.log("Bottom collision: x: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
                return Tetris.collisionObject.GROUND;
            }

            if(vector.x - (Tetris.blockSize / 2) <= -(Tetris.gameFieldConfig.width / 2) || vector.x + (Tetris.blockSize / 2) >= (Tetris.gameFieldConfig.width) / 2) {
                console.log("X Wall collision: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
                return Tetris.collisionObject.WALL;
                //alert("Wall collision");
            }

            if(vector.z - (Tetris.blockSize / 2) <= -(Tetris.gameFieldConfig.width / 2) || vector.z + (Tetris.blockSize / 2) >= (Tetris.gameFieldConfig.width) / 2) {
                console.log("X Wall collision: " + vector.x + ", y: " + vector.y + ", z:" + vector.z);
                return Tetris.collisionObject.WALL;
                //alert("Wall collision");
            }
        }

        /*else if(Math.abs(Block.shape.position.x) <= Tetris.blockSize / 2 || (Block.shape.position.x >= Tetris.gameFieldConfig.width - 1) / Tetris.gameFieldConfig.blockSize) {
         alert("X wall collision.");
         } else if(Math.abs(Block.shape.position.z) <= Tetris.blockSize / 2 ||(Block.shape.position.x >= Tetris.gameFieldConfig.width - 1) / Tetris.gameFieldConfig.blockSize) {
         alert("Z wall collision");
         } */
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

        //FIXME: Why called twice, better no
        Block.moveByUser(AXIS.X, key);
        Block.moveByUser(AXIS.Z, key);
    }


    // Static blocks

    // TODO: Make staticBlocks 3-dimentional matrix. If it just add all subBlocks one by one we cant find a special flast to be removed
    var staticBlocks = [];

    changeStateToStatic = function (block) {

        for (var subBlock = 0; subBlock < block.children.length; subBlock += 1) {
            console.log('LENGTH' + block.children.length);
            block.children[subBlock].position.y += block.position.y;
            block.children[subBlock].position.x += block.position.x;
            block.children[subBlock].position.z += block.position.z;
            console.log(block.children[subBlock]);
            staticBlocks.push(block.children[subBlock]);
        }

        // [!] really important this loop to be outside the upper one.
        // When you add the child to the scene, it is deleted from the block.children list!
        for (var ind = 0; ind < staticBlocks.length; ind += 1) {
            var test = staticBlocks[ind];
            Tetris.scene.add(test);
        }
    };    // end static block

    var lastFrameTime = Date.now();
    var gameStepTime = 1000;
    var frameTimeDifference = 0;

    render = function () {

        var time = Date.now();
        frameTimeDifference += time - lastFrameTime;
        lastFrameTime = time;
        if (frameTimeDifference > gameStepTime) {
            frameTimeDifference = 0;

            for(var i = 0; i < Tetris.blockSize; i++) {
                var collisionType = checkCollision(true);
                if (collisionType == Tetris.collisionObject.GROUND) {
                    changeStateToStatic(Block.shape);
                    Tetris.scene.remove(Block.shape);
                    //Tetris.renderer.render(Tetris.scene, Tetris.camera);
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

    return {

        getEngine: function (block, tetris, utilities) {
            this.Tetris = tetris;
            this.Block = block;
            this.Utilities = utilities;
            setUp();
            return this;
        },
        run: render
    }

}();
