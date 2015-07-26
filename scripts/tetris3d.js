var Tetris = function () {
    var initScene, render, renderer, render_stats, physics_stats, scene, camera,
        ground_material, ground, controls;

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
        COLLISION_OBJECT = {
            GROUND: 1,
            WALL: 2,
            STATIC_BLOCK: 3
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
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    function initScene() {
        // Basic setup for the render, camera and scene. We have to do it just once.
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


        var boundingBoxGeometry = new THREE.BoxGeometry(GAMEFIELD_CONFIG.width, GAMEFIELD_CONFIG.height, GAMEFIELD_CONFIG.depth,
            GAMEFIELD_CONFIG.segmentWidth, GAMEFIELD_CONFIG.segmentHeight, GAMEFIELD_CONFIG.segmentDepth);
        var boundingBox = new THREE.Mesh(
            boundingBoxGeometry,
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.05
            }),
            0
        );

        scene.add(boundingBox);

        if (Physijs) {
            scene.simulate();
            boundingBox.position.y = ground.position.y + GAMEFIELD_CONFIG.width / 2 + 1;
        }

        var outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xA3DA2E,
            transparent: true,
            opacity: 1,
            side: THREE.BackSide
        });

        var outlineMesh = new THREE.Mesh(boundingBoxGeometry, outlineMaterial);
        outlineMesh.position = boundingBox.position;
        outlineMesh.scale.multiplyScalar(1.01);
        scene.add(outlineMesh);
    }

    return {
        initScene: initScene,
        scene: scene,
        renderer: renderer,
        camera: camera,
        stats: render_stats,
        //  controls: getPerspectiveCameraControls(),
        blockSize: BLOCK_SIZE,

        //FIXME:
        gameFieldConfig: GAMEFIELD_CONFIG,
        collisionObject: COLLISION_OBJECT
    }

}();
