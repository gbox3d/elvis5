

let _template = Template["exam2-1-layout"];

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
      var helper =  new THREE.GridHelper( 50, 8 ,0x00ff00,0xff0000);
      this.scene.add(helper);

      //라인전용메트리얼..
      var material = new THREE.LineBasicMaterial({
        color: 0xffffff
      });

      //버텍스 직접 추가
      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3( -3, 0, 0 ),
        new THREE.Vector3( 0, 3, 0 ),
        new THREE.Vector3( 3, 0, 0 )
      );

      //라인오브잭트
      var line = new THREE.Line( geometry, material );
      self.scene.add( line );

      //오빗컨트롤
      //카메라의 현재 위치 기준으로 시작한다.
      var controls = new THREE.OrbitControls( self.camera );
      controls.target.set(0,0,0);// = new THREE.Vector3( 0, 0, 0 ); //바라보는 위치
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

        var mx = ( event.offsetX / this.window_size.width ) * 2 - 1;
        var my = - ( event.offsetY / this.window_size.height ) * 2 + 1;

        //templ_instance.xpos.set(mx.toFixed(2));
        //templ_instance.ypos.set(my.toFixed(2));

        //document.querySelector('#text-log .mouse-pos').innerText = mx.toFixed(2) + ',' + my.toFixed(2);
        /*
         var vector = new THREE.Vector3( mx, my, 0.5 ).unproject( Smgr.camera );

         //위치변경은 position을 사용한다.
         node.position.set(vector.x,vector.y,vector.z);
         */

        //console.log(vector);
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

        //console.log(event);



        this.updateAll();


      }
    }
  });

})