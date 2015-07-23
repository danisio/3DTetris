/**
 * Created by Solara on 21/07/2015.
 */
window.onload = function () {


    var Tetris = {};

    Tetris.init = function () {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        // TODO: delete, because im not going to use this kind of camera
        // set some camera attributes
        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 1,
            FAR = 10000;

        Tetris.renderer = new THREE.WebGLRenderer();
        Tetris.camera = new THREE.OrthographicCamera(
            WIDTH / -2,
            WIDTH / 2,
            HEIGHT / 2,
            HEIGHT / -2,
            NEAR,
            FAR);
        Tetris.camera.updateProjectionMatrix();
        Tetris.scene = new Physijs.Scene;

        // the camera starts at 0,0,0 so pull it back
        Tetris.camera.position.z = 600;
        Tetris.scene.add(Tetris.camera);
        //  Tetris.scene.setGravity(new THREE.Vector3(-10,0,0));

        // start the renderer
        Tetris.renderer.setSize(WIDTH, HEIGHT);

        // attach the render-supplied DOM element
        document.body.appendChild(Tetris.renderer.domElement);

        var boundingBoxConfig = {
            width: 360,
            height: 360,
            depth: 360,
            segmentWidth: 6,
            segmentHeight: 6,
            segmentDepth: 6
        };


        Tetris.blockSize = boundingBoxConfig.width / boundingBoxConfig.splitX;

        // Test camera coordinates with texture
        var texture = THREE.ImageUtils.loadTexture('textures/crate2.gif');
        texture.anisotropy = Tetris.renderer.getMaxAnisotropy();

        // var material = new THREE.MeshBasicMaterial({map: texture});
        // ent test

        var boundingBox = new Physijs.BoxMesh(
            new THREE.BoxGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, boundingBoxConfig.segmentWidth, boundingBoxConfig.segmentHeight, boundingBoxConfig.segmentDepth),
            new THREE.MeshBasicMaterial({color: 0xffaa00, wireframe: true}, .8, .4),
            0
            //new THREE.MeshBasicMaterial({map: texture})
        );
//ground test
        var ground_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/crate.gif')}),
            .8, // high friction
            .4 // low restitution
        );
        ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
        ground_material.map.repeat.set(2.5, 2.5);

        // Ground
        ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(50, 1, 50),
            //new THREE.PlaneGeometry(50, 50),
            ground_material,
            0 // mass
        );
        Tetris.scene.add(ground);
//
        Tetris.scene.add(boundingBox);


        Tetris.renderer.render(Tetris.scene, Tetris.camera);


    };
    Tetris.init();
    //bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    /*var cube = new THREE.Mesh(
     new THREE.BoxGeometry(60, 60, 60),
     new THREE.MeshBasicMaterial({color: 0x00ff00})
     //THREE.MeshLambertMaterial({ opacity: 0, transparent: true })

     );
     var cube2 = new THREE.Mesh(
     new THREE.BoxGeometry(100, 100, 100),
     new THREE.MeshBasicMaterial({color: 0x0000ff})
     //THREE.MeshLambertMaterial({ opacity: 0, transparent: true })

     );*/

   var geometry = new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize);
    for(var i = 1 ; i < 10; i++) {
       var tmpGeometry = new THREE.Mesh(new THREE.BoxGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize));
        tmpGeometry.position.x = 100 + i;
        tmpGeometry.position.y = 10 + i;
        //console.log(tmpGeometry);
        geometry.merge( tmpGeometry.geometry);
    }

   var mesh = THREE.Mesh(geometry,
        new THREE.MeshBasicMaterial({color: 0x00ff00})
    );
    Tetris.scene.add(mesh);
    console.log(mesh);
    /*Tetris.scene.add(cube);
     Tetris.scene.add(cube2);*/
    var movement = 0;

    function loop() {
        Tetris.scene.simulate();
        //cube.position.y = movement;
        //geometry.position.y = movement;
        Tetris.camera.lookAt(Tetris.scene.position);
        var timer = new Date().getTime() * 0.0005;

        Tetris.camera.position.x = Math.floor(Math.cos(timer) * 200);
        Tetris.camera.position.y = Math.floor(Math.sin(timer) * 200);

        /*Tetris.camera.position.x = timer;
         Te*/
        // tris.camera.position.z = timer + 30;
        Tetris.renderer.render(Tetris.scene, Tetris.camera);
        movement -= 1;

    }

    animate();
    function animate() {
        // Defined in the RequestAnimationFrame.js file, this function means that the
        // animate function is called upon timeout:
        requestAnimationFrame(animate);
        loop();

    }
}
//window.addEventListener("load", Tetris.init);