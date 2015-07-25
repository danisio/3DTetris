THREE.OrbitControls = function (object, domElement) {
    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.enabled = true;
    this.center = new THREE.Vector3();
    this.userRotate = true;
    this.userRotateSpeed = 1.0;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI / 2; // radians
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minAzimuthAngle = -Math.PI / 3;
    this.maxAzimuthAngle = Math.PI / 3;

    // internals
    var self = this,
        EPS = 0.000001,
        PIXELS_PER_ROUND = 1800,

        rotateStart = new THREE.Vector2(),
        rotateEnd = new THREE.Vector2(),
        rotateDelta = new THREE.Vector2(),

        phiDelta = 0,
        thetaDelta = 0,
        scale = 1,
        lastPosition = new THREE.Vector3(),

        STATE = {
            NONE: -1,
            ROTATE: 0
        },
        state = STATE.NONE;

    // events
    var changeEvent = {
        type: 'change'
    };

    this.rotateLeft = function (angle) {
        if (angle === undefined) {
            angle = getAutoRotationAngle();
        }

        thetaDelta -= angle;
    };

    this.rotateUp = function (angle) {
        if (angle === undefined) {
            angle = getAutoRotationAngle();
        }

        phiDelta -= angle;
    };

    this.update = function () {
        var position = this.object.position;
        var offset = position.clone().sub(this.center);

        // angle from z-axis around y-axis
        var theta = Math.atan2(offset.x, offset.z);

        // angle from y-axis
        var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

        if (this.autoRotate) {
            this.rotateLeft(getAutoRotationAngle());
        }

        theta += thetaDelta;
        phi += phiDelta;

        // restrict theta to be between desired limits
        theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta));

        // restrict phi to be between desired limits
        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

        // restrict phi to be between EPS and PI-EPS
        phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

        var radius = offset.length() * scale;

        // restrict radius to be between desired limits
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

        offset.x = radius * Math.sin(phi) * Math.sin(theta);
        offset.y = radius * Math.cos(phi);
        offset.z = radius * Math.sin(phi) * Math.cos(theta);

        position.copy(this.center).add(offset);

        this.object.lookAt(this.center);

        thetaDelta = 0;
        phiDelta = 0;
        scale = 1;

        if (lastPosition.distanceTo(this.object.position) > 0) {
            this.dispatchEvent(changeEvent);
            lastPosition.copy(this.object.position);
        }
    };

    function getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * self.autoRotateSpeed;
    }

    function onMouseDown(event) {
        if (self.enabled === false) return;
        if (self.userRotate === false) return;

        event.preventDefault();

        if (state === STATE.NONE) {
            if (event.button === 0)
                state = STATE.ROTATE;
        }

        if (state === STATE.ROTATE) {
            rotateStart.set(event.clientX, event.clientY);
        }

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
    }

    function onMouseMove(event) {
        if (self.enabled === false) return;

        event.preventDefault();

        if (state === STATE.ROTATE) {
            rotateEnd.set(event.clientX, event.clientY);
            rotateDelta.subVectors(rotateEnd, rotateStart);

            self.rotateLeft(2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * self.userRotateSpeed);
            self.rotateUp(2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * self.userRotateSpeed);

            rotateStart.copy(rotateEnd);
        }
    }

    function onMouseUp(event) {
        if (self.enabled === false) return;
        if (self.userRotate === false) return;

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        state = STATE.NONE;
    }

    //disable right click
    this.domElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, false);

    this.domElement.addEventListener('mousedown', onMouseDown, false);

};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
