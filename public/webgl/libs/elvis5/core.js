/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 7. 25.
 * Time: 오후 10:41
 * To change this template use File | Settings | File Templates.
 */

/*

r03,2015.12.1
 직교투영추가

r02
-2015.10.19-
util.createDummy 함수에서 기본 랜더러를 webgl로 수정
 */

elvis5 = {
    REVISION : 'r03',
    Renderer : {},
    scene : {}
}

//네이스페이스설정
esparty = {
}
esparty.elvis3d = elvis5;





/*

 -SceneManager 생성자 매개 변수

 renderer :{
 canvas_element :
 bkg_color :
 container : 화면이 들어갈 루트 노드 디폴트는 body
 }

 windowSize {
 width:
 height:
 }

 camera : {
 fov:
 aspect:
 near:
 far:
 element:
 position:
 looat
 }

 -프로토타입 함수

 updateAll
 addTBCameraController


 -콜백 함수

 preProcessing : 전처리 updateAll 내 에서 호출됨
 postProcessing : 후처리 updateAll 내 에서 호출됨

 */

elvis5.scene.SceneManager = function(param) {

    /*
    _.bindAll(param.event,
        'onUpdate',
        'onWindowResize',
        'onMouseDown','onMouseUp','onMouseMove');
        */

    if(param == undefined) {
        param = {};
    }

    var container = document.body;

    if(param.window_size) {
        this.window_size = param.window_size;
    }
    else {

        if(param.renderer.container) {
            this.window_size = {
                width : param.renderer.container.offsetWidth,
                height : param.renderer.container.offsetHeight
            }

        }
        else {
            this.window_size = {
                width : window.innerWidth,
                height : window.innerHeight
            }
        }


    }


    if(param.camera == undefined) {
        param.camera = {};
        param.camera.near = 150;
        param.camera.far = 1000;
        param.camera.position = new THREE.Vector3(0,0,700);
        param.camera.lookat = new THREE.Vector3();
    }

    if(param.camera.type == undefined) {
        param.camera.type = 'persp'
    }

    if(param.camera.type == 'ortho') {
        console.log('make ortho cam')
        this.camera = new THREE.OrthographicCamera(
            param.camera.ratio * this.window_size.width / - 2,
            param.camera.ratio * this.window_size.width / 2,
            this.window_size.height / 2, this.window_size.height / - 2,
            param.camera.near, param.camera.far
        );
        this.camera.ratio = param.camera.ratio;
    }
    else {
        this.camera = new THREE.PerspectiveCamera( param.camera.fov, this.window_size.width / this.window_size.height, param.camera.near, param.camera.far );

    }


    this.camera.position.copy( param.camera.position  );
    this.camera.lookAt( param.camera.lookat );
    this.camera.target = param.camera.lookat;


    //씬 생성객체
    this.scene = new THREE.Scene();


    if(param.renderer == undefined) {
        param.renderer = {
            type : 'css3'
        };
    }

    //랜더러 생성
    switch(param.renderer.type)
    {
        case 'css3':
            this.renderer = new THREE.CSS3DRenderer();
//            this.renderer = new elvis5.Renderer.CSS3D();

            this.renderer.domElement.style.position = 'absolute';
            if(param.renderer.bkg_color)
            {
                this.renderer.domElement.style.backgroundColor = param.renderer.bkg_color;
            }
            else {
                this.renderer.domElement.style.backgroundColor="#9966FF";   //배경컬러지정

            }

            break;
        case 'canvas':

            break;
        case 'webgl':
            // renderer
            /*
             canvas — A Canvas where the renderer draws its output.
             precision — shader precision. Can be "highp", "mediump" or "lowp".
             alpha — Boolean, default is true.
             premultipliedAlpha — Boolean, default is true.
             antialias — Boolean, default is false.
             stencil — Boolean, default is true.
             preserveDrawingBuffer — Boolean, default is false.
             clearColor — Integer, default is 0x000000.
             clearAlpha — Float, default is 0.
             maxLights — Integer, default is 4.

             */
            this.renderer = new THREE.WebGLRenderer(
                {
                    antialias: param.renderer.antialias || true,
//                    clearColor: param.renderer.clearColor || 0x000000 ,
//                    clearAlpha: param.renderer.clearAlpha  || 0,
                    preserveDrawingBuffer : param.renderer.preserveDrawingBuffer  || false,
                    canvas   : param.renderer.canvas,
                    precision: param.renderer.precision,
                    premultipliedAlpha : param.renderer.premultipliedAlpha || true,
                    alpha: param.renderer.alpha || true,
                    maxLights:param.renderer.maxLight || 4,
                    stencil: param.renderer.stencil || true
                }
            );

            if( param.renderer.clear != undefined) {
                this.renderer.setClearColor(
                    param.renderer.clear.color,
                    param.renderer.clear.alpha
                );
            }

            //알파값이 먹히도록
            //this.renderer.domElement.style.position='absolute';
//          this.renderer.setSize( this.window_size.width, this.window_size.height);

            break;
        default :
            console.error('unknown renderer');
            break;
    }

    this.renderer_type = param.renderer.type;

    this.renderer.setSize( this.window_size.width, this.window_size.height);

    //컨테인너 노드에 자식으로 붙이기
    if(param.renderer.container) {
        param.renderer.container.appendChild( this.renderer.domElement );
    }
    else {
        document.body.appendChild( this.renderer.domElement );
    }

    var THAT = this;

    //이밴트 처리
    if(param.event) {

        //윈도우크기 재조정
        if(param.event.onWindowResize) {

            window.addEventListener('resize',param.event.onWindowResize.bind(THAT));
        }

        //입력기 관련 이밴트
        if(param.event.onMouseDown) {

            this.renderer.domElement.addEventListener( 'mousedown', param.event.onMouseDown.bind(THAT), false );

        }
        if(param.event.onMouseUp) {

            this.renderer.domElement.addEventListener( 'mouseup', param.event.onMouseUp.bind(THAT), false );

        }
        if(param.event.onMouseMove) {

            this.renderer.domElement.addEventListener( 'mousemove', param.event.onMouseMove.bind(THAT), false );

        }

        if(param.event.onTouchStart) {
            this.renderer.domElement.addEventListener( 'touchstart', param.event.onTouchStart.bind(THAT), false );

        }
        if(param.event.onTouchEnd) {
            this.renderer.domElement.addEventListener( 'touchend', param.event.onTouchEnd.bind(THAT), false );

        }
        if(param.event.onTouchMove) {
            this.renderer.domElement.addEventListener( 'touchmove', param.event.onTouchMove.bind(THAT), false );

        }

        if(param.event.onKeyDown) {
            window.addEventListener( 'keydown', param.event.onKeyDown.bind(THAT), false );

        }

        if(param.event.onUpdatePhysics) {

            //todo...
            //setTimer로 수정할예정
            //var _onPhysics = param.event.onUpdatePhysics.bind(THAT);
            //setInterval(param.event.onUpdatePhysics.bind(THAT),1000/60);


        }


        //프레임 갱신 타이밍 인밴트
        if(param.event.onUpdate) {

            var _onUpDate = param.event.onUpdate.bind(THAT);

            ((function() {

                var clock = new THREE.Clock();

                var update = function () {

                    //델타틱 얻기
                    var delta = clock.getDelta();

                    requestAnimationFrame(update);
                    _onUpDate({
                        deltaTick : delta
                    });
                };

                requestAnimationFrame(update);

            }).bind(this))();


        }

    }

    if(param.setup) {
        (param.setup.bind(this))();
    }


}

elvis5.scene.SceneManager.prototype = {

    updateAll : function(param) {

        //선처리
        if(this.preProcessing) {

            this.preProcessing();

        }

        if(param == undefined) {
            param = {};
        }

        if(param.resize != undefined) {

            if('OrthographicCamera' == this.camera.type) {

                console.log('resize ortho');
                this.camera.left   = -  this.camera.ratio * param.resize.width / 2;
                this.camera.right  =    this.camera.ratio * param.resize.width / 2;
                this.camera.top    =   param.resize.height / 2;
                this.camera.bottom = - param.resize.height / 2;
            }
            else {
                this.camera.aspect = param.resize.width / param.resize.height;
            }
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( param.resize.width, param.resize.height);
        }

        this.renderer.render( this.scene, this.camera );

        //후처리
        if(this.postProcessing) {

            this.postProcessing();

        }

    },
    //트랙볼 카메라 컨트롤러 추가
    addTBCameraController : function(param) {

        if(this.CameraController != undefined) {
            this.CameraController.release();
        }

        this.CameraController = new elvis5.scene.TBCameraController(param);

        return this.CameraController;

    },
    addAmbientLight : function(color) {
        var ambientLight = new THREE.AmbientLight(color || 0x222222);
        this.scene.add(ambientLight);
    },
    addDirectionalLight : function(param) {

        if(param == undefined) {
            param = {}
        }

        var directionalLight = new THREE.DirectionalLight(param.color || 0xffffff);
        directionalLight.position.copy(param.direction || new THREE.Vector3(1,1,1)).normalize();

        this.scene.add(directionalLight);
    }

}


