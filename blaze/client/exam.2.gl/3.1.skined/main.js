

let _template = Template.skinedMeshLayout;

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

      let scene = self.scene;

      //그리드헬퍼
      var helper =  new THREE.GridHelper( 50, 16 ,0x00ff00,0xff0000);
      self.scene.add(helper);

      function createGeometry (  ) {

        //평면지오메트리 생성
        var geometry = new THREE.PlaneGeometry(1,8,1,4);

        /*

        geometry
        0-1
        | |
        2-3
        | |
        4-5
        | |
        6-7
        | |
        8-9

        bone
        3
        |
        2
        |
        1
        |
        0

         */

        //0번 버텍스 3번본(100%)과 2(10%)번본에 대해서 가중치의 영향을 받는다
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0.1, 1));

        //1
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0.3, 1));

        //2
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0.3, 1, 0));

        //3
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0.5, 1, 0));

        //4
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));

        //5
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));

        //6
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));

        //7
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));

        //8
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));

        //9
        geometry.skinIndices.push(new THREE.Vector4(0, 1, 2, 3));
        geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));

        return geometry;

      };

      function createBones (  ) {

        bones = [];
        var prevBone = new THREE.Bone();
        bones.push( prevBone );
        prevBone.position.y = - 4;
        for ( var i = 0; i < 4; i ++ ) {
          var bone = new THREE.Bone();
          bone.position.y = 2;
          bones.push( bone );
          prevBone.add( bone );
          prevBone = bone;
        }

        return bones;

      };

      function createMesh ( geometry, bones ) {

        var material = new THREE.MeshBasicMaterial({wireframe:true,skinning : true})

        var mesh = new THREE.SkinnedMesh( geometry,	material );
        var skeleton = new THREE.Skeleton( bones );

        //본의 최상위 루트를 자식으로 추가 시켜줌
        mesh.add( bones[ 0 ] );

        mesh.bind( skeleton );

        var skeletonHelper = new THREE.SkeletonHelper( mesh );
        skeletonHelper.material.linewidth = 2;
        scene.add( skeletonHelper );

        self.skeletonHelper = skeletonHelper;

        return mesh;

      };


      function initBones () {

        var segmentHeight = 8;
        var segmentCount = 4;
        var height = segmentHeight * segmentCount;
        var halfHeight = height * 0.5;


        var geometry = createGeometry(  );
        var bones = createBones(  );
        var mesh = createMesh( geometry, bones );

        mesh.scale.multiplyScalar( 1 );
        scene.add( mesh );

        self.mesh = mesh;

        console.log(mesh)

      };

      initBones();

      //오빗컨트롤
      //카메라의 현재 위치 기준으로 시작한다.
      var controls = new THREE.OrbitControls( this.camera );
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

      },
      onMouseDown : function(event) {

      },
      onUpdate : function(event) {

        //this.skeletonHelper.update()
        this.updateAll();


      }
    }
  });

})