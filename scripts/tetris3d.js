var Tetris = function () {
    var renderer, render_stats, physics_stats, scene, camera;

    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,
        NEAR = 0.1,
        FAR = 2000,

        GRAVITY_VECTOR = -100,
        GROUND_HEIGHT = 1,
        BLOCK_MASS = 10,

        GAMEFIELD_CONFIG = {
            width: 600,
            height: 600,
            depth: 600,

            segmentWidth: 10,
            segmentHeight: 10,
            segmentDepth: 10
        },
        COLLISION_OBJECT = {
            GROUND: 1,
            WALLX: 2,
            WALLZ: 3,
            STATIC_BLOCK: 4
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
            scene.addEventListener('update', function () {
                    scene.simulate(undefined, 1);
                    physics_stats.update();
                }
            );
        }

        // camera.updateProjectionMatrix(); needed only for Orthographic camera
        camera.position.set(CAMERA_POSITION.X, CAMERA_POSITION.Y, CAMERA_POSITION.Z);
        camera.lookAt(scene.position);
        scene.add(camera);
        // End of basic setup

        // Ground
        var size = 300, step = BLOCK_SIZE;
        var geometry = new THREE.Geometry();

        for (var i = -size; i <= size; i += step) {
            geometry.vertices.push(new THREE.Vector3(-size, -size, i));
            geometry.vertices.push(new THREE.Vector3(size, -size, i));
            geometry.vertices.push(new THREE.Vector3(i, -size, -size));
            geometry.vertices.push(new THREE.Vector3(i, -size, size));
        }

        var material = new THREE.LineBasicMaterial({color: 0xA3DA2E, opacity: 0.9, transparent: true});
        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        scene.add(line);
        // end of ground

        // Gamefield - the big cube
        var boundingBoxGeometry = new THREE.BoxGeometry(GAMEFIELD_CONFIG.width, GAMEFIELD_CONFIG.height, GAMEFIELD_CONFIG.depth,
            GAMEFIELD_CONFIG.segmentWidth, GAMEFIELD_CONFIG.segmentHeight, GAMEFIELD_CONFIG.segmentDepth);
        var boundingBox = new THREE.Mesh(
            boundingBoxGeometry,
            new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.05}), 0);

        scene.add(boundingBox);

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
        // end of game field
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
