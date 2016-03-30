/**
 * @author 도플광어

 -버전 0.13
 Box2d 추가

 *
 * 버전 0.12
 * matrix 추가
 * box2d 추가
 *
 */

var gbox3d = {
    core : {}

};
///
//수학 함수관련 선언
///
gbox3d.core.PI = 3.14159265359;
gbox3d.core.RECIPROCAL_PI = 1 / 3.14159265359;
gbox3d.core.HALF_PI = 3.14159265359 / 2;
gbox3d.core.PI64 = 3.141592653589793;
gbox3d.core.DEGTORAD = 3.14159265359 / 180;
gbox3d.core.RADTODEG = 180 / 3.14159265359;
gbox3d.core.TOLERANCE = 1e-8;
gbox3d.core.radToDeg = function(a) {
    return a * gbox3d.core.RADTODEG
};
gbox3d.core.degToRad = function(a) {
    return a * gbox3d.core.DEGTORAD
};
gbox3d.core.iszero = function(b) {
    return (b < 1e-8) && (b > -1e-8)
};
gbox3d.core.isone = function(b) {
    return (b + 1e-8 >= 1) && (b - 1e-8 <= 1)
};
gbox3d.core.equals = function(d, c) {
    return (d + 1e-8 >= c) && (d - 1e-8 <= c)
};
gbox3d.core.clamp = function(c, a, b) {
    if (c < a) {
        return a
    }
    if (c > b) {
        return b
    }
    return c
};

//일정 범위의 랜덤 값 만들기
gbox3d.core.randomIntFromTo = function (from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}
gbox3d.core.randomFloatFromTo = function(from, to){
    return Math.random() * (to - from + 1) + from;
}

gbox3d.core.fract = function(a) {
    return a - Math.floor(a)
};
gbox3d.core.max3 = function(e, d, f) {
    if (e > d) {
        if (e > f) {
            return e
        }
        return f
    }
    if (d > f) {
        return d
    }
    return f
};
gbox3d.core.min3 = function(e, d, f) {
    if (e < d) {
        if (e < f) {
            return e
        }
        return f
    }
    if (d < f) {
        return d
    }
    return f
};

gbox3d.core.round = function(num, valid) {
    v = Math.pow(10, valid);
    return Math.round(num * v) / v;
}

gbox3d.core.epsilon = function ( value ) {

    return Math.abs( value ) < 0.000001 ? 0 : value;

};

gbox3d.core.getAlpha = function(a) {
    return ((a & 4278190080) >>> 24)
};
gbox3d.core.getRed = function(a) {
    return ((a & 16711680) >> 16)
};
gbox3d.core.getGreen = function(a) {
    return ((a & 65280) >> 8)
};
gbox3d.core.getBlue = function(a) {
    return ((a & 255))
};
gbox3d.core.createColor = function(d, f, e, c) {
    d = d & 255;
    f = f & 255;
    e = e & 255;
    c = c & 255;
    return (d << 24) | (f << 16) | (e << 8) | c
};
gbox3d.core.ColorF = function() {
    this.A = 1;
    this.R = 1;
    this.G = 1;
    this.B = 1
};
gbox3d.core.ColorF.prototype.clone = function() {
    var a = new gbox3d.core.Light();
    a.A = this.A;
    a.R = this.R;
    a.G = this.G;
    a.B = this.B;
    return a
};
gbox3d.core.ColorF.prototype.A = 1;
gbox3d.core.ColorF.prototype.R = 1;
gbox3d.core.ColorF.prototype.G = 1;
gbox3d.core.ColorF.prototype.B = 1;

//타이머 객체
//gbox3d.core.CLTimer = function() {
//
//};
//
//gbox3d.core.CLTimer.getTime = function() {
//	var a = new Date();
//	return a.getTime()
//};

gbox3d.core.Timer = function() {
    this.prevTime =  (new Date()).getTime();
};

gbox3d.core.Timer.prototype.getTime = function() {
    var a = new Date();
    return a.getTime()
};

gbox3d.core.Timer.prototype.getDeltaTime = function() {
    var current = this.getTime();
    var delta = current - this.prevTime;
    this.prevTime =  current;

    return delta/1000.0;
}

gbox3d.core.Timer.prototype.getDeltaTick = function() {
    var current = this.getTime();
    var delta = current - this.prevTime;
    this.prevTime =  current;

    return delta;
}



// Vect3D (3D 벡터 )

gbox3d.core.Vect3d = function(a, c, b) {
    if (a == null) {
        this.X = 0;
        this.Y = 0;
        this.Z = 0
    } else {
        this.X = a;
        this.Y = c;
        this.Z = b
    }
};

gbox3d.core.Vect3d.prototype.X = 0;
gbox3d.core.Vect3d.prototype.Y = 0;
gbox3d.core.Vect3d.prototype.Z = 0;
gbox3d.core.Vect3d.prototype.set = function(a, c, b) {
    this.X = a;
    this.Y = c;
    this.Z = b
};
gbox3d.core.Vect3d.prototype.clone = function() {
    return new gbox3d.core.Vect3d(this.X, this.Y, this.Z)
};

gbox3d.core.Vect3d.prototype.copyTo = function(a) {
    a.X = this.X;
    a.Y = this.Y;
    a.Z = this.Z
};

gbox3d.core.Vect3d.prototype.setTo = function(a) {
    this.X = a.X;
    this.Y = a.Y;
    this.Z = a.Z;

    return this
};

gbox3d.core.Vect3d.prototype.substract = function(a) {
    return new gbox3d.core.Vect3d(this.X - a.X, this.Y - a.Y, this.Z - a.Z)
};
gbox3d.core.Vect3d.prototype.substractFromThis = function(a) {
    this.X -= a.X;
    this.Y -= a.Y;
    this.Z -= a.Z
};
gbox3d.core.Vect3d.prototype.add = function(a) {
    return new gbox3d.core.Vect3d(this.X + a.X, this.Y + a.Y, this.Z + a.Z)
};
gbox3d.core.Vect3d.prototype.addToThis = function(a) {
    this.X += a.X;
    this.Y += a.Y;
    this.Z += a.Z
};
gbox3d.core.Vect3d.prototype.addToThisReturnMe = function(a) {
    this.X += a.X;
    this.Y += a.Y;
    this.Z += a.Z;
    return this
};
gbox3d.core.Vect3d.prototype.normalize = function() {
    var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    if (a > -1e-7 && a < 1e-7) {
        return
    }
    a = 1 / Math.sqrt(a);
    this.X *= a;
    this.Y *= a;
    this.Z *= a;

    return this;
};
gbox3d.core.Vect3d.prototype.getNormalized = function() {
    var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    if (a > -1e-7 && a < 1e-7) {
        return new gbox3d.core.Vect3d(0, 0, 0)
    }
    a = 1 / Math.sqrt(a);
    return new gbox3d.core.Vect3d(this.X * a, this.Y * a, this.Z * a)
};
gbox3d.core.Vect3d.prototype.setLength = function(b) {
    var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    if (a > -1e-7 && a < 1e-7) {
        return
    }
    a = b / Math.sqrt(a);
    this.X *= a;
    this.Y *= a;
    this.Z *= a
};

gbox3d.core.Vect3d.prototype.equals = function(a) {
    return gbox3d.core.equals(this.X, a.X) && gbox3d.core.equals(this.Y, a.Y) && gbox3d.core.equals(this.Z, a.Z)
};
gbox3d.core.Vect3d.prototype.equalsZero = function() {
    return gbox3d.core.iszero(this.X) && gbox3d.core.iszero(this.Y) && gbox3d.core.iszero(this.Z)
};
gbox3d.core.Vect3d.prototype.equalsByNumbers = function(a, c, b) {
    return gbox3d.core.equals(this.X, a) && gbox3d.core.equals(this.Y, c) && gbox3d.core.equals(this.Z, b)
};
gbox3d.core.Vect3d.prototype.isZero = function() {
    return this.X == 0 && this.Y == 0 && this.Z == 0
};
gbox3d.core.Vect3d.prototype.getLength = function() {
    return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z)
};
gbox3d.core.Vect3d.prototype.getDistanceTo = function(b) {
    var a = b.X - this.X;
    var d = b.Y - this.Y;
    var c = b.Z - this.Z;
    return Math.sqrt(a * a + d * d + c * c)
};
gbox3d.core.Vect3d.prototype.getDistanceFromSQ = function(b) {
    var a = b.X - this.X;
    var d = b.Y - this.Y;
    var c = b.Z - this.Z;
    return a * a + d * d + c * c
};
gbox3d.core.Vect3d.prototype.getLengthSQ = function() {
    return this.X * this.X + this.Y * this.Y + this.Z * this.Z
};
gbox3d.core.Vect3d.prototype.multiplyWithScal = function(a) {
    return new gbox3d.core.Vect3d(this.X * a, this.Y * a, this.Z * a)
};
gbox3d.core.Vect3d.prototype.multiplyThisWithScal = function(a) {
    this.X *= a;
    this.Y *= a;
    this.Z *= a
};
gbox3d.core.Vect3d.prototype.multiplyThisWithScalReturnMe = function(a) {
    this.X *= a;
    this.Y *= a;
    this.Z *= a;
    return this
};
gbox3d.core.Vect3d.prototype.multiplyThisWithVect = function(a) {
    this.X *= a.X;
    this.Y *= a.Y;
    this.Z *= a.Z
};
gbox3d.core.Vect3d.prototype.multiplyWithVect = function(a) {
    return new gbox3d.core.Vect3d(this.X * a.X, this.Y * a.Y, this.Z * a.Z)
};
gbox3d.core.Vect3d.prototype.divideThisThroughVect = function(a) {
    this.X /= a.X;
    this.Y /= a.Y;
    this.Z /= a.Z
};
gbox3d.core.Vect3d.prototype.divideThroughVect = function(a) {
    return new gbox3d.core.Vect3d(this.X / a.X, this.Y / a.Y, this.Z / a.Z)
};
gbox3d.core.Vect3d.prototype.crossProduct = function(a) {
    return new gbox3d.core.Vect3d(this.Y * a.Z - this.Z * a.Y, this.Z * a.X - this.X * a.Z, this.X * a.Y - this.Y * a.X)
};
gbox3d.core.Vect3d.prototype.dotProduct = function(a) {
    return this.X * a.X + this.Y * a.Y + this.Z * a.Z;
};

//(0,0,1)을 기준으로 각도를 구한다
gbox3d.core.Vect3d.prototype.getHorizontalAngle = function() {
    var b = new gbox3d.core.Vect3d();
    b.Y = gbox3d.core.radToDeg(Math.atan2(this.X, this.Z));
    if (b.Y < 0) {
        b.Y += 360
    }
    if (b.Y >= 360) {
        b.Y -= 360
    }
    var a = Math.sqrt(this.X * this.X + this.Z * this.Z);
    b.X = gbox3d.core.radToDeg(Math.atan2(a, this.Y)) - 90;
    if (b.X < 0) {
        b.X += 360
    }
    if (b.X >= 360) {
        b.X -= 360
    }
    return b;
};
gbox3d.core.Vect3d.prototype.toString = function() {
    return "(x: " + this.X + " y:" + this.Y + " z:" + this.Z + ")";
};

///////////////////////////////////////////////////////////
//벡터 2D
gbox3d.core.Vect2d = function(a, b) {

    if (a == null) {
        this.X = 0;
        this.Y = 0
    } else {
        if (a.x != null) {
            this.X = a.x;
            this.Y = a.y;
        } else if (a.X != null) {
            this.X = a.X;
            this.Y = a.Y;
        } else {
            this.X = a;
            this.Y = b;
        }
    }
};
gbox3d.core.Vect2d.prototype.X = 0;
gbox3d.core.Vect2d.prototype.Y = 0;

gbox3d.core.Vect2d.prototype.rotate = function(angle, center) {

    var cs = Math.cos(angle);
    var sn = Math.sin(angle);

    var x, y;

    if (center == undefined) {
        center = new gbox3d.core.Vect2d(0, 0);

    }
    this.X -= center.X;
    this.Y -= center.Y;

    this.set((this.X * cs - this.Y * sn), -(this.X * sn + this.Y * cs));

    this.X += center.X;
    this.Y += center.Y;
}
gbox3d.core.Vect2d.prototype.translate = function( param ) {
    this.X += param.X;
    this.Y += param.Y;
    return this;
}

gbox3d.core.Vect2d.prototype.multiply = function(mult) {
    this.X *= mult;
    this.Y *= mult;
    return this;
}

gbox3d.core.Vect2d.prototype.add = function(a) {
    return new gbox3d.core.Vect2d(this.X + a.X, this.Y + a.Y);
};

gbox3d.core.Vect2d.prototype.addToThis = function(a) {
    this.X += a.X;
    this.Y += a.Y;
    return this;
}



gbox3d.core.Vect2d.prototype.sub = function(a,b) {

    if(!b) {
        return new gbox3d.core.Vect2d(this.X - a.X, this.Y - a.Y);
    }
    else
        return new gbox3d.core.Vect2d(this.X - a, this.Y - b);


};
gbox3d.core.Vect2d.prototype.subToThis = function(a) {
    this.X -= a.X;
    this.Y -= a.Y;

    return this;
}

gbox3d.core.Vect2d.prototype.getDistance = function() {
    return Math.sqrt(this.X * this.X + this.Y * this.Y);
}

gbox3d.core.Vect2d.prototype.normalize = function() {
    dist = this.getDistance();
    // Math.sqrt(this.X * this.X + this.Y * this.Y);
    this.X /= dist;
    this.Y /= dist;
    return this;
}

gbox3d.core.Vect2d.prototype.set = function(x, y) {
    this.X = x;
    this.Y = y;
    return this;
}

gbox3d.core.Vect2d.prototype.copy = function(a) {
    this.X = a.X;
    this.Y = a.Y;
    return this;
}

gbox3d.core.Vect2d.prototype.set_point = function(a) {
    this.X = a.x;
    this.Y = a.y;
    return this;
}

gbox3d.core.Vect2d.prototype.clone = function() {
    return new gbox3d.core.Vect2d(this.X, this.Y);
}

gbox3d.core.Vect2d.prototype.getAngle = function() {

    var X = this.X;
    var Y = this.Y;

    if (Y == 0)// corrected thanks to a suggestion by Jox
        return X < 0 ? 180 : 0;
    else if (X == 0)
        return Y < 0 ? 90 : 270;

    // don't use getLength here to avoid precision loss with s32 vectors
    var tmp = Y / Math.sqrt((X * X + Y * Y));
    tmp = Math.atan(Math.sqrt(1 - tmp * tmp) / tmp) * gbox3d.core.RADTODEG;

    if (X > 0 && Y > 0)
        return tmp + 270;
    else if (X > 0 && Y < 0)
        return tmp + 90;
    else if (X < 0 && Y < 0)
        return 90 - tmp;
    else if (X < 0 && Y > 0)
        return 270 - tmp;

    return tmp;
}
gbox3d.core.Vect2d.prototype.getDistanceTo = function(b) {
    var a = b.X - this.X;
    var d = b.Y - this.Y;

    return Math.sqrt(a * a + d * d);
}

gbox3d.core.Vect2d.prototype.formSVG = function(svgElement) {

    switch(svgElement.tagName)
    {
        case 'circle':
        case 'ellipse':
            this.X = parseInt(svgElement.getAttribute('cx'));
            this.Y = parseInt(svgElement.getAttribute('cy'));
            break;
        case 'rect':
            this.X = parseInt(svgElement.getAttribute('x'));
            this.Y = parseInt(svgElement.getAttribute('y'));
            break;
    }
}

gbox3d.core.Vect2d.prototype.toSVG = function(svgElement) {

    switch(svgElement.tagName)
    {
        case 'circle':
        case 'ellipse':
            svgElement.setAttribute('cx',this.X);
            svgElement.setAttribute('cy',this.Y);
            break;
        case 'rect':
            svgElement.setAttribute('x',this.X);
            svgElement.setAttribute('y',this.Y);
            break;
    }
}
gbox3d.core.Vect2d.prototype.InPolygon = function(points) {
    var length  = points.length;
    var counter = 0;
    var x_inter;

    var p1 = points[0];

    for ( var i = 1; i <= length; i++ ) {
        var p2 = points[i%length];

        if ( this.Y > Math.min(p1.Y, p2.Y)) {
            if ( this.Y <= Math.max(p1.Y, p2.Y)) {
                if ( this.X <= Math.max(p1.X, p2.X)) {
                    if ( p1.Y != p2.y ) {

                        x_inter = (this.Y - p1.Y) * (p2.X - p1.X) / (p2.Y - p1.Y) + p1.X;
                        //console.log(x_inter);

                        if ( p1.X == p2.X || this.X <= x_inter) {
                            counter++;
                        }
                    }
                }
            }
        }
        p1 = p2;
    }

    /*
     var p1 = this.handles[0].point;

     for ( var i = 1; i <= length; i++ ) {
     var p2 = this.handles[i%length].point;

     if ( point.y > Math.min(p1.y, p2.y)) {
     if ( point.y <= Math.max(p1.y, p2.y)) {
     if ( point.x <= Math.max(p1.x, p2.x)) {
     if ( p1.y != p2.y ) {
     x_inter = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
     if ( p1.x == p2.x || point.x <= x_inter) {
     counter++;
     }
     }
     }
     }
     }
     p1 = p2;
     }
     */

    return ( counter % 2 == 1 );
};

gbox3d.core.Vect2d.prototype.toString = function() {
    return '{"X" :' + this.X + ',"Y":' + this.Y + '}';
}

///////////////////////////////////////////////////////////
//box 2D

gbox3d.core.Box2d = function(param) {

    //param = param || {topleft:new,bottomright:0};
    if(param) {
        this.topLeft = param.topleft;
        this.bottomRight = param.bottomright;
    }
};

gbox3d.core.Box2d.prototype.ptInBox = function(x,y) {

    if(this.topLeft.X < x && this.bottomRight.X > x ) {
        if(this.topLeft.Y < y && this.bottomRight.Y > y ) {
            return true;
        }
    }

    return false;

}

//DOM 앨리먼트의 충돌 사각형 영역 얻기
gbox3d.core.Box2d.prototype.getCollisionArea = function (node) {

    var width =  parseInt( node.css('width').slice(0,-2));
    var height = parseInt (node.css('height').slice(0,-2));

    //console.log(node.css('-webkit-transform'));

    var sx,sy
    var strmat = node.css('-webkit-transform');
    if(strmat == 'none') {
        sx = 0;
        sy = 0;

    }
    else {

        strmat = strmat.slice(0,-1);
        strmat = strmat.slice(7,strmat.length);

        var temp = strmat.split(',');

        sx = parseInt( temp[4]);
        sy = parseInt( temp[5] );

        //console.log(strmat);
    }

    this.topLeft = new gbox3d.core.Vect2d(sx,sy);
    this.bottomRight = new gbox3d.core.Vect2d(sx+width,sy+height);

//    return new gbox3d.core.Box2d({
//
//        topleft :  new gbox3d.core.Vect2d(sx,sy),
//        bottomright: new gbox3d.core.Vect2d(sx+width,sy+height)
//
//    });
};



///////////////matrix2d
///
/*
 var computedStyle = window.getComputedStyle(element);
 var css_transform = computedStyle.getPropertyValue('-webkit-transform');
 */
gbox3d.core.matrix2d = function(css_transform) {
    if(css_transform) {
        this.matrix = new WebKitCSSMatrix(css_transform);
    }
    else {
        this.matrix = new WebKitCSSMatrix();
    }

};

gbox3d.core.matrix2d.prototype.setupFromElement = function(element)
{
    var computedStyle = window.getComputedStyle(element);
    var css_transform = computedStyle.getPropertyValue('-webkit-transform');
    this.matrix = new WebKitCSSMatrix(css_transform);

}

gbox3d.core.matrix2d.prototype.translate = function(x,y) {

    this.matrix = this.matrix.translate(x,y);
};
gbox3d.core.matrix2d.prototype.rotate = function(angle) {
    this.matrix = this.matrix.rotate(angle);
};
gbox3d.core.matrix2d.prototype.scale = function(x,y) {
    this.matrix = this.matrix.scale(x,y);
};

//행렬 분해
gbox3d.core.matrix2d.prototype.decompose = function() {

    var cssmat = this.matrix;
    //이동변환 얻기
    var x = cssmat.e;
    var y = cssmat.f;

    //스케일 얻기
    var scalex = Math.sqrt(cssmat.a*cssmat.a + cssmat.b*cssmat.b);
    var scaley = Math.sqrt(cssmat.c*cssmat.c + cssmat.d*cssmat.d);

    //회전 얻기
    var angle = Math.round(Math.atan2(cssmat.b/scalex, cssmat.a/scalex) * (180/Math.PI));

    return {
        x: x,
        y: y,
        scalex : scalex,
        scaley : scaley,
        angle:angle
    }
}

gbox3d.core.matrix2d.prototype.compose = function(param) {

    this.matrix = new WebKitCSSMatrix();

    if(param.translation) {
        this.matrix = this.matrix.translate(param.translation.x,param.translation.y);
    }

    if(param.angle)
        this.matrix = this.matrix.rotate(param.angle);

    if(param.scale)
        this.matrix = this.matrix.scale(param.scale.x,param.scale.y);


}


gbox3d.core.matrix2d.prototype.setTranslation = function(x,y) {

    //this.matrix = this.matrix = new WebKitCSSMatrix();
    this.matrix.e = x;
    this.matrix.f = y;
};

/*
 gbox3d.core.matrix2d.prototype.setRotation = function(angle) {
 //단위행렬로 재초기화
 //this.matrix = this.matrix = new WebKitCSSMatrix();
 this.matrix = this.matrix.rotate(angle);
 };

 gbox3d.core.matrix2d.prototype.setScale = function(x,y) {
 //this.matrix = this.matrix = new WebKitCSSMatrix();
 this.matrix = this.matrix.scale(x,y);

 };
 */

gbox3d.core.matrix2d.prototype.toString = function() {

    return this.matrix.toString();
};


/////////////////////////
//애니미에션 프레임 초기화
//타이머 보단 좀 나은듯?
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
        || function(callback) {
        //60 fps.
        window.setTimeout(callback, 1000 / 60);
    };

    window.requestAnimationFrame = requestAnimationFrame;
})();


///////System 관련 모듈////
/////////////////////////

gbox3d.system = {

    //코루틴 관리자.(지연 실행 관리자, 지연후 특정 타이밍 호출할필요가 있을때 사용한다.)
    CoroutineManger : function(param) {
        this.Callbacks = new Array();

        this.Apply = function(deltatime) {

            while(this.Callbacks.length > 0) {

                var callback = this.Callbacks.pop();

                callback({
                    deltaTime : deltatime
                });

            }

        }

        this.yield = function(coroutin) {

            this.Callbacks.push(coroutin);
        }
    }

};


///////helper  모듈////
/////////////////////////
gbox3d.helper = {

    css : {
        getElementWidth : function(element) {
            return parseInt(element.style.width.slice(0,-2));
        },
        getElementHeight : function(element) {
            return parseInt(element.style.height.slice(0,-2));
        }
    }
}








