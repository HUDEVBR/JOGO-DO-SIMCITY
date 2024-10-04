import * as THREE from 'three';

export function createCamera(gameWindow) {
    const DEG2RAD = Math.PI / 180;

    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 2;
    const MAX_CAMERA_RADIUS = 10;
    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 180;
    const ROTATION_SENSITIVITY = 0.5;
    const ZOOM_SENSITIVITY = 0.02;
    const PAN_SENSITIVITY = -0.01;
    const Y_AXIS = new THREE.Vector3(0, 1, 0);
    const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
    let cameraOrigin = new THREE.Vector3();
    let cameraRadius = 4;
    let cameraAzimuth = 0;
    let cameraElevation = 0;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    updateCameraPosition();
    
    function onMouseDown(e) {
        console.log('mousedown')
        if (e.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = true
        }
        if (e.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = true;
        }
        if (e.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = true;
        }
    }

    function onMouseUp(e) {
        console.log('mouseup')
        if (e.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = false;
        }
        if (e.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = false;
        }
        if (e.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = false;
        }
    }

    function onMouseMove(e) {
        console.log('mousemove')

        const deltaX = (e.clientX - prevMouseX);
        const deltaY = (e.clientY - prevMouseY);

        //Maniipula a rotação da câmera
        if (isLeftMouseDown) {
            cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
            cameraElevation += (deltaY * ROTATION_SENSITIVITY);
            cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
            updateCameraPosition();
        }

        //Maniipula a panorâmica da câmera
        if (isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
            cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
            updateCameraPosition()
        }

        //Maniipula o zoom da câmera
        if (isRightMouseDown) {
            cameraRadius += deltaY * ZOOM_SENSITIVITY;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

    }

    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.add(cameraOrigin);
        camera.lookAt(cameraOrigin);
        camera.updateMatrix();
    }

    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}