import * as THREE from 'three';
import WEBGL from 'WebGL';

async function main() {

    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    const glWindow = document.querySelector('.gl-container');
    const angleSpeedSlider = document.querySelector('.angle-speed input[type=range]');
    const angleSpeedNumber =  document.querySelector('.angle-speed input[type=number]');
    angleSpeedNumber.value = angleSpeedSlider.value;
    angleSpeedSlider.addEventListener('input', (e) => {
        // console.log(e.target.value);
        angleSpeedNumber.value = e.target.value;
    })

    //time setup
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(
        75, glWindow.clientWidth / glWindow.clientHeight, 0.1, 1000
    );
    camera.position.z = 400;

    // scene setup
    const scene = new THREE.Scene();

    //object setup
    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(glWindow.clientWidth, glWindow.clientHeight);
    glWindow.appendChild(renderer.domElement);

    
    function animate() {
        const delta = clock.getDelta();
        const elaps_time = clock.getElapsedTime();

        requestAnimationFrame(animate);

        let angleSpeed = parseInt(angleSpeedSlider.value);

        mesh.rotation.x += THREE.MathUtils.degToRad(angleSpeed) * delta;
        mesh.rotation.y += THREE.MathUtils.degToRad(angleSpeed) * delta;

        renderer.render(scene, camera);

    }
    animate();
}



export default main;