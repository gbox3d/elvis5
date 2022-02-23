import * as THREE from 'three';
import {GUI} from 'lil-gui';

import WEBGL from 'WebGL';
import { OrbitControls } from 'OrbitControls';

//참고 자료 : https://lil-gui.georgealways.com/#Examples


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
    const cameraControl = new OrbitControls( camera, renderer.domElement );
    cameraControl.target.set( 0, 0, 0 );
    cameraControl.enableRotate = false;
    cameraControl.update();

    //GUI
    const gui = new GUI();
    // gui.add( document, 'title' );
    const obj = {
        myBoolean: true,
        myString: 'lil-gui',
        myNumber: 1,
        sliderNumber: 0,
        colorObject: { r: 170, g: 0, b: 255 },
        size : 'small',
        myFunction: function() { alert( 'hi' ) },
        resetCamera : function() {
            cameraControl.reset()
        }
    }
    
    gui.add( obj, 'myBoolean' ).onChange(evt=> {
        console.log(evt);
        grid_helper.visible = evt;
    })	// checkbox
    gui.add( obj, 'myString' ); 	// text field
    gui.add( obj, 'myNumber' ); 	// number field

    gui.add( obj, 'myFunction' ); 	// button
    gui.add( obj, 'resetCamera' ); 	// button
    
    gui.add(obj,'sliderNumber',-1,1,0.01).onChange(evt=>{
        console.log(evt);
    })
    gui.add(obj,'size',['small','medium','large']).onFinishChange(evt=>{
        console.log(evt);
    })
    
    /*
    onFinishChange 는 컬러피커와 같이 선택이 끝나고 포커싱을 잃을때 이밴트가 호출된다.
    */
    gui.addColor(obj, 'colorObject').onFinishChange(evt=>{
        console.log(evt);
    }) //color picker


//animatoion loop
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
    theApp.cameraControls = cameraControl;

}

export default main;