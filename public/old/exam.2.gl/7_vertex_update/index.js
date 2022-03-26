import * as THREE from 'three';
import WEBGL from '/threejs/examples/jsm/capabilities/WebGL.js'

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    //scene manager setup
    const scene = new THREE.Scene();

    //time setup
    const clock = new THREE.Clock();

    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //그리드 핼퍼 
    var grid_helper =  new THREE.GridHelper( 10, 100 ,0x00ff00,0xff0000);
    grid_helper.rotateX(Math.PI/2);
    scene.add(grid_helper);

    camera.position.z = 5; //카메라위치

    //라인전용메트리얼..
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });

     //지오메트리 만들기
    //  const geometry = new THREE.Geometry .Geometry();
     const geometry = new THREE.BufferGeometry()

     const positions = new Float32Array( 2 * 3 );
     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage( THREE.DynamicDrawUsage ) );
     geometry.computeBoundingSphere();
     
     //오브잭트 생성
     const line = new THREE.Line( geometry, material );
     scene.add( line );

    
     let radian = 0;
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elaps_time = clock.getElapsedTime();

        radian += delta*Math.PI

        positions[3] = Math.sin(radian);
        positions[4] = Math.cos(radian);
        line.geometry.attributes.position.needsUpdate = true;
        geometry.computeBoundingSphere();
    
        renderer.render(scene, camera);
    };

    animate();

    //화면 크기 변경 
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })

}

export default main;