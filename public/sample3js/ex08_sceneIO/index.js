import * as THREE from 'three';
import WEBGL from 'WebGL';
import { GLTFExporter } from 'GLTFExporter';
import {GLTFLoader} from 'GLTFLoader';
import {DRACOLoader} from 'DRACOLoader';

async function main() {

    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    const glWindow = document.querySelector('.gl-container');
    const uiContainer = document.querySelector('.ui-container');


    //time setup
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(
        75, glWindow.clientWidth / glWindow.clientHeight, 0.1, 1000
    );
    camera.position.z = 400;

    // scene setup
    let scene = new THREE.Scene();

    // //object setup
    // const geometry = new THREE.BoxGeometry(200, 200, 200);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    //renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(glWindow.clientWidth, glWindow.clientHeight);
    glWindow.appendChild(renderer.domElement);


    function animate() {
        const delta = clock.getDelta();
        const elaps_time = clock.getElapsedTime();

        requestAnimationFrame(animate);

        // let angleSpeed = parseInt(angleSpeedSlider.value);

        // mesh.rotation.x += THREE.MathUtils.degToRad(angleSpeed) * delta;
        // mesh.rotation.y += THREE.MathUtils.degToRad(angleSpeed) * delta;

        renderer.render(scene, camera);

    }
    animate();

    //2022.3.25 현재 미구현강태인듯
    uiContainer.querySelector('.save-scene').addEventListener('click', () => {

        const exporter = new GLTFExporter();

        exporter.parse(scene,
            function (result) {
                console.log(result);
                uiContainer.querySelector('textarea').value = JSON.stringify(result);
            },
            function (error) {
                console.log(error);
            }
        );

    })

    
    uiContainer.querySelector('.load-scene').addEventListener('click', () => {
        // Instantiate a loader
        const loader = new GLTFLoader();

        let data = uiContainer.querySelector('textarea').value;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/threejs/examples/js/libs/draco/' );
        loader.setDRACOLoader( dracoLoader );

        loader.parse(
            // Load a glTF resource
            data,
            '',
            // Function when the resource is loaded
            function (gltf) {
                // Create an object to add the glTF model to
                // const group = new THREE.Group();

                // Add the glTF model to the group,
                
                scene.add(gltf.scene);

                // Add the group to the scene
                // scene.add(group);
            },
            function(error){
                console.log(error);
            }
        );
    });
    uiContainer.querySelector('.add-obj').addEventListener('click', () => {

        const geometry = new THREE.BoxGeometry(200, 200, 200);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

    })



}



export default main;