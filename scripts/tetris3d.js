var Tetris = function () {
    var initScene, render, renderer, render_stats, physics_stats, scene, camera,
        ground_material, ground, contorls;

    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,
        NEAR = 0.1,
        FAR = 2000,

        GRAVITY_VECTOR = -100,
        GROUND_HEIGHT = 1,
        BLOCK_MASS = 10,

        GAMEFIELD_WIDTH = 420,
        GAMEFIELD_HEIGHT = 420,
        GAMEFIELD_DEPTH = 420,

        GAMEFIELD_CONFIG = {
            width: 420,
            height: 420,
            depth: 420,

            segmentWidth: 6,
            segmentHeight: 6,
            segmentDepth: 6
        },
        BLOCK_SIZE = GAMEFIELD_CONFIG.width / GAMEFIELD_CONFIG.segmentWidth;

    // Params for Perspective camera
    var VIEW_ANGLE = 30,
        ASPECT = WIDTH / HEIGHT;


    var CAMERA_POSITION = {
        X: 0,
        Y: 150,
        Z: 1500
    };

    renderer = new THREE.WebGLRenderer({antialias: true});

    if (Physijs.Scene) {
        scene = new Physijs.Scene
    } else {
        scene = new THREE.Scene();
    }

    render_stats = new Stats();
    /*camera = new THREE.OrthographicCamera(
     WIDTH / -2,
     WIDTH / 2,
     HEIGHT / 2,
     HEIGHT / -2,
     NEAR,
     FAR
     );*/

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    function initScene() {
        // Basic setup for the rendere, camera and scene. We have to do it just once.

        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        document.getElementById('viewport').appendChild(renderer.domElement);

        render_stats.domElement.style.position = 'absolute';
        render_stats.domElement.style.top = '0px';
        render_stats.domElement.style.zIndex = 100;
        document.getElementById('viewport').appendChild(render_stats.domElement);

        if (Physijs) {
            physics_stats = new Stats();
            physics_stats.domElement.style.position = 'absolute';
            physics_stats.domElement.style.top = '50px';
            physics_stats.domElement.style.zIndex = 100;
            document.getElementById('viewport').appendChild(physics_stats.domElement);

            scene.setGravity(new THREE.Vector3(0, GRAVITY_VECTOR, 0));
            scene.addEventListener(
                'update',
                function () {
                    scene.simulate(undefined, 1);
                    physics_stats.update();
                }
            );
        }

        // camera.updateProjectionMatrix(); needed only for Orthographic camera
        camera.position.set(CAMERA_POSITION.X, CAMERA_POSITION.Y, CAMERA_POSITION.Z);
        //camera.position.z = 600;
        camera.lookAt(scene.position);
        scene.add(camera);


        // End of basic setup

        // Ground
        if (Physijs) {
            ground_material = Physijs.createMaterial(
                new THREE.MeshBasicMaterial({color: 0x888899}),
                .9, // high friction
                .0 // low restitution
            );
            // Next lines are usable only if the ground has a texture, not just color
            // ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
            // ground_material.map.repeat.set(3, 3);

            ground = new Physijs.BoxMesh(
                new THREE.BoxGeometry(420, 1, 420),
                ground_material,
                0
            );
            ground.receiveShadow = true; // leaving this for now.. hope we can show where the element is going to fall through playing with shadows
            ground.position.y -= 176;    // If the coordinates are not set, defaults are in the center of the scene.
            scene.add(ground);
        }

        // Gamefield - the big cube

        var boundingBox = new THREE.Mesh(
            new THREE.BoxGeometry(GAMEFIELD_CONFIG.width, GAMEFIELD_CONFIG.height, GAMEFIELD_CONFIG.depth,
                GAMEFIELD_CONFIG.segmentWidth, GAMEFIELD_CONFIG.segmentHeight, GAMEFIELD_CONFIG.segmentDepth),
            new THREE.MeshBasicMaterial({color: 0xffaa00, wireframe: true}),
            0
        );

        scene.add(boundingBox);
        if (Physijs) {
            scene.simulate();
            boundingBox.position.y = ground.position.y + GAMEFIELD_CONFIG.width / 2 + 1;
        }

    };

    return {

        initScene: initScene,
        scene: scene,
        renderer: renderer,
        camera: camera,
        stats: render_stats,
      //  controls: getPerspectiveCameraControls(),
        blockSize: BLOCK_SIZE

    }

}();

//--------------  Block.js and Utilities.js copied | workaround for the problem with merging files --------------//

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

/**
 * Created by Solara on 24/07/2015.
 */
var Utilities = function () {
    var COLORS = [
        0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff,
        0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00,
        0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
    ];

    var TETROMINOES = [
        [
            {x: 1, y: 2, z: 0},
            {x: 1, y: 1, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: 0, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 1, y: 1, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0},
            {x: 1, y: 1, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 1, y: 1, z: 0},
            {x: 1, y: 2, z: 0}
        ]
    ];

    var cleanInfoBar = function () {
        var viewport, divCollection, ind;

        viewport = document.getElementById('viewport');
        divsCollection = viewport.getElementsByTagName('div');
        for (ind = 0; ind < divsCollection.length; ind += 1) {
            divsCollection[ind].innerHTML = '';
        }
    };

    var cloneVector = function (v) {
        return {x: v.x, y: v.y, z: v.z};
    };

    return {
        cleanScreen: cleanInfoBar,
        cloneVector: cloneVector,
        Colors: COLORS,
        Tetrominoes: TETROMINOES
    }
}();

