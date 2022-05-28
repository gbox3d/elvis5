import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { GUI } from 'lil-gui';

import { OrbitControls } from 'OrbitControls';
import { RGBELoader } from 'RGBELoader';

import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    globalThis.Smgr = new Elvis({
        camera: {
            fov: 45,
            far: 5000,
            near: 1,
            position: new THREE.Vector3(0, 5, -10),
            lookat: new THREE.Vector3()

        },
        renderer: {
            type: 'webgl',
            clear: {
                color: 0x000000,
                alpha: 1
            }
        },
        setup: async function () {

            //초기화 코드는 여기에서 코딩한다.
            const scope = this;

            //그리드헬퍼
            // const helper = new THREE.GridHelper(8, 16, 0x00ff00, 0xff0000);
            // //helper.setColors(0x00ff00,0xff0000);
            // scope.scene.add(helper);

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

            // //object setup
            // const geometry = new THREE.BoxGeometry();
            // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            // const cube = new THREE.Mesh(geometry, material);
            // cube.position.x = 0;
            // cube.position.y = 2;
            // this.scene.add(cube);


            try {
                

                let hdrTexture = await new Promise((resolve, reject) => {
                    new RGBELoader()
                        .setPath('/threejs/examples/textures/equirectangular/')
                        .load('pedestrian_overpass_1k.hdr', function (texture) {
                            texture.mapping = THREE.EquirectangularReflectionMapping;
                            return resolve(texture);
                        },
                            function (xhr) {
                                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                            },
                            function (err) {
                                console.log('An error happened', err);
                                reject(err);
                            });
                });

                

                // 달만들기 
                let imgTexture = await new Promise((resolve, reject) => {
                    new THREE.TextureLoader().
                        setPath('/threejs/examples/textures/planets/').
                        load('moon_1024.jpg', (_) => {
                            _.wrapS = _.wrapT = THREE.RepeatWrapping;
                            _.anisotropy = 16;
                            return resolve(_)
                        });
                });

                const geometry = new THREE.SphereGeometry(2, 64, 32);

                const diffuseColor = new THREE.Color().setRGB(0.8, 0.8, 0.8);

                const material = new THREE.MeshStandardMaterial({
                    map: imgTexture,
                    bumpMap: imgTexture,
                    bumpScale: 0.01,
                    color: diffuseColor,
                    metalness: 0.5,
                    roughness: .5,
                    // envMap: hdrTexture, //오브잭트 단위로 환경멥을 적용시킨다.
                });


                const mesh = new THREE.Mesh(geometry, material);

                // mesh.position = new THREE.Vector3(0, 0, 0);
                const scene = scope.scene

                scene.add(mesh);

                scene.background = hdrTexture;
                scene.environment = hdrTexture; //전체씬에 환경멥을 적용시킨다.

                const renderer = scope.renderer;
                renderer.outputEncoding = THREE.sRGBEncoding;
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 0.75;

            }
            catch (err) {
                console.log(err);
            }



            //GUI
            const gui = new GUI();
            // gui.add( document, 'title' );
            const obj = {
                mousepos: '0,0',
            }
            // let txMousePos = gui.add(obj, 'mousepos'); 	// text field
            // console.log(txMousePos)
            this.gui = {
                guiObj: gui,
                txMousePos: gui.add(obj, 'mousepos')
            };

            scope.bStartApp = true;
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

                if (this.bStartApp) {

                    let mx = (event.offsetX / this.window_size.width) * 2 - 1;
                    let my = - (event.offsetY / this.window_size.height) * 2 + 1;
                    this.gui.txMousePos.setValue(`${_.round(mx, 2)}, ${_.round(my, 2)}`);
                }

            },
            onKeyDown: function (event) {
                //console.log(event);
            }
        }
    });


}

export default main;