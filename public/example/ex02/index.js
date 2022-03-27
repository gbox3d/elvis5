import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { OrbitControls } from 'OrbitControls';
import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);


    const glWindow = document.querySelector('.gl-container');
    const angleSpeedSlider = document.querySelector('.angle-speed input[type=range]');
    const angleSpeedNumber = document.querySelector('.angle-speed input[type=number]');
    const mousePos = document.querySelector('.mousePos');
    angleSpeedNumber.value = angleSpeedSlider.value;
    angleSpeedSlider.addEventListener('input', (e) => {
        // console.log(e.target.value);
        angleSpeedNumber.value = e.target.value;
    })

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
            container: glWindow,
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
            cube.position.x = 0;
            cube.position.y = 2;
            this.cube = cube
            this.scene.add(cube);

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

                let angleSpeed = parseInt(angleSpeedSlider.value);

                this.cube.rotation.x += THREE.MathUtils.degToRad(angleSpeed) * event.deltaTick;
                this.cube.rotation.y += THREE.MathUtils.degToRad(angleSpeed) * event.deltaTick;


                this.stats.update()
                this.updateAll();
            },
            onMouseDown: function (event) {

            },
            onMouseMove: function (event) {

                let mx = (event.offsetX / this.window_size.width) * 2 - 1;
                let my = - (event.offsetY / this.window_size.height) * 2 + 1;
                mousePos.innerHTML = `${ _.round(mx,2)}, ${_.round(my,2)}`;
            },
            onKeyDown: function (event) {
                //console.log(event);
            }
        }
    });

}

export default main;