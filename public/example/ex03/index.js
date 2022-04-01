import * as THREE from 'three';
import Stats from 'state';
import WEBGL from 'WebGL';
import { OrbitControls } from 'OrbitControls';
import { TransformControls } from 'TransformControls';
import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);


    const glWindow = document.querySelector('.gl-container');
    const mousePos = document.querySelector('.mousePos');
    const objPos = document.querySelector('.objPos');
    const cmdInput = document.querySelector('.cmdInput input');

    cmdInput.addEventListener('focus', () => {
        Smgr.pauseKeyInput = true;
        console.log('focus')
    });
    cmdInput.addEventListener('blur', () => {
        Smgr.pauseKeyInput = false;
    });

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

            this.pauseKeyInput = false;

            try {
                //그리드헬퍼
                const helper = new THREE.GridHelper(8, 16, 0x00ff00, 0xff0000);
                //helper.setColors(0x00ff00,0xff0000);
                scope.scene.add(helper);

                //오빗컨트롤
                //카메라의 현재 위치 기준으로 시작한다.
                this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
                this.orbitControl.target.set(0, 0, 0);
                this.orbitControl.update();

                //트랜스폼 컨트롤러
                this.trn_control = new TransformControls(this.camera, this.renderer.domElement);
                this.trn_control.addEventListener('change', function () {
                    // console.log(scope.trn_control.object);
                    scope.updateAll();

                });
                this.trn_control.addEventListener('dragging-changed', function (event) {

                    scope.orbitControl.enabled = !event.value;
                    // console.log(controls.enabled);

                });
                this.select_node = null;
                this.trn_control.addEventListener('objectChange', function () {
                    if(scope.select_node){
                        let _text = objPos.querySelector('p')
                        _text.innerHTML = `${scope.select_node.name} : ${scope.select_node.position.x.toFixed(2)} ${scope.select_node.position.y.toFixed(2)} ${scope.select_node.position.z.toFixed(2)}`;
                        // scope.select_node.position.copy(scope.trn_control.object.position);
                        // scope.select_node.quaternion.copy(scope.trn_control.object.quaternion);
                        // scope.select_node.scale.copy(scope.trn_control.object.scale);
                    }
                });

                this.scene.add(this.trn_control);

                //레이 캐스터
                // this.raycaster = new THREE.Raycaster();

                //stats ui setup
                const stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.top = '0px';
                document.body.appendChild(stats.domElement);
                this.stats = stats;

                //object setup
                const group = new THREE.Group();
                this.scene.add(group);

                const geometry = new THREE.BoxGeometry();
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const cube = new THREE.Mesh(geometry, material);
                cube.name = "cube1"
                cube.position.x = 0;
                cube.position.y = 2;
                this.cube = cube
                group.add(cube);

                this.root_dummy = group;

                this.startRender();

                return true;

            }
            catch (e) {
                console.error(e);
                return false;
            }



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

                // let angleSpeed = parseInt(angleSpeedSlider.value);

                // this.cube.rotation.x += THREE.MathUtils.degToRad(angleSpeed) * event.deltaTick;
                // this.cube.rotation.y += THREE.MathUtils.degToRad(angleSpeed) * event.deltaTick;


                this.stats.update()
                this.updateAll();
            },
            onMouseMove: function (event) {
                let mx = (event.offsetX / this.window_size.width) * 2 - 1;
                let my = - (event.offsetY / this.window_size.height) * 2 + 1;
                mousePos.innerHTML = `${_.round(mx, 2)}, ${_.round(my, 2)}`;
            },
            onMouseDown: function (event) {

                let mx = (event.offsetX / this.window_size.width) * 2 - 1;
                let my = - (event.offsetY / this.window_size.height) * 2 + 1;
                mousePos.innerHTML = `${_.round(mx, 2)}, ${_.round(my, 2)}`;

                let _rayCaster = this.trn_control.getRaycaster();
                // let vector = new THREE.Vector3(mx, my, 0.5).unproject(this.camera);
                // _rayCaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
                _rayCaster.setFromCamera(new THREE.Vector2(mx, my), this.camera);

                //레이캐스팅 충돌 검사
                let intersects = _rayCaster.intersectObjects(this.root_dummy.children);
                if (intersects.length > 0) {
                    if (this.select_node !== intersects[0].object) {
                        let node = intersects[0].object;
                        // if (this.select_node) {
                        //     this.select_node.material = this.select_node.origin_material;
                        // }
                        this.trn_control.attach(node);
                        this.select_node = node;
                    }
                }
                else {
                    //없으면 선택 해제
                    if (this.select_node &&
                        !this.trn_control.axis //기즈모 호버링 여부 판단 
                    ) {
                        this.trn_control.detach();
                        this.select_node = null;
                    }
                }
            },
            onKeyDown: function (event) {
                if (this.pauseKeyInput) {
                    return;
                }
                let control = this.trn_control
                switch (event.keyCode) {
                    case 16: // Shift
                    // snap control
                        control.setTranslationSnap(1);
                        control.setRotationSnap(THREE.MathUtils.degToRad(15));
                        control.setScaleSnap(0.25);
                        break;
                    case 81: // Q
                        control.setSpace(this.trn_control.space == "local" ? "world" : "local");
                        break;
                    case 87: // W
                        control.setMode("translate");
                        break;
                    case 69: // E
                        control.setMode("rotate");
                        break;
                    case 82: // R
                        control.setMode("scale");
                        break;
                    case 187:
                    case 107: // +,=,num+
                        control.setSize(this.trn_control.size + 0.1);
                        break;
                    case 189:
                    case 10: // -,_,num-
                        control.setSize(Math.max(this.trn_control.size - 0.1, 0.1));
                        break;
                    case 27: //deselect
                        control.detach();
                        this.select_node = null;
                        break;
                }
            },
            onKeyUp: function (event) {
                if (this.pauseKeyInput) {
                    return;
                }
                let control = this.trn_control
                switch (event.keyCode) {
                    case 16: // Shift
                        control.setTranslationSnap(null);
                        control.setRotationSnap(null);
                        control.setScaleSnap(null);
                        break;
                }
            }

        }
    });

    document.querySelector(".focus-object").addEventListener("click", function () {
        if(Smgr.select_node){
            Smgr.orbitControl.target.copy(Smgr.select_node.position);
            Smgr.orbitControl.update();
        }
    });


    

}

export default main;