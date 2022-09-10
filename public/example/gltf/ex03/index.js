import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { GUI } from 'lil-gui';

import { OrbitControls } from 'OrbitControls';
// import { FBXLoader } from 'FBXLoader';
import { GLTFLoader } from 'GLTFLoader';
import { RGBELoader } from 'RGBELoader';

import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    const loadingStatus = document.getElementById('loadingStatus');

    globalThis.Smgr = new Elvis({
        camera: {
            fov: 40,
            far: 1000,
            near: 1,
            position: new THREE.Vector3(-1, 0, 3),
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

            // let renderer, scene, camera;
            const renderer = this.renderer;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.outputEncoding = THREE.sRGBEncoding;
            // scene
            const scene = this.scene;
            const camera = this.camera;

            // controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.minDistance = 2;
            controls.maxDistance = 5;
            controls.enablePan = false;

            let texture = await new Promise((resolve, reject) => {
                new RGBELoader()
                    .setPath('../../../../repos_root/test2/hdr/')
                    .load('autumn_forest_04_4k.hdr', function (texture) {
                        return resolve(texture);
                    }, 
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        loadingStatus.innerText = `radios hdr enviroment map : ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`;
                    },
                    function (err) {
                        console.log(err);
                        return reject(err);
                    });
            });

            console.log('load complete')

            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;

            let object = await new Promise((resolve, reject) => {
                new GLTFLoader()
                    .setPath('../../../../repos_root/test2/file/food_apple_01_1k.gltf/')
                    .load('food_apple_01_1k.gltf', function (gltf) {
                        return resolve(gltf.scene);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        loadingStatus.innerText = `food_apple_01_1k.gltf : ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`;
                    },
                    function (err) {
                        console.log(err);
                        return reject(err);
                    }
                    );
            });

            loadingStatus.hidden = true;

            //scale 2x
            object.scale.set(5, 5, 5);

            scene.add(object);
            
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

                // this.stats.update()
                this.updateAll();
                // this.renderer.render(this.scene, this.camera);
            },
            onMouseDown: function (event) {

            },
            onMouseMove: function (event) {

                let mx = (event.offsetX / this.window_size.width) * 2 - 1;
                let my = - (event.offsetY / this.window_size.height) * 2 + 1;

                // this.gui.txMousePos.setValue(`${_.round(mx, 2)}, ${_.round(my, 2)}`);

            },
            onKeyDown: function (event) {
                //console.log(event);
            }
        }
    });



}

export default main;