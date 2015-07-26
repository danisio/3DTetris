var Engine = function () {
    var typeIndex, baseGeometry, additionalGeometry,
        generateBlock, getNewShapeSkeleton, drawBlock,
        setBlockPosition, joinSubElements, getAvailableMesh,
        setUp, render, controls, x, y,z;

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
            //console.log(Block.shape[ind].x);
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
        Block.position.x = Math.floor(Math.random() * 6 - Tetris.blockSize / 2); // -1?
        Block.position.z = Math.floor(Math.random() * 6 - Tetris.blockSize / 2);
        Block.position.y = 155 // TODO: tuning

        Block.shape.position = new THREE.Vector3(
            Block.position.x,
            Block.position.y,
            Block.position.z);
        Block.shape.rotation = {x: 0, y: 0, z: 0};
        Block.shape.overdraw = true;

        return this;
    };

    joinSubElements = function (base, additional) {
        if (Physijs) {
            baseGeometry.add(additionalGeometry);
        }
        else {
            THREE.GeometryUtils.merge(base.geometry, additional);
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

    window.onkeyup = function(e){
        var key = e.keyCode ? e.keyCode : e.which;

        if(key == 90){
            console.log('KEY');
        Block.rotate(AXIS.Z);
            //Tetris.camera.add(Block.shape);
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
            render();
        }

        Tetris.renderer.render(Tetris.scene, Tetris.camera);
        Tetris.stats.update();
        controls.update();

        requestAnimationFrame(render);
        // TODO: if collision with ground is detected:
        // generateBlock();
    };

    // TODO: delete when collision events are implemented
    setInterval(generateBlock, 3000);

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
