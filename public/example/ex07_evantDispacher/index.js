import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import WEBGL from 'three/addons/capabilities/WebGL.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Elvis from 'elvis';

async function main() {
    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    //개발예정 아래 링크참고
    //https://threejs.org/docs/#api/en/core/EventDispatcher
    

}

export default main;