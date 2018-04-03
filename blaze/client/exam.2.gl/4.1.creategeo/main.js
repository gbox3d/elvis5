

let _template = Template.createGeoLayout

_template.onCreated( function () {
  // console.log(Template);

} )

_template.onRendered(function () {

  let templ_instance = this;

  var Smgr = new elvis5.scene.SceneManager({
    camera : {
      fov : 45,
      far : 5000,
      near : 1,
      position : new THREE.Vector3(5, 10, 10),
      lookat : new THREE.Vector3()

    },
    renderer : {
      type : 'webgl',
      container : this.find('#mycanvas'),//document.querySelector('#mycanvas'),
      clear : {
        color : 0x000000
      }

    },
    setup : function() {

      var self = this;

      //그리드헬퍼
      var helper =  new THREE.GridHelper( 50, 16 ,0x00ff00,0xff0000);
      self.scene.add(helper);


      var material = new THREE.MeshBasicMaterial(
        {
          color: 0x00ff00,
          wireframe : true

        }
      );

      //큐브지오메트리 추가
      {
        let geometry = new THREE.CubeGeometry(1,1,1);

        let node = new THREE.Mesh(geometry, material);
        node.position.set(0,0,0);
        node.name = 'wire_cube';
        this.scene.add(node);
      }

      {
        let object = new THREE.Mesh( new THREE.SphereGeometry( .5, 20, 10 ), material );
        object.position.set( 1, 0, 0 );
        this.scene.add( object );

      }

      {
        let object = new THREE.Mesh( new THREE.IcosahedronGeometry( .5, 1 ), material );
        object.position.set( 2, 0, 0 );
        this.scene.add( object );

      }

      {
        let object = new THREE.Mesh( new THREE.OctahedronGeometry( .5, 2 ), material );
        object.position.set( 3, 0, 0 );
        this.scene.add( object );
      }

      {
        let object = new THREE.Mesh( new THREE.TetrahedronGeometry( .5, 4 ), material );
        object.position.set( 4, 0, 0 );
        this.scene.add( object );
      }

      //평면 계열
      {

        let dummy = new THREE.Group();
        dummy.position.set(0,1,0);
        //dummy.add(node); //자식노드로 추가됨
        this.scene.add(dummy);


        {
          let object = new THREE.Mesh( new THREE.PlaneGeometry(
            1, 1,//가로세로 크기
            4, 4 //나누기갯수
            ),
            material );
          object.position.set( 1, 0, 0 );
          dummy.add( object );

        }

        {
          let object = new THREE.Mesh( new THREE.CircleGeometry(
            0.5,//반지름
            16,//분할갯수
            0, //원호 시작각
            Math.PI * 2 //원호 종료각

          ),material);

          object.position.set( 2, 0, 0 );
          dummy.add( object );
        }

        {
          let object = new THREE.Mesh( new THREE.RingGeometry(
            .2, //내부 반지름(구멍)
            .5, //외부반지름
            16, 5,//분할갯수
            0, Math.PI * 2//원호각
            ),
            material );
          object.position.set( 3, 0, 0 );
          dummy.add( object );
        }

      }

      //응용 계열
      {
        let dummy = new THREE.Group();
        dummy.position.set(0,-1,0);
        //dummy.add(node); //자식노드로 추가됨
        this.scene.add(dummy);
        //실린더 지오메트리
        {
          let object = new THREE.Mesh( new THREE.CylinderGeometry(
            .25, .75, //상하단 반지름
            1, //높이
            40, //레디얼 새그먼트 수
            5 // 세로 새그먼트 수
            ),
            material );
          object.position.set( 0, 0, 0 );
          dummy.add( object );

        }

        {
          let  points = [];

          for ( var i = 0; i < 50; i ++ ) {

            points.push( new THREE.Vector3(
              Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 1.5 + 0.5 ,
              0,
              ( i/10 - 5 ) * 2 ) );

          }

          let object = new THREE.Mesh( new THREE.LatheGeometry( points, 20 ), material );
          object.position.set( 2, 0, 0 );
          dummy.add( object );
        }

        {
          let object = new THREE.AxisHelper( 1 );
          object.position.set( 4,0,0);
          dummy.add( object );

        }

      }

      //오빗컨트롤
      //카메라의 현재 위치 기준으로 시작한다.
      let controls = new THREE.OrbitControls( this.camera );
      controls.target = new THREE.Vector3( 0, 0, 0 ); //바라보는 위치
      controls.update();

    },
    event : {
      onWindowResize : function(evt) {


        if(this.window_size) { //창모드일경우

        }
        else { //전체 화면일경우
          this.updateAll({
            resize : {
              width :  window.innerWidth,
              height : window.innerHeight
            }
          });
        }
      },
      onMouseMove : function(event) {


      },
      onKeyDown : function(event) {

        console.log(event);

      },
      onMouseDown : function(event) {

      },
      onUpdate : function(event) {

        /*
         event 인자
         deltaTick : 루프지연시간 (ms)
         */
        this.updateAll();


      }
    }
  });

})