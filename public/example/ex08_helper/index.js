import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import WEBGL from 'three/addons/capabilities/WebGL.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
            const controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.target.set(0, 0, 0);
            controls.update();

            this.orbitControl = controls;

            //axes helper
            const axesHelper = new THREE.AxesHelper( 1 );
            this.scene.add( axesHelper );

            //arrow helper
            const arrowHelper = new THREE.ArrowHelper( 
                new THREE.Vector3( 0, 1, 0 ), //dir
                new THREE.Vector3( 0, 0, 0 ), //origin
                1, //length
                0xffff00, //color 
                0.2, //headLength
                0.2 //headWidth
                );

            this.scene.add( arrowHelper );

            
            controls.addEventListener('end', function (evt) {
                // console.log('change', evt);
                console.log('camera position', scope.position);
                console.log('camera lookat', controls.target);

                console.log('distance', controls.getDistance());

                axesHelper.position.copy(controls.target);
                arrowHelper.position.copy(controls.target);
            });

            //stats ui setup
            const stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            document.body.appendChild(stats.domElement);
            this.stats = stats;

            //object setup
            const geometry = new THREE.SphereGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            const entity = new THREE.Mesh(geometry, material);
            entity.position.x = 0;
            entity.position.y = 2;
            this.scene.add(entity);

            this.entity = entity;

            //box helper
            const boxHelper = new THREE.BoxHelper( entity, 0xffff00 );
            boxHelper.material.color.setHex( 0xffff00 );
            this.scene.add( boxHelper );
            this.boxHelper = boxHelper;

            //GUI
            const gui = new GUI();
            // gui.add( document, 'title' );
            const obj = {
                mousepos : '0,0',
                target : '0,0,0',
                enableZoom : true
            }
            // let txMousePos = gui.add(obj, 'mousepos'); 	// text field
            // console.log(txMousePos)
            this.gui = {
                guiObj : gui,
                txMousePos : gui.add(obj, 'mousepos'),
                txTarget : gui.add(obj, 'target'),
                enableZoom : gui.add(obj, 'enableZoom').onChange(function (value) {
                    console.log('enableZoom', value);
                    controls.enableZoom = value;
                    // controls.enableZoom = value;
                })
                
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

                this.entity.rotation.x += 0.01;
                this.boxHelper.update();

                this.stats.update()
                this.updateAll();


            },
            onMouseDown: function (event) {

            },
            onMouseMove: function (event) {

                let mx =  ( event.offsetX / this.window_size.width ) * 2 - 1;
                let my = - ( event.offsetY / this.window_size.height ) * 2 + 1;

                this.gui.txMousePos.setValue(`${ _.round(mx,2)}, ${_.round(my,2)}`);
                this.gui.txTarget.setValue(`${ _.round(this.orbitControl.target.x,2)}, ${_.round(this.orbitControl.target.y,2)}, ${_.round(this.orbitControl.target.z,2)}`);

            },
            onKeyDown: function (event) {
                //console.log(event);
            }
        }
    });




}

export default main;