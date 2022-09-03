

////////////////////////////////////////////////////////////////////////
//billboard
/*
 참고 : https://gist.github.com/ekeneijeoma/1186920
 */
 class billboard {
    constructor(option) {
        //var size = option.font_size;
        //var text = option.text;

        var canvas = document.createElement("canvas");
        canvas.width = option.canvas_width;
        canvas.height = option.canvas_height;

        this.canvas = canvas;
        var context = canvas.getContext("2d");

        if (option.backGroundColor) {
            //context.fillStyle = "rgba(255,255,255,1)";
            this.backGroundColor = option.backGroundColor;
        }

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true; //텍스춰가 변경되면 매번 해주어야함

        var material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true //투명 컬러값 적용시킴
        });

        this.material = material;

        this.font_size = option.font_size;
        this.font_color = option.font_color;


        //빌보드
        var geo = new THREE.PlaneGeometry(1, 1);
        var mesh = new THREE.Mesh(geo, material);
        //canvas.width/50, canvas.height/50
        // mesh.overdraw = true;
        mesh.position.copy(option.position);
        //mesh.name = 'bil1'
        mesh.scale.set(canvas.width / 50, canvas.height / 50, 1);

        //mesh.context2d = context;
        mesh.canvas = canvas;
        mesh.OnCallback = option.OnCallback.bind(this);

        this.object = mesh;

        //return mesh
    }
    draw(text) {

        var canvas = this.canvas;
        var context = canvas.getContext("2d");
        //this.context = context
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (this.backGroundColor) {
            context.fillStyle = this.backGroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        context.font = this.font_size + "pt Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = this.font_color; //"rgba(255,0,0,1)";
        context.strokeStyle = "black";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        this.material.map.needsUpdate = true;

    }
}


class billboardMng {
    constructor(option) {

        var camera = option.camera;
        var raycaster = new THREE.Raycaster();

        var billboard_list = [];

        this.add = function (billboard) {
            billboard_list.push(billboard);

        };
        this.apply = function () {
            for (var i = 0; i < billboard_list.length; i++) {
                billboard_list[i].object.quaternion.copy(camera.quaternion);
            }

        };

        this.picking = function (mx, my) {

            //2차원좌표를 3차원 점으로 만들기
            var vector = new THREE.Vector3(mx, my, 0.5).unproject(camera);

            //픽킹광선 만들기
            raycaster.set(camera.position, vector.sub(camera.position).normalize());

            for (var i = 0; i < billboard_list.length; i++) {
                var intersects = raycaster.intersectObject(billboard_list[i].object);
                if (intersects.length > 0) {
                    console.log(intersects[0].object.name);
                    intersects[0].object.OnCallback();

                }
            }
        };
    }
}

export { billboard, billboardMng }

////////////////////////////////////////////////////////////////////////


