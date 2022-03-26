/**
 * Created by gbox3d on 15. 2. 21..
 */


THREE.gbox_extention = {

    loader : {
        /*
        r70 에서 테스트함
        본데이터가 깨져서 나오는것을 보정해준다.

         */
        repairBoneZData : function (bones) {

            function _repairBoneData(bone) {

                if(bone.parent != -1) {

                    var parent = bones[bone.parent];

                    var prev = _repairBoneData(parent);

                    return [
                        bone.pos[0]-parent.pos[0] + (prev[0]),
                        bone.pos[1]-parent.pos[1] + (prev[1]),
                        bone.pos[2]-parent.pos[2] + (prev[2])
                    ];
                }
                else {

                    return [0,0,0];
                }
            }

            var repair_pos = [];

            for(var i=1; i < bones.length;i++) {
                repair_pos[i] = _repairBoneData(bones[i]);
            }

            for(var i=1; i < bones.length;i++) {
                bones[i].pos = repair_pos[i];
            }

        }
    }

}