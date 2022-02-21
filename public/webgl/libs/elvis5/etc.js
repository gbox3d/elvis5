/**
 * Created by gbox3d on 14. 12. 27..
 */


///////////////////////////////////////////////////////
//camera controller


//구형태의 트랙볼 제어 카메라 컨트롤러
/*

 Smgr : 씬매니져객체
 center : 시점(구의 중심점)
 radius : 카메라와 시점좌표간의 거리

 */
elvis5.scene.TBCameraController = function(param) {


    var Smgr = param.Smgr;
    var radius = param.radius;

    var angle_limit = param.limit;

    Smgr.camera.position.set(0,0,radius);

    var dummy_lookat = elvis5.util.createDummy({
        parent : Smgr.scene,
        position :param.center
    });

    //dummy_lookat.eulerOrder = 'YXZ';
    dummy_lookat.rotation.order = 'YXZ';

    var dummy_eye = elvis5.util.createDummy({
        position :Smgr.camera.position
    });

    Smgr.scene.add(dummy_lookat);

    dummy_lookat.add(dummy_eye);

    var canvas_dom = Smgr.renderer.domElement;

    //추가적인 후면 씬메니져
    if(param.subSmgr != undefined) {
        this.subSmgr = param.subSmgr;
    }



    //이밴트 핸들링

    var _onDocumentMouseDown = onDocumentMouseDown.bind(this);
    var _onDocumentMouseMove = onDocumentMouseMove.bind(this);
    var _onDocumentMouseUp = onDocumentMouseUp.bind(this);
    var _onDocumentMouseWheel = onDocumentMouseWheel.bind(this);

    function MoveEventHandler(movementX,movementY)
    {
        //시점 중심으로 fps 카메라식으로 회전시키기 위하여...

//        dummy_lookat.eulerOrder = 'YXZ';
//        console.log(dummy_lookat);

        dummy_lookat.rotation.y += movementX * 0.01;
        dummy_lookat.rotation.x -= movementY * 0.01;

        //회전 제한 범위 계산
        if(angle_limit) {

            if(dummy_lookat.rotation.x < angle_limit.min_x   ) {

                dummy_lookat.rotation.x = angle_limit.min_x;
            }
            else if(dummy_lookat.rotation.x > angle_limit.max_x) {

                dummy_lookat.rotation.x = angle_limit.max_x;

            }

            if(dummy_lookat.rotation.y < angle_limit.min_y   ) {

                dummy_lookat.rotation.y = angle_limit.min_y;
            }
            else if(dummy_lookat.rotation.y > angle_limit.max_y) {

                dummy_lookat.rotation.y = angle_limit.max_y;

            }
        }

        this.apply();

        Smgr.updateAll();

        if(this.subSmgr) {
            this.subSmgr.updateAll();
        }

    }

    function WheelEventHandler(deltaZ) {

        dummy_eye.position.z += deltaZ;

        this.apply();
        Smgr.updateAll();

    }


    function onDocumentMouseDown( event ) {

        event.preventDefault();

        canvas_dom.addEventListener( 'mousemove',  _onDocumentMouseMove , false );
        canvas_dom.addEventListener( 'mouseup', _onDocumentMouseUp, false );

    }

    function onDocumentMouseMove( event ) {

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        MoveEventHandler.call(this,movementX,movementY);



        //this.apply();
        //Smgr.updateAll();
    }

    function onDocumentMouseUp( event ) {

        canvas_dom.removeEventListener( 'mousemove', _onDocumentMouseMove );
        canvas_dom.removeEventListener( 'mouseup', _onDocumentMouseUp );
    }
    function onDocumentMouseWheel( event ) {

        event.preventDefault();

        WheelEventHandler.call(this,event.wheelDeltaY);

//        dummy_eye.position.z += event.wheelDeltaY;
//
//        this.apply();
//        Smgr.updateAll();

        //moveFront(event.wheelDeltaY);

    }

    canvas_dom.addEventListener( 'mousedown', _onDocumentMouseDown, false );
    canvas_dom.addEventListener( 'mousewheel', _onDocumentMouseWheel, false );

    //
    /////////////////////

    //터치 디바이스
    document.addEventListener( 'touchstart', onDocumentTouchStart.bind(this), false );
    document.addEventListener( 'touchmove', onDocumentTouchMove.bind(this), false );

    var touchX,  touchY;
    var prev_dist

    function onDocumentTouchStart( event ) {

        event.preventDefault();

        var touch = event.touches[ 0 ];

        touchX = touch.screenX;
        touchY = touch.screenY;

        if(event.touches.length >= 2) {

            var tempx = event.touches[0].pageX - event.touches[1].pageX;
            var tempy = event.touches[0].pageY - event.touches[1].pageY;
            //var dist = Math.sqrt(tempx*tempx + tempy*tempy);
            //prev_dist = dist;
        }

    }

    function onDocumentTouchMove( event ) {

        event.preventDefault();

        if(event.touches.length >= 2) {

            var tempx = event.touches[0].pageX - event.touches[1].pageX;
            var tempy = event.touches[0].pageY - event.touches[1].pageY;
            var dist = Math.sqrt(tempx*tempx + tempy*tempy);

            //moveFront(-(dist - prev_dist));
            prev_dist = dist;

            WheelEventHandler.call(this,-(dist - prev_dist));

        }
        else {
            var touch = event.touches[ 0 ];

            var movementX =  (touchX - touch.screenX);
            var movementY =  (touchY - touch.screenY);

            touchX = touch.screenX;
            touchY = touch.screenY;

            MoveEventHandler.call(this,movementX,movementY)

            //if(Math.abs(movementX) < 30 && Math.abs(movementY) < 30 ) {
            //    callbackControl(-movementX,-movementY);
            //}


        }



        //var touch = event.touches[ 1 ];
    }

    //
    ////////////////////

    this.apply = function() {

        //매트릭스 css3 적용
        dummy_lookat.updateMatrix();

        //씬노드에 있는 노드들의 월드행렬들을 최신으로 모두 갱신해주기
        Smgr.scene.updateMatrixWorld(true);

        //월드 좌표구하기
        var worldPos = new THREE.Vector3(0,0,0);
        //worldPos.getPositionFromMatrix(dummy_eye.matrixWorld);
        worldPos.setFromMatrixPosition(dummy_eye.matrixWorld);
        Smgr.camera.position.copy(worldPos);
        Smgr.camera.lookAt( dummy_lookat.position );

        if(this.subSmgr) {

            this.subSmgr.camera.position.copy(worldPos);
            this.subSmgr.camera.lookAt( dummy_lookat.position );

        }


    }
    this.release = function() {

        canvas_dom.removeEventListener( 'mousedown', _onDocumentMouseDown );
        canvas_dom.removeEventListener( 'mousemove', _onDocumentMouseMove );
        canvas_dom.removeEventListener( 'mouseup', _onDocumentMouseUp );
        canvas_dom.removeEventListener( 'mousewheel', _onDocumentMouseWheel );
    }

    this.setRadius= function(radius)  {
        dummy_eye.position.set(0,0,radius);
        return this;
    }

    this.setRotation = function(x,y,z) {

//        rotation.eulerOrder = ''

        dummy_lookat.rotation.set(x,y,z);
        return this;
    }

    this.getBilboard = function(up_vector) {
        var mat_sunbil = new THREE.Matrix4();
        mat_sunbil.lookAt( Smgr.camera.position, dummy_lookat.position, up_vector ); //빌보드 행렬만들기

        return mat_sunbil;
        //dummy_hyuna.rotation.setEulerFromRotationMatrix( mat_sunbil, dummy_hyuna.eulerOrder ); //빌보드 행렬 적용


    }





}


///////벡터 확장
//    (0,0,1) 기준으로 x,y 축의 회전 각도를 구한다.

THREE.Vector3.prototype.getHorizontalAngle = function() {
    var b = new  THREE.Vector3();

    b.y =  THREE.Math.radToDeg(Math.atan2(this.x, this.z));

    if (b.y < 0) {
        b.y += 360
    }
    if (b.y >= 360) {
        b.y -= 360
    }
    var a = Math.sqrt(this.x * this.x + this.z * this.z);
    b.x = THREE.Math.radToDeg(Math.atan2(a, this.y)) - 90;
    if (b.x < 0) {
        b.x += 360
    }
    if (b.x >= 360) {
        b.x -= 360
    }
    return b;
};

////////////////////
//gbox3d fatch start
//커스텀 오브잭트 클로닝
THREE.CSS3DObject.prototype.clone = function() {

    console.log(this.element);
    var clone_obj = new THREE.CSS3DObject(
        this.element.cloneNode(false)
    );

    //슈퍼콜링
    THREE.Object3D.prototype.clone.call(this,clone_obj);

    //console.log('my css3d obj clone');
    return clone_obj;
}

THREE.CSS3DObject.prototype.add = function(object) {

    THREE.Object3D.prototype.add.call(this,object);

    this.element.appendChild(object.element);


    return this;
}

THREE.CSS3DObject.prototype.initElement = function(element) {
    this.element = element;
    this.element.style.position = "absolute";
    this.element.style.WebkitTransformStyle = 'preserve-3d';
    this.element.style.MozTransformStyle = 'preserve-3d';
    this.element.style.oTransformStyle = 'preserve-3d';
    this.element.style.transformStyle = 'preserve-3d';
}




//gbox3d fatch end
//////////////////