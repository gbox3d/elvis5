import * as THREE from 'three';

import WEBGL from 'WebGL';
// import  three.js/examples/jsm/controls/OrbitControls.js
import { OrbitControls } from 'OrbitControls';

import { FBXLoader } from 'fbxLoader';

// const theApp = {}
globalThis.theApp = {}

//fbx loader example
async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    let mixer;
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);


    //그리드 핼퍼 생성 
    var grid_helper = new THREE.GridHelper(10, 10, 0x00ff00, 0xff0000);
    // grid_helper.rotation.x = THREE.Math.degToRad(90);  
    scene.add(grid_helper);


    camera.position.y = 5;
    camera.position.z = 5; //카메라위치 

    // CONTROLS
    const cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.update();

    //texture loader
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./amber.png')

    // model
    const loader = new FBXLoader();
    // console.log(loader);


    loader.load('./walk_attack.fbx', function (object) {

        mixer = new THREE.AnimationMixer(object);

        // console.log(object);

        // object.children[0].material.map = texture;

        const action = mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {

            console.log(child)

            if (child.isMesh) {

                child.material.map = texture;

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        object.scale.set(0.01, 0.01, 0.01);

        scene.add(object);

    });



    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (mixer) mixer.update(delta);


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