import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { GUI } from 'lil-gui';

import { OrbitControls } from 'OrbitControls';
import { TransformControls } from 'TransformControls';

import { Octree } from 'Octree';
import { Capsule } from 'Capsule';


import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    globalThis.Smgr = new Elvis({
        camera: {
            fov: 45,
            far: 5000,
            near: 1,
            position: new THREE.Vector3(0, 0, 10),
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
            // const helper = new THREE.GridHelper(8, 16, 0x00ff00, 0xff0000);
            // //helper.setColors(0x00ff00,0xff0000);
            // scope.scene.add(helper);

            //오빗컨트롤
            //카메라의 현재 위치 기준으로 시작한다.
            var orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
            orbitControl.target.set(0, 0, 0);
            orbitControl.update();

            //stats ui setup
            const stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            document.body.appendChild(stats.domElement);
            this.stats = stats;

            //object setup
            const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            this.CapsuleNode = cube;


            const _group = new THREE.Group();

            this.redWireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            this.greenWireMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });


            {
                const ground = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(10, 10, 5, 5),
                    this.greenWireMaterial
                );
                ground.rotation.x = THREE.Math.degToRad(-45);
                ground.position.y = 0;
                _group.add(ground);

            }
            {
                const ground = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(10, 10, 5, 5),
                    this.greenWireMaterial
                );
                // ground.rotationOrder = 'XYZ';
                ground.rotation.y = THREE.Math.degToRad(90);
                
                ground.position.x = -2;
                _group.add(ground);
            }
            {
                const ground = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(10, 10, 5, 5),
                    this.greenWireMaterial
                );
                ground.rotation.x = THREE.Math.degToRad(-45);
                ground.position.y = 5;
                _group.add(ground);

            }
            
            this.scene.add(_group);




            this.playerCollider = new Capsule(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 0.5);

            //octree setup
            this.octree = new Octree();
            this.octree.fromGraphNode(_group);

            //transformControl setup
            this.transformControl = new TransformControls(this.camera, this.renderer.domElement);
            this.transformControl.attach(cube);
            this.scene.add(this.transformControl);
            this.transformControl.addEventListener('dragging-changed', (event) => {
                orbitControl.enabled = !event.value;
            });

            //GUI
            const gui = new GUI();
            // gui.add( document, 'title' );
            const obj = {
                mousepos: '0,0',
                collision: '0.0'
            }
            // let txMousePos = gui.add(obj, 'mousepos'); 	// text field
            // console.log(txMousePos)
            this.gui = {
                guiObj: gui,
                txMousePos: gui.add(obj, 'mousepos'),
                collision: gui.add(obj, 'collision')
            };

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

                this.playerCollider.start.copy(this.transformControl.object.position.clone().add(
                    new THREE.Vector3(0, -0.5, 0) //돔의 반지름을 뺀길이
                ));
                this.playerCollider.end.copy(this.transformControl.object.position.clone().add(
                    new THREE.Vector3(0, 1, 0) 
                )
                );
                

                const result = this.octree.capsuleIntersect(this.playerCollider);

                if (result) {
                    // console.log(result);
                    this.gui.collision.setValue(result.depth.toFixed(2));
                    this.CapsuleNode.material = this.redWireMaterial;
                }
                else {
                    this.gui.collision.setValue('0.0');
                    this.CapsuleNode.material = this.greenWireMaterial;
                }

                // console.log(result);


                this.stats.update()
                this.updateAll();
            },
            onMouseDown: function (event) {

            },
            onMouseMove: function (event) {

                let mx = (event.offsetX / this.window_size.width) * 2 - 1;
                let my = - (event.offsetY / this.window_size.height) * 2 + 1;

                this.gui.txMousePos.setValue(`${_.round(mx, 2)}, ${_.round(my, 2)}`);

            },
            onKeyDown: function (event) {
                //console.log(event);
            }
        }
    });

}

export default main;