import * as THREE from 'three';
import WEBGL from '/threejs/examples/jsm/capabilities/WebGL.js'

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    //renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //camera setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    //scene manager setup
    const scene = new THREE.Scene();

    //time setup
    const clock = new THREE.Clock();

    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    //create a geometry to contain the vertices
    const points = [];
    points.push(new THREE.Vector3(- 10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    scene.add(line);

    //
    {
        let r = 10;
        const positions = [];
        for (let i = 0; i < 100; i++) {
            const x = i;
            const y = Math.random() * r - r / 2;
            const z = 0;
            positions.push(x, y, z);
            // points.push();
        }
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        let line = new THREE.Line(geometry, material);
        line.position.set(-50, 0, 0);
        scene.add(line);
    }

    function animate() {

        requestAnimationFrame(animate);

        render();
        // stats.update();

    }
    
    function render() {

        const delta = clock.getDelta();
        const elaps_time = clock.getElapsedTime();

        if(elaps_time > 1) {
            // clock.stop();
            clock.start(); //reset elapsed time
            console.log(elaps_time);
        }
        

        // line.rotation.x = time * 0.25;
        // line.rotation.y = time * 0.5;

        // t += delta * 0.5;
        // line.morphTargetInfluences[0] = Math.abs(Math.sin(t));

        renderer.render(scene, camera);

    }

    //화면 크기 변경 
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })


    animate();

}

export default main;