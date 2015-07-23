var Tetris = Tetris || {};

var initScene, render, _boxes = [], spawnBox,
    renderer, render_stats, physics_stats, scene, ground_material, ground, light, camera, blockSize, boundingBoxConfig;
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    NEAR = 1,
    FAR = 1000,
    GRAVITY_VECTOR = -100,

    GAMEFIELD_WIDTH = 420,
    GAMEFIELD_HEIGHT = 420,
    GAMEFIELD_DEPTH = 420,
    GROUND_HEIGHT = 1,

    BLOCK_MASS = 10;
var CAMERA_POSITION = {
    X:250,
    Y:250,
    Z:250
};

initScene = function () {
    // Basic setup for the rendere, camera and scene. We have to do it just once.
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '0px';
    render_stats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(render_stats.domElement);

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(physics_stats.domElement);

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, GRAVITY_VECTOR, 0));
    scene.addEventListener(
        'update',
        function () {
            scene.simulate(undefined, 1);
            physics_stats.update();
        }
    );

    camera = new THREE.OrthographicCamera(
        WIDTH / -2,
        WIDTH / 2,
        HEIGHT / 2,
        HEIGHT / -2,
        NEAR,
        FAR);
    camera.updateProjectionMatrix();
    camera.position.set(CAMERA_POSITION.X, CAMERA_POSITION.Y, CAMERA_POSITION.Z);
    //camera.position.z = 600;
    camera.lookAt(scene.position);
    scene.add(camera);

    // End of basic setup

    // Ground
    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({color: 0x888888}),
        .9, // high friction
        .0 // low restitution
    );
    // Next lines are usable only if the ground has a texture, not just color
    // ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    // ground_material.map.repeat.set(3, 3);

    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(420, 1, 420),
        ground_material,
        0 // Mass. If the mass of the ground is > 0 it will fall down
    );
    ground.receiveShadow = true; // leaving this for now.. hope we can show where the element is going to fall through playing with shadows
    ground.position.y -= 176; // If the coordinates are not set, defaults are in the center of the scene.
    scene.add(ground);

    // Gamefield - the big cube
    boundingBoxConfig = {
        width: 420,
        height: 420,
        depth: 420,
        segmentWidth: 6,
        segmentHeight: 6,
        segmentDepth: 6
    };

    blockSize = boundingBoxConfig.width / boundingBoxConfig.segmentWidth;

    var boundingBox = new THREE.Mesh(
        new THREE.BoxGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth,
            boundingBoxConfig.segmentWidth, boundingBoxConfig.segmentHeight, boundingBoxConfig.segmentDepth),
        new THREE.MeshBasicMaterial({color: 0xffaa00, wireframe: true}),
        // new THREE.MeshBasicMaterial({map: texture}),
        0
    );

    boundingBox.position.y = ground.position.y + boundingBoxConfig.width / 2 + 1;
    scene.add(boundingBox);

    requestAnimationFrame(render);
    scene.simulate();
};

Tetris.staticBlocks = [];

Tetris.Colors = [
    0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00, 0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
];

// After detection of collision of any block with the ground we should move every sub-element in Tetris,staticBlocks
// and remove it from Tetris.movableBlocks
// We can use another matrix for calculation sum of a flat/row to detect full flat or we can use
// some of the coordinates of the mesh for calculating
Tetris.addStaticBlock = function (x, y, z) {
    console.log('adding static block');
    if (Tetris.staticBlocks[x] === undefined) Tetris.staticBlocks[x] = [];
    if (Tetris.staticBlocks[x][y] === undefined) Tetris.staticBlocks[x][y] = [];

    // TODO:  mesh should implement Physijs.Mesh
    // Physi does not support creation of multi material objects (not really sure about that)
    var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.BoxGeometry(blockSize, blockSize, blockSize), [
        new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
        new THREE.MeshBasicMaterial({color: Tetris.zColors[z]})
    ]);

    // TODO: setting the position
    mesh.overdraw = true;

    scene.add(mesh);
    Tetris.staticBlocks[x][y][z] = mesh;
};

Tetris.movableBlocks = [];

Tetris.Utils = {};

Tetris.Utils.cloneVector = function (v) {
    return {x: v.x, y: v.y, z: v.z};
};

Tetris.Block = {};

// Optional shapes of the elements. We can add more
Tetris.Block.shapes = [
    [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 1, y: 2, z: 0}
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

Tetris.Block.position = {};

Tetris.Block.generate = function () {
    var geometry, tmpGeometry;

    var type = Math.floor(Math.random() * (Tetris.Block.shapes.length));
    this.blockType = type;

    // the current shape
    Tetris.Block.shape = [];

    for (var i = 0; i < Tetris.Block.shapes[type].length; i++) {
        Tetris.Block.shape[i] = Tetris.Utils.cloneVector(Tetris.Block.shapes[type][i]);
    }

    // the glue :D
       function buildBlockMesh() {
        randColor = Tetris.Colors[Math.floor(Math.random() * Tetris.Colors.length)];

        geometry = new Physijs.BoxMesh(
            new THREE.BoxGeometry(blockSize, blockSize, blockSize),
            new THREE.MeshBasicMaterial({color: randColor}, .9,.0)
        );
        for (var i = 1; i < Tetris.Block.shape.length; i++) {
            tmpGeometry = new Physijs.BoxMesh(new THREE.BoxGeometry(blockSize, blockSize, blockSize),
                new THREE.MeshBasicMaterial({color: randColor}),
                10);
            tmpGeometry.position.x = blockSize * Tetris.Block.shape[i].x;
            tmpGeometry.position.y = blockSize * Tetris.Block.shape[i].y;

            geometry.add(tmpGeometry);
            // Next lines are not supported in Physijs
            //tmpGeometry.updateMatrix();
            //geometry.merge(tmpGeometry.geometry, tmpGeometry.matrix);
            // THREE.GeometryUtils.merge(geometry, tmpGeometry);
        }

        return geometry;
    }

    Tetris.Block.mesh = buildBlockMesh();

    // point of creation of the new block
    Tetris.Block.position = {
        x: Math.floor(boundingBoxConfig.segmentWidth / 2) - 1,
        z: Math.floor(boundingBoxConfig.segmentHeight / 2) - 1,
        y: 155 // TODO: tuning
    };
    // have to be positive number !!! be carefull when changing the size of the segments
    Tetris.Block.mesh.position.x = (Tetris.Block.position.x - boundingBoxConfig.segmentWidth / 2);
    Tetris.Block.mesh.position.y = (Tetris.Block.position.y - boundingBoxConfig.segmentHeight / 2);
    Tetris.Block.mesh.position.z = (Tetris.Block.position.z - boundingBoxConfig.segmentDepth / 2);
    Tetris.Block.mesh.rotation = {x: 0, y: 0, z: 0};
    Tetris.Block.mesh.overdraw = true;

    Tetris.movableBlocks.push(Tetris.Block.mesh);
    console.log(Tetris.Block.mesh.position.y);
    scene.add(Tetris.Block.mesh);
};


window.onload = function(){
    initScene();

    // removing the infobar comming with Physijs
    var mainDiv = document.getElementById('viewport');
    var divs = mainDiv.getElementsByTagName('div');
    for (var ind = 0; ind < divs.length; ind += 1) {
        divs[ind].innerHTML = '';
    }

};

render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    render_stats.update();
    camera.lookAt(scene.position);

    // Moving the camera just for  demo
    var timer = new Date().getTime() * 0.0005;
    camera.position.x = Math.floor(Math.cos(timer) * 200);
    camera.position.z = Math.floor(Math.sin(timer) * 200);
};

// TODO: call this function only when the last block had collision with the ground
setInterval(Tetris.Block.generate, 5000);