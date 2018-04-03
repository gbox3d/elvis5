elvis5 for meteor
========

####  html5(webgl) based dynamic 3d web-front-end application framework ####

랜더러는 three.js,물리엔진은 cannon.js, 애니메이션은tween.js 사용해서 구성한 프레임웍입니다.

미티어를 개발 플랫폼으로 사용한 버전 입니다.

블레이즈 탬플릿 기반이며 추가적으로 라우팅을 위하여 다음과 같은 패키지들을 추가 했습니다.

meteor add kadira:flow-router<br>
meteor add kadira:blaze-layout


### Example ###
 
```html

<div id='mycanvas' style="
    margin: auto;
    width: 320px;height: 240px;" ></div>

```

elvis5.scene.SceneManager 를 초기화 시킬때 container 에 DOM객체를 넣어준다.

```javascript
var Smgr = new  elvis5.scene.SceneManager({
        camera : {
            fov : 45,
            far : 5000,
            near : 1,
            position : new THREE.Vector3(5, 10, 10),
            lookat : new THREE.Vector3()

        },
        renderer : {
            type : 'webgl',
            container : document.querySelector('#mycanvas'),
            clear : {
                color : 0x000000
            }

        },
        ... 이하생략 ...
});
```

##예제 실행법

콘솔창에서 location.pathname="/예제이름" 
```js
location.pathname="/exam2-1" 

```
또는 주소창에서 

```
http://localhost:3000/exam2
```


### Change log ###

