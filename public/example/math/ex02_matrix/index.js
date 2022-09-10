import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import {GUI} from 'lil-gui';

import { OrbitControls } from 'OrbitControls';

import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    globalThis.Smgr = new Elvis({
        camera: {
            fov: 45,
            far: 5000,
            near: 1,
            position: new THREE.Vector3(0, 5, 10),
            lookat: new THREE.Vector3()

        },
        renderer: {
            type: 'webgl',
            clear: {
                color: 0x000000,
                alpha: 1
            }
        },
        setup: function () {

            //초기화 코드는 여기에서 코딩한다.
            const scope = this;

            //그리드헬퍼
            const helper = new THREE.GridHelper(8, 16, 0x00ff00, 0xff0000);
            //helper.setColors(0x00ff00,0xff0000);
            scope.scene.add(helper);

            //오빗컨트롤
            //카메라의 현재 위치 기준으로 시작한다.
            var controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.target.set(0, 0, 0);
            controls.update();

            //stats ui setup
            const stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            document.body.appendChild(stats.domElement);
            this.stats = stats;

            //object setup
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);

            // cube.position.x = 0;
            // cube.position.y = 2;
            


            this.scene.add(cube);

            //GUI
            const gui = new GUI();
            // gui.add( document, 'title' );
            const obj = {
                mousepos : '0,0',
                transformTest : function() {
                    // cameraControl.reset()
                    cube.position.y = 2;

                    const _matrix = new THREE.Matrix4();
                    // _matrix.makeTranslation(0,2,0);

                    _matrix.compose(new THREE.Vector3(0,2,0),
                    (new THREE.Quaternion()).setFromAxisAngle(new THREE.Vector3(1,1,1), THREE.Math.degToRad(45)),
                    new THREE.Vector3(2,2,2));

                    cube.matrixAutoUpdate = false;
                    cube.matrix.identity();
                    cube.applyMatrix(_matrix);
                    cube.matrixAutoUpdate = true;

                }
            }
            // let txMousePos = gui.add(obj, 'mousepos'); 	// text field
            // console.log(txMousePos)
            this.gui = {
                guiObj : gui,
                txMousePos : gui.add(obj, 'mousepos'),
            };
            gui.add( obj, 'transformTest' ); 	// button

            this.startRender();
            

        },
        event: {
            onWindowResize: function () {
                //동적으로 창의 크기가 바뀌면 이부분이 콜백된다.
                this.updateAll({
                    resize: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                });
            },
            onUpdate: function (event) {

                this.stats.update()
                this.updateAll();
            },
            onMouseDown: function (event) {

            },
            onMouseMove: function (event) {

                let mx =  ( event.offsetX / this.window_size.width ) * 2 - 1;
                let my = - ( event.offsetY / this.window_size.height ) * 2 + 1;

                this.gui.txMousePos.setValue(`${ _.round(mx,2)}, ${_.round(my,2)}`);

            },
            onKeyDown: function (event) {
                //console.log(event);
            }
        }
    });




    // //engine setup
    // const scene = new THREE.Scene();

    // const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

    // camera.position.x = 10;
    // camera.position.y = 10
    // camera.position.z = 10; //카메라위치 
    // //반드시 카메라 위치를 변경한다음 카메라의 시점을 변경해준다. 그렇지않으면 이전위치기준으로 시점을 잡기 때문에 엉뚱한 곳을 바라볼수있다.
    // camera.lookAt(0,0,0); 
    // camera.up.set(0,0,1); //업벡터 재지정 

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // //timer setup
    // const clock = new THREE.Clock();

    // //object setup
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.x = 0;
    // cube.position.y = 2;
    // scene.add(cube);

    // //grid helper setup
    // var grid_helper =  new THREE.GridHelper( 10, 10 ,0x00ff00,0xff0000);
    // scene.add(grid_helper);

    // renderer.render(scene, camera);

    // //stats ui setup
    // const stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // document.body.appendChild(stats.domElement);

    // function animate() {
    //     let delta = clock.getDelta();
    //     requestAnimationFrame(animate);

    //     cube.rotation.x += THREE.MathUtils.degToRad(45) * delta;
    //     cube.rotation.y += THREE.MathUtils.degToRad(45) * delta;

    //     stats.update();

    //     renderer.render(scene, camera);
    // };

    // animate();

    // //화면 크기 변경 
    // window.addEventListener('resize', () => {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    // })

}

export default main;