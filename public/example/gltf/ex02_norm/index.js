import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { GUI } from 'lil-gui';

import { OrbitControls } from 'OrbitControls';
// import { FBXLoader } from 'FBXLoader';
import { GLTFLoader } from 'GLTFLoader';

import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    globalThis.Smgr = new Elvis({
        camera: {
            fov: 40,
            far: 1000,
            near: 1,
            position: new THREE.Vector3(- 10, 0, 23),
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

            let renderer, scene, camera;
            // renderer
            // renderer = new THREE.WebGLRenderer();
            renderer = this.renderer;
            // renderer.setSize(window.innerWidth, window.innerHeight);
            // document.body.appendChild(renderer.domElement);

            renderer.outputEncoding = THREE.sRGBEncoding;

            // scene
            // scene = new THREE.Scene();
            scene = this.scene;
            camera = this.camera;

            // camera
            // camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
            // camera.position.set(- 10, 0, 23);
            scene.add(camera);

            // controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.addEventListener('change', render);
            controls.minDistance = 10;
            controls.maxDistance = 50;
            controls.enablePan = false;

            // ambient
            scene.add(new THREE.AmbientLight(0xffffff, .2));

            // light
            const light = new THREE.PointLight(0xffffff, 1.5);
            camera.add(light);

            // model
            new GLTFLoader().load('./Nefertiti.glb', function (gltf) {

                gltf.scene.traverse(function (child) {

                    if (child.isMesh) {

                        // glTF currently supports only tangent-space normal maps.
                        // this model has been modified to demonstrate the use of an object-space normal map.

                        child.material.normalMapType = THREE.ObjectSpaceNormalMap;

                        // // attribute normals are not required with an object-space normal map. remove them.

                        child.geometry.deleteAttribute('normal');

                        //

                        child.material.side = THREE.DoubleSide;

                        child.scale.multiplyScalar(0.5);

                        console.log(child.material);

                        // recenter

                        new THREE.Box3().setFromObject(child).getCenter(child.position).multiplyScalar(- 1);

                        scene.add(child);

                    }

                });

                render();

            });

            // function onWindowResize() {

            //     renderer.setSize(window.innerWidth, window.innerHeight);
            
            //     camera.aspect = window.innerWidth / window.innerHeight;
            //     camera.updateProjectionMatrix();
            
            //     render();
            
            // }
            
            function render() {
            
                renderer.render(scene, camera);
            
            }

            // window.addEventListener('resize', onWindowResize);

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
                // this.updateAll();
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