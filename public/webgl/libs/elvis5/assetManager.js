/**
 * Created by gunpower on 2016. 5. 28..
 */

esparty.elvis3d.assetManager = {
    resTable : [],
    resIndex : {},
    SetupAsset : function (option) {

        var scope = this;

        var callback = option.callback;
        var assetPath = option.assetPath;
        var resTable = this.resTable = option.resTable;
        var resIndex = {};

        this.resIndex = resIndex;

        var total_count = this.resTable.length;
        // for(var key in this.resTable) {
        //     total_count++;
        // }
        var load_count = 0;

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

