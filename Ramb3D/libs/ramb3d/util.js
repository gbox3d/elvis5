/**
 * Created by gbox3d on 14. 12. 27..
 */


///////////////////////////////////////////////////////
ramb3d.util = {



    /*

     parameter list

     element :
     position :
     parent :
     name :

     */

    createDummy  : function(param) {

        if(param == undefined) {

            param = {};
            param.position = new THREE.Vector3();
        }

        var dummy;
        //더미 만들기
        //if(param.render_type == 'webgl') {
        //
        //}
        if(param.render_type == 'css3d') {
            dummy = new THREE.CSS3DObject(
                document.createElement('div')
            );
        }
        else {
            dummy = new THREE.Object3D();
        }



        if(param.position != undefined ) {
            dummy.position.copy(param.position);
        }

        if(param.name != undefined ) {
            dummy.name = param.name;
        }

        if(param.parent != undefined) {
            param.parent.add(dummy);
        }

        return dummy;

    },

    /*

     parameter list

     element :
     width :
     height :
     color :
     texture :
     position :
     name :
     parent :


     */
    createPlane : function(param) {

        var object;

        if(param.render_type === undefined) {
            param.render_type = 'css3';
        }

        switch (param.render_type) {

            case 'css3':

                (function() {

                    var element = $('<div></div>');

                    if(param.width != undefined) {
                        element.css('width',param.width);
                        element.css('height',param.height);

                    }
                    else {
                        element.css('width',64 + 'px');
                        element.css('height',64 +'px');
                    }

                    // 추가
                    if(param.pattern == 'stripe') {
                        element.css('background-color',param.color);
                        element.css('background-size',param.gap+'px '+param.gap+'px');
                        element.css('background-image','linear-gradient(transparent 50%, rgba(255,255,255,.6) 50%)');
                    }else if(param.pattern == 'cross'){
                        element.css('background-color',param.color);
                        element.css('background-size',param.gap+'px '+param.gap+'px');
                        element.css('background-image','linear-gradient(90deg, rgba(30,30,30,.5) 50%, transparent 50%), linear-gradient(rgba(30,30,30,.5) 50%, transparent 50%)');
                    }else if(param.pattern == 'grid'){
                        element.css('background-color',param.color);
                        element.css('background-size',param.gap+'px '+param.gap+'px ,'+param.gap+'px '+param.gap+'px ,'+ param.gap/5+'px '+param.gap/5+'px ,'+param.gap/5+'px '+param.gap/5+'px');
                        element.css('background-position','-2px -2px, -2px -2px, -1px -1px, -1px -1px');
                        element.css('background-image','linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)');
                    }

                    if(param.color != undefined) {
                        element.css('background-color',param.color);
                    }
                    else {
                        element.css('background-color','#000000');
                    }

                    if(param.texture != undefined) {
                        element.css('background-image', 'url('+ param.texture + ')');
                        element.css('background-size', '100%');
                    }

                    /*
                     var centerOrigin = param.centerOrigin ? param.centerOrigin : '-50%,-50%';

                     object = new ramb3d.scene.CSS3DObject( {
                     element: element[0],
                     centerOrigin : centerOrigin
                     }
                     );
                     */
                    object = new THREE.CSS3DObject(
                        element[0]
                    );


                })();

                break;
            case 'webgl':

                (function() {

                    var matrial = param.matrial || new THREE.MeshBasicMaterial({
                            color: param.color
                        });

                    object = new THREE.Mesh(
                        new THREE.PlaneGeometry(param.width, param.height),
                        matrial);

                })();


                break;
        }

        if(param.position != undefined ) {
            object.position.copy(param.position);
        }
        if(param.rotation != undefined ) {
            object.rotation.copy(param.rotation);
        }

        if(param.name != undefined ) {
            object.name = param.name;
        }

        if(param.parent != undefined) {
            param.parent.add(object);
        }

        return object;


    },

    /*
     큐브만들기
     */
    createCube : function (option) {

        if(option.render_type != undefined) {
            option.render_type = 'css3';
        }

        switch (option.render_type) {
            case 'css3':
                (function() {
                    var root_node = ramb3d.util.createDummy();
                    //모델 세팅
                    var object = ramb3d.util.createPlane({
                        width : option.size,
                        height : option.size,
                        texture : option.texture,
                        render_type : 'css3',
                        parent : root_node
                    });
                    object.element.style.webkitBackfaceVisibility="hidden";
                    object.position.set(0,0,64);

                    cloneobj = object.clone();
                    root_node.add(cloneobj);
                    cloneobj.position.set(0,0,-64);
                    cloneobj.rotation.set(0,THREE.Math.degToRad(180),0);

                    var cloneobj = object.clone();
                    root_node.add(cloneobj);
                    cloneobj.position.set(0,64,0);
                    cloneobj.rotation.set(THREE.Math.degToRad(-90),0,0);

                    cloneobj = object.clone();
                    root_node.add(cloneobj);
                    cloneobj.position.set(0,-64,0);
                    cloneobj.rotation.set(THREE.Math.degToRad(90),0,0);

                    cloneobj = object.clone();
                    root_node.add(cloneobj);
                    cloneobj.position.set(64,0,0);
                    cloneobj.rotation.set(0,THREE.Math.degToRad(90),0);

                    cloneobj = object.clone();
                    root_node.add(cloneobj);
                    cloneobj.position.set(-64,0,0);
                    cloneobj.rotation.set(0,THREE.Math.degToRad(-90),0);

                    return root_node;
                })();
                break;
            case 'webgl':

                (function() {

                    var cubeGeometry = new THREE.CubeGeometry(
                        option.size,option.size,option.size);

                    var material =
                        new THREE.MeshBasicMaterial(
                            {
                                wireframe : option.wireframe,
                                color: option.color,
                                map : option.texture
                            });

                    var cubeMesh = new THREE.Mesh(
                        cubeGeometry,material);

                    return cubeMesh;

                })();

                break;

        }

        /*

        */

    },

    /*

     color : 라인 오브잭트컬러값
     start : 시작점
     end : 끝점
     thick : 두께
     {
     w:가로 두께,
     h:세로두께
     }

     예제>
     var line = new ramb3d.util.createLine({
     color : new THREE.Color(0xff0000),
     start: new THREE.Vector3(300,-200),
     end : new THREE.Vector3(0,0),
     thick : {
     w : 100,
     h : 25
     }
     });

     */
    createLine : function(param) {

        var color = param.color;

        var start = param.start;
        var end = param.end;


        var line_vector = new THREE.Vector3();

        line_vector = line_vector.subVectors(start,end);

        var line = ramb3d.util.createDummy();


        var dummy_root = ramb3d.util.createDummy(
            {
                parent:line,
                position: start
            }
        );


        var dummy = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );
        dummy.rotation.y = THREE.Math.degToRad(90);


        var dark_color = new THREE.Color(0x000000);

        //측면
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.h,
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,0,param.thick.w/2),
            color :  (new THREE.Color).copy(color).lerp(dark_color,0.1).getStyle()
        });

        //반대편
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.h,
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,0,-param.thick.w/2),
            color :  (new THREE.Color).copy(color).lerp(dark_color,0.1).getStyle()
        }).rotation.x = THREE.Math.degToRad(180);


        //상단
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.w,
            centerOrigin : '0%,-50%',
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,param.thick.h/2,0),
            color : color.getStyle()
        }).rotation.x = THREE.Math.degToRad(-90);

        //하단
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.w,
            centerOrigin : '0%,-50%',
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,-param.thick.h/2,0),
            color : color.getStyle()
        }).rotation.x = THREE.Math.degToRad(90);


        //앞
        ramb3d.util.createPlane({
            width : param.thick.w,
            height : param.thick.h,
            centerOrigin : '-50%,-50%',
            parent: dummy,
            position : new THREE.Vector3(0,0,0),
            color : (new THREE.Color).copy(color).lerp(dark_color,0.2).getStyle()
        }).rotation.y = THREE.Math.degToRad(-90);

        ramb3d.util.createPlane({
            width : param.thick.w,
            height : param.thick.h,
            centerOrigin : '-50%,-50%',
            parent: dummy,
            position : new THREE.Vector3(line_vector.length(),0,0),
            color : (new THREE.Color).copy(color).lerp(dark_color,0.2).getStyle()
        }).rotation.y = THREE.Math.degToRad(90);



        var mat_lookat = new THREE.Matrix4();
        mat_lookat.lookAt( start, end, dummy_root.up ); // 행렬만들기


        dummy_root.rotation.setFromRotationMatrix( mat_lookat, dummy_root.rotation.eulerOrder ); //라인 위치 잡도록 룩엣 행렬적용
        //dummy_root.rotation.setEulerFromRotationMatrix( mat_lookat, dummy_root.rotation.eulerOrder ); //라인 위치 잡도록 룩엣 행렬적용


        return line;

    },

    createWall : function(param){

        console.log('createWall')
        // side
        var width = param.width; // 780px
        var height = param.height; // 500px
        var thickness = param.thickness; // 300px


        var Wall = ramb3d.util.createDummy();

        var dummy_root = ramb3d.util.createDummy(
            {
                parent:Wall,
                position: new THREE.Vector3(0,0,0)
            }
        );


        var side = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );

        var back = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );

        var bottom = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );



        // 배경 - 측면
        ramb3d.util.createPlane({
            width : thickness,
            height : height,
            centerOrigin : '0%,-100%',
            parent: side,
            color :  param.color,
            pattern : param.pattern,
            gap : param.gap
        });

        // 배경 - 뒷면
        ramb3d.util.createPlane({
            width : width,
            height : height,
            centerOrigin : '0%,-100%',
            position:new THREE.Vector3(thickness-width/2,0,width/2),
            parent: back,
            color :  param.color,
            pattern : param.pattern,
            gap : param.gap
        }).rotation.y = THREE.Math.degToRad(-90);
//            .rotation.y = THREE.Math.degToRad(90);

        // 배경 - 바닥
        ramb3d.util.createPlane({
            width : thickness,
            height : width,
            centerOrigin : '0%,-100%',
            position:new THREE.Vector3(0,width/2,width/2),
            parent: bottom,
            color :  param.color,
            pattern : param.pattern,
            gap : param.gap
        }).rotation.x = THREE.Math.degToRad(90);

        return Wall;
    },
    ///////////////////////////////////
    ///월드 좌표 얻기
    getAbsolutePosition : function(obj3d) {

        var worldPos = new THREE.Vector3(0,0,0);

        worldPos.getPositionFromMatrix(obj3d.matrixWorld);

        return worldPos;
    },
    removeAllChildren : function(param) {

        var node = param.node;

        var obj, i;
        for ( i = node.children.length - 1; i >= 0 ; i -- ) {
            obj = node.children[ i ];
            node.remove(obj);
        }
    },
    /////////////////////////////////////////////////////////////////////
    //테스트용으로 정한 오브잭트를 돌려 보게 한다
    setup_controlTest : function(canvas_dom,object) {

        canvas_dom.addEventListener( 'mousedown', onDocumentMouseDown, false );

        function MoveEventHandler(movementX,movementY)
        {
            object.rotation.y += movementX * 0.01;
            object.rotation.x -= movementY * 0.01;

        }

        function onDocumentMouseDown( event ) {

            event.preventDefault();

            canvas_dom.addEventListener( 'mousemove', onDocumentMouseMove, false );
            canvas_dom.addEventListener( 'mouseup', onDocumentMouseUp, false );

        }

        function onDocumentMouseMove( event ) {

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            MoveEventHandler.call(this,movementX,movementY);
//            MoveEventHandler(movementX,movementY);
            //매트릭스 css3 적용
            //object.updateMatrix();
//            Smgr.updateAll();

        }

        function onDocumentMouseUp( event ) {

            canvas_dom.removeEventListener( 'mousemove', onDocumentMouseMove );
            canvas_dom.removeEventListener( 'mouseup', onDocumentMouseUp );

        }

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
//                WheelEventHandler.call(this,-(dist - prev_dist));

            }
            else {
                var touch = event.touches[ 0 ];

                var movementX =  (touchX - touch.screenX);
                var movementY =  (touchY - touch.screenY);

                touchX = touch.screenX;
                touchY = touch.screenY;

                MoveEventHandler.call(this,movementX,movementY);

                //if(Math.abs(movementX) < 30 && Math.abs(movementY) < 30 ) {
                //    callbackControl(-movementX,-movementY);
                //}


            }



            //var touch = event.touches[ 1 ];
        }

    }
    //end of  setup_controlTest
    ////////////
}