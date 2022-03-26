import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    //engine setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    camera.position.x = 10;
    camera.position.y = 10
    camera.position.z = 10; //카메라위치 
    //반드시 카메라 위치를 변경한다음 카메라의 시점을 변경해준다. 그렇지않으면 이전위치기준으로 시점을 잡기 때문에 엉뚱한 곳을 바라볼수있다.
    camera.lookAt(0,0,0); 
    camera.up.set(0,0,1); //업벡터 재지정 
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //timer setup
    const clock = new THREE.Clock();

    //object setup
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 0;
    cube.position.y = 2;
    scene.add(cube);

    //grid helper setup
    var grid_helper =  new THREE.GridHelper( 10, 10 ,0x00ff00,0xff0000);
    scene.add(grid_helper);

    renderer.render(scene, camera);

    //stats ui setup
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    function animate() {
        let delta = clock.getDelta();
        requestAnimationFrame(animate);

        cube.rotation.x += THREE.MathUtils.degToRad(45) * delta;
        cube.rotation.y += THREE.MathUtils.degToRad(45) * delta;

        stats.update();
        
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