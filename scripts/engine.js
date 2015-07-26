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
        getNewShapeSkeleton();
        drawBlock();
        setBlockPosition();

        Tetris.scene.add(Block.shape);

        return this;
    };

    getNewShapeSkeleton = function () {
        typeIndex = Math.floor(Math.random() * Utilities.Tetrominoes.length);
        for (var ind = 0; ind < Utilities.Tetrominoes[typeIndex].length; ind += 1) {

            Block.shape[ind] = Utilities.cloneVector(Utilities.Tetrominoes[typeIndex][ind]);
        }
        return this;
    };

    drawBlock = function () {
        randColor = Utilities.Colors[Math.floor(Math.random() * Utilities.Colors.length)];

        baseGeometry = getAvailableMesh();

        for (var i = 0; i < Block.shape.length; i++) {
            additionalGeometry = getAvailableMesh();
            additionalGeometry.position.x = Tetris.blockSize * Block.shape[i].x;
            additionalGeometry.position.y = Tetris.blockSize * Block.shape[i].y;

            joinSubElements(baseGeometry, additionalGeometry);
        }

        Block.shape = baseGeometry;
        return this;
    };

    setBlockPosition = function () {//boundingBoxConfig.segmentHeigh
        Block.shape.position.x = Math.floor(Math.random() * 6 - Tetris.blockSize / 2); // -1?
        Block.shape.position.z = Math.floor(Math.random() * 6 - Tetris.blockSize / 2);

        Block.shape.position.y = Tetris.gameFieldConfig.height / 2 + Tetris.blockSize / 2; // TODO: tuning
/*        Block.shape.position = new THREE.Vector3(
            Block.position.x,
            Block.position.y,
            Block.position.z);*/

        Block.shape.rotation = {x: 0, y: 0, z: 0};
        Block.shape.overdraw = true;

        return this;
    };

    joinSubElements = function (base, additional) {
        if (Physijs) {
            baseGeometry.add(additionalGeometry);
        }
        else {
            baseGeometry.add(additionalGeometry);
            // THREE.GeometryUtils.merge(base.geometry, additional);
        }
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

    checkCollision = function() {

        //Check for floor collision
        if(Block.shape.position.y <= -(Tetris.gameFieldConfig.height / 2)) {
            console.log("Y ground collision.");
            return Tetris.collisionObject.GROUND;
        }
        /*else if(Math.abs(Block.shape.position.x) <= Tetris.blockSize / 2 || (Block.shape.position.x >= Tetris.gameFieldConfig.width - 1) / Tetris.gameFieldConfig.blockSize) {
            alert("X wall collision.");
        } else if(Math.abs(Block.shape.position.z) <= Tetris.blockSize / 2 ||(Block.shape.position.x >= Tetris.gameFieldConfig.width - 1) / Tetris.gameFieldConfig.blockSize) {
            alert("Z wall collision");
        } */
    }

    window.onkeyup = function(e){

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
    }

    var lastFrameTime = Date.now();
    var gameStepTime = 1000;
    var frameTimeDifference = 0;

    render = function () {

        var time = Date.now();
        frameTimeDifference += time - lastFrameTime;
        lastFrameTime = time;

        while (frameTimeDifference > gameStepTime) {

            frameTimeDifference -= gameStepTime;
            Block.move(0, -1, 0);

            var collisionType = checkCollision();
            if(collisionType == Tetris.collisionObject.GROUND) {
                Tetris.scene.remove(Block.shape);
                generateBlock();
            }
            render();
            console.log("Falling block x: " + Block.shape.position.x + ", y: " + Block.shape.position.y + ", z: " + Block.shape.position.z);
        }

        Tetris.renderer.render(Tetris.scene, Tetris.camera);
        Tetris.stats.update();
        controls.update();

        requestAnimationFrame(render);
        // TODO: if collision with ground is detected:
        // generateBlock();
    };

    // TODO: delete when collision events are implemented

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
