import * as THREE from 'three';
import WEBGL from '/threejs/examples/jsm/capabilities/WebGL.js'

/*
동적 직선 그래프 예제
*/
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
    
    let r = 10;
    
    let positions = [];
    positions.push(0, 0, 0);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    
    let line = new THREE.Line(geometry, material);
    line.position.set(0, 0, 0);
    scene.add(line);

    //그리드 핼퍼 생성 
    var grid_helper =  new THREE.GridHelper( 10, 10 ,0x00ff00,0xff0000);
    grid_helper.rotation.x = THREE.MathUtils.degToRad(90);
    scene.add(grid_helper);

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    let xpos = 0;
    function render() {

        const delta = clock.getDelta();
        const elaps_time = clock.getElapsedTime();

        if (elaps_time > 0.1) {
            // clock.stop();
            clock.start(); //reset elapsed time
            // console.log(elaps_time);

            xpos += 1;
            const y = Math.random() * r - r / 2;
            const z = 0;

            positions.push(xpos, y, z);

            if(positions.length > 90) {
                positions = positions.slice(3); //앞에서 3개 제거 
            }
            console.log(xpos)
            

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.computeBoundingSphere();

            // line.position.x = -xpos;
            camera.position.x = xpos;

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