import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { GUI } from 'lil-gui';

import { OrbitControls } from 'OrbitControls';
import { FBXLoader } from 'FBXLoader';

import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    globalThis.Smgr = new Elvis({
        camera: {
            fov: 45,
            far: 5000,
            near: 1,
            position: new THREE.Vector3(3, 1, -1),
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

            const scene = this.scene

            // LIGHTS
            let ambientLight = new THREE.AmbientLight(0xc3c1c1);
            scene.add(ambientLight);

            // let pointLight = new THREE.PointLight(0xffffff, 1.25, 1000);
            // pointLight.position.set(0, 0, 600);

            // scene.add(pointLight);

            let directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, - 0.5, - 1);
            scene.add(directionalLight);

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

            const textureLoader = new THREE.TextureLoader();

            const diffuseMap = textureLoader.load('./baseColor_512.png');
            diffuseMap.encoding = THREE.sRGBEncoding;
            const normalMap = textureLoader.load('./normal_512.png');

            const material = new THREE.MeshPhongMaterial({
                color: 0xa5f8d1,
                specular: 0x222222,
                shininess: 35,
                map: diffuseMap,
                // specularMap: specularMap,
                normalMap: normalMap,
                normalScale: new THREE.Vector2(0.8, 0.8)
            });

            // const geometry = new THREE.BoxGeometry();
            // const cube = new THREE.Mesh(geometry, material);
            // scene.add(cube);

            //object setup
            const fbxLoader = new FBXLoader();
            fbxLoader.load('./2_4.fbx', function (object) {
                // object.traverse(function (child) {
                //     console.log(child);
                // });
                // console.log(object).children[0].material = material;

                let mesh = new THREE.Mesh(object.children[0].geometry, material);
                mesh.position.set(0, 0, 0);
                // mesh.scale.x = mesh.scale.y = mesh.scale.z = 30;
                scene.add(mesh);

            });

            //GUI
            const gui = new GUI();
            // gui.add( document, 'title' );
            const obj = {
                mousepos: '0,0',
                materialColor : material.color,
                ambientLightColor: ambientLight.color,
                ambientLightIntensity: ambientLight.intensity,
            }
            // let txMousePos = gui.add(obj, 'mousepos'); 	// text field
            // console.log(txMousePos)
            this.gui = {
                guiObj: gui,
                txMousePos: gui.add(obj, 'mousepos'),
                materialColor : gui.addColor(obj, 'materialColor').onFinishChange(evt=>{
                    console.log(evt);
                    material.color.setRGB(evt.r, evt.g, evt.b);
                }),
                ambientLightColor: gui.addColor(obj, 'ambientLightColor').onFinishChange(evt=>{
                    ambientLight.color.setRGB(evt.r, evt.g, evt.b);
                }),
                ambientLightIntensity: gui.add(obj, 'ambientLightIntensity', 0, 1).onFinishChange(evt=>{
                    ambientLight.intensity = evt;
                })
            };
            // this.gui.color.setValue('#ff0000');

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