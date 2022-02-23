import * as THREE from 'three';
import WEBGL from '/threejs/examples/jsm/capabilities/WebGL.js'
// import  three.js/examples/jsm/controls/OrbitControls.js
import { OrbitControls } from '/threejs/examples/jsm/controls/OrbitControls.js';

// const theApp = {}
globalThis.theApp = {}

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    //그리드 핼퍼 생성 
    var grid_helper =  new THREE.GridHelper( 10, 10 ,0x00ff00,0xff0000);
    grid_helper.rotation.x = THREE.Math.degToRad(90);
    scene.add(grid_helper);
    
    camera.position.z = 10; //카메라위치 
    
    // CONTROLS
    const cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.update();

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    };

    animate();

    //화면 크기 변경 
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })

    //application object
    theApp.camera = camera;
    theApp.renderer = renderer;
    theApp.scene = scene;
    theApp.cameraControls = cameraControls;

}

export default main;