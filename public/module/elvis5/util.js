/**
 * Created by gbox3d on 14. 12. 27..
 */


///////////////////////////////////////////////////////

elvis5.util = {

    math : {
        getHorizontalAngle : function(vec3) {
            var b = new  THREE.Vector3();

            b.y =  THREE.Math.radToDeg(Math.atan2(vec3.x, vec3.z));

            if (b.y < 0) {
                b.y += 360
            }
            if (b.y >= 360) {
                b.y -= 360
            }
            var a = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
            b.x = THREE.Math.radToDeg(Math.atan2(a, vec3.y)) - 90;
            if (b.x < 0) {
                b.x += 360
            }
            if (b.x >= 360) {
                b.x -= 360
            }
            return b;
        }

    },
    scene : {
        ///월드 좌표 얻기
        getAbsolutePosition : function(obj3d) {

            var worldPos = new THREE.Vector3(0,0,0);

            worldPos.getPositionFromMatrix(obj3d.matrixWorld);

            return worldPos;

        },
        removeAllChildren : function(param) {
            var node = param.node;
            if(node == undefined) {
                node = param;
            }
            var obj, i;
            for ( i = node.children.length - 1; i >= 0 ; i -- ) {
                obj = node.children[ i ];
                node.remove(obj);
            }
        }
        //end of  setup_controlTest
        ////////////

    },
    unity3d : {
        ConvertUnity3d_DirLight : function (option) {

            var light = option.light;

            var length = option.length ? option.length : 1;
            var vector = new THREE.Vector3(length * -1,0,0);
            vector.applyQuaternion(light.quaternion);
            light.position.add(vector);
            light.rotation.set(0,0,0);

        }

    },
    asset : {
        SetupAsset : function (option) {

            var res_table = {
                /*
                 '../res/ui_main_bg.png' : {},
                 '../res/ui_main_start_on.png' : {},
                 '../res/ui_main_start_off.png' : {},
                 '../res/ui_score_bg.png' : {},
                 '../res/ui_score_end_on.png' : {},
                 '../res/ui_score_end_off.png' : {},
                 '../res/ui_score_repay_on.png' : {},
                 '../res/ui_score_repay_off.png' : {}
                 */
            }
            var files = option.files;
            var load_count = 0;
            var loader_texture = new THREE.TextureLoader();

            return new Promise(function(resolve,reject) {

                for(var i=0; i < files.length ; i++) {

                    (function () {
                        var _key = files[i];
                        loader_texture.load(
                            _key,
                            function (texture) {
                                console.log('load success..' + _key);
                                res_table[_key] = {}
                                res_table[_key].texture = texture;
                                load_count++;
                                if(files.length <= load_count) {
                                    //callback({event : 'onload', res_table : res_table});
                                    resolve({res_table : res_table})
                                }
                            },
                            function (xhr) {
                                console.log(  _key + ', '  +(xhr.loaded / xhr.total * 100) + '% loaded' );

                            },
                            function (xhr) {
                                console.log( _key + ', '  + 'An error happened' );
                                //callback({event : 'onerror'});
                                reject( _key + ', '  + 'An error happened')
                            }

                        );
                        //----------
                    })();
                }


            });
            //------------------

        },
        Manager : {
            resTable : [],
            resIndex : {},
            Setup : function (option) {

                var scope = this;
                var assetPath = option.assetPath;
                var resTable = this.resTable = option.resTable;
                var resIndex = {};

                this.resIndex = resIndex;

                var total_count = this.resTable.length;

                /////////////////////////////
                // 로더 매니져
                var manager = new THREE.LoadingManager();
                manager.onProgress = function( item, loaded, total ) {

                    console.log( item, loaded, total );

                };

                var onProgress = function( xhr ) {

                    if ( xhr.lengthComputable ) {

                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

                    }

                };

                var onError = function( xhr ) {
                };
                /////////////////////////////


                var loader_texture = new THREE.TextureLoader(manager);
                var loader_json = new THREE.JSONLoader(manager);

                //워터폴 함수 설정
                var callerSteper = []

                for(var i=0;i< total_count;i++) {

                    console.log( this.resTable[i] )


                    callerSteper[i] = (function () {

                        var item = scope.resTable[i];
                        return function (next) {

                            item.type = item.type ? item.type : 'texture';

                            if(item.type == 'texture') {
                                var _key = item.file;
                                var __key = assetPath + _key;
                                var loader = loader_texture;

                                loader.load(
                                    __key,
                                    function (texture) {
                                        console.log('load success..' + __key);
                                        if(item.option) {
                                            if(item.option.wrapS) {
                                                texture.wrapS = item.option.wrapS
                                            }
                                            if(item.option.wrapT) {
                                                texture.wrapT = item.option.wrapT
                                            }
                                        }

                                        item.texture = texture;
                                        resIndex[_key] = item;
                                        next();

                                    },
                                    function (xhr) {
                                        console.log(  _key + ', '  +(xhr.loaded / xhr.total * 100) + '% loaded' );

                                    },
                                    function (xhr) {
                                        console.log( _key + ', '  + 'An error happened' );
                                        //callback({event : 'onerror'});
                                        next({event : 'onerror'});
                                    }
                                );
                            }
                            else if(item.type == 'blender.json') {
                                var _key = item.file;
                                var __key = assetPath + _key;
                                var loader = loader_json;

                                loader.load(__key, function ( geometry, materials ) {
                                    item.geometry = geometry;
                                    item.materials = materials;
                                    resIndex[_key] = item;
                                    item.callback(geometry, materials,scope)
                                    next();

                                });


                            }
                            else if(item.type == 'audio') {

                            }
                            else if(item.type == 'video') {

                            }

                        }

                        //----------
                    })();

                }

                async.waterfall(callerSteper,
                    function (err, result) {

                        if(err) {
                            console.log(err);
                            option.callback({
                                result : 'err',
                                err : err
                            });
                        }
                        else {
                            option.callback({
                                result : 'ok',
                                resIndex : resIndex
                            });
                        }

                    });

            }

        }
    }


}

////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////
//billboard
/*
 참고 : https://gist.github.com/ekeneijeoma/1186920
 */
esparty.elvis3d.util.billboard = function (option) {

    //var size = option.font_size;
    //var text = option.text;

    var canvas = document.createElement("canvas");
    canvas.width = option.canvas_width;
    canvas.height = option.canvas_height;

    this.canvas = canvas;
    var context = canvas.getContext("2d");

    if(option.backGroundColor) {
        //context.fillStyle = "rgba(255,255,255,1)";
        this.backGroundColor = option.backGroundColor;
    }

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true; //텍스춰가 변경되면 매번 해주어야함

    var material = new THREE.MeshBasicMaterial({
        map : texture,
        transparent : true //투명 컬러값 적용시킴

    });

    this.material = material;

    this.font_size = option.font_size;
    this.font_color = option.font_color;


    //빌보드
    var geo = new THREE.PlaneGeometry(1,1)
    var mesh = new THREE.Mesh(geo, material);
    //canvas.width/50, canvas.height/50
    // mesh.overdraw = true;
    mesh.position.copy(option.position)
    //mesh.name = 'bil1'
    mesh.scale.set(canvas.width/50, canvas.height/50,1)

    //mesh.context2d = context;
    mesh.canvas = canvas;
    mesh.OnCallback = option.OnCallback.bind(this);
    
    this.object = mesh;

    //return mesh
}

esparty.elvis3d.util.billboard.prototype.draw = function (text) {

    var canvas = this.canvas;
    var context = canvas.getContext("2d");
    //this.context = context

    context.clearRect(0, 0, canvas.width, canvas.height);

    if(this.backGroundColor) {
        context.fillStyle = this.backGroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.font = this.font_size + "pt Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = this.font_color;//"rgba(255,0,0,1)";
    context.strokeStyle = "black";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    this.material.map.needsUpdate = true;

}

esparty.elvis3d.util.billboardMng = function (option) {

    var camera = option.camera;
    var raycaster = new THREE.Raycaster();

    var billboard_list = [];

    this.add = function (billboard) {
        billboard_list.push(billboard)

    }
    this.apply = function () {
        for(var i=0;i<billboard_list.length;i++) {
            billboard_list[i].object.quaternion.copy(camera.quaternion)
        }

    }

    this.picking = function (mx,my) {

        //2차원좌표를 3차원 점으로 만들기
        var vector = new THREE.Vector3( mx, my, 0.5 ).unproject( camera );

        //픽킹광선 만들기
        raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

        for(var i=0;i<billboard_list.length;i++) {
            var intersects = raycaster.intersectObject(billboard_list[i].object  );
            if ( intersects.length > 0 ) {
                console.log(intersects[ 0 ].object.name);
                intersects[ 0 ].object.OnCallback();

            }

        }


    }

}

////////////////////////////////////////////////////////////////////////


