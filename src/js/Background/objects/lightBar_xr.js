import * as THREE from "three";
import { ShaderMaterial } from 'three';

export default class LightBar extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){
        super();

        this.frame = 0;
        // this.frame2 = 0;
        this.speed = 3;

        this.createMeshMaterial_Ring = this.createMeshMaterial_Ring.bind(this);
        this.createMeshMaterial_Grade = this.createMeshMaterial_Grade.bind(this);

        this.createMeshMaterial_Ring();
        this.createMeshMaterial_Grade();


        // 平面をつくる（幅, 高さ, 横分割数, 縦分割数）
        const geo = new THREE.CylinderGeometry(600,600,400,64);
        var mat = [ this.meshMatGrade,this.meshMatRing, this.meshMatRing];

        // var mat = new THREE.MeshBasicMaterial( {
        //     wireframe: true,
        //     color: 0x4ea78e,
        //     side: THREE.DoubleSide,
        //     opacity: 0.8,
        //     transparent: true,
        // } );


        this.lightBarmesh = new THREE.Mesh(geo, mat); 
        this.lightBarmesh.position.set(160, 200, 160);
        this.lightBarmesh.rotation.x = 0* Math.PI/180;
        
        
        this.add(this.lightBarmesh);

    }

    update(){

        
        this.frame += this.speed;
        // if(this.frame > 900 || this.frame < -100){
        //     this.speed *= -1;
        // }

        if(this.frame > 900 ){
            this.frame = 0;
        }

        const sec = this.frame/1000;
        this.meshMatRing.uniforms.uTime.value = sec;// シェーダーに渡す時間を更新
        this.meshMatGrade.uniforms.uTime.value = sec;// シェーダーに渡す時間を更新


    }

    createMeshMaterial_Ring(){
        
        // uniform変数を定義
        this.uniforms = {
            // uAspect: { value: this.w / this.h},
            uAspect:    { value: 1 / 1 },
            uTime:    { value: 100.0 },
            color:    { value: new THREE.Color(0x734ca4) },
            color2:    { value: new THREE.Color(0x4ea78e) },//0x4ea78
            // alpha:    {},
            resolution:    { value: new THREE.Vector2()} 
        };

        this.uniforms.resolution.value.x = 100;
        this.uniforms.resolution.value.y = 100;


        // 頂点シェーダーのソース
        const vertexSource = `
        varying vec2 vUv;
        uniform float uAspect;

        void main() {
            vUv = uv;

            // vec3 pos = position;
            // gl_Position = vec4(pos, 1.0);

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;

        // ピクセルシェーダーのソース
        const fragmentSource = `
        varying vec2 vUv;
        uniform float uAspect;
        uniform float uTime;
        uniform vec3 color;
        uniform vec3 color2;

        void main() {

            ////オーブ
            // vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            // vec2 center = vec2( .5 * uAspect, .5 );
            // float radius = 0.5 + sin( uTime * 2.0 ) * 0.25;// 時間で半径をアニメーションさせる
            // float lightness = radius / length( uv - center );// 半径を距離で割る
            // // lightness = clamp( lightness, 0.0, 1.0 );
            // vec4 color = vec4( vec3( lightness ), 1.0 );
            // color *= vec4( 0.2, 1.0, 0.5, 0.5 );
            // gl_FragColor = color;


            ////グラデ
            // vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            // vec3 gradate = color * uv.y + color2 * (1.0 - uv.y);
            // gl_FragColor = vec4(gradate, 0.5 );


            // //輪っか
            // vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            // vec2 center = vec2( .5 * uAspect, .5 );
            // vec2  p = uv - center;
            // float radius = uTime;// 時間で半径をアニメーションさせる
            // float lightness = 0.0005/ abs(length(p)- radius);
            // vec3 outColor = lightness * color2;
            // gl_FragColor = vec4( vec3( outColor ),0.5 );

            //輪っか
            vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            vec2 center = vec2( .5 * uAspect, .5 );
            vec2  p = uv - center;
            float radius = uTime;// 時間で半径をアニメーションさせる
            float lightness = 0.0002/ abs(length(p)- radius);
            float radius2 = uTime - 0.35;// 時間で半径をアニメーションさせる
            float lightness2 = 0.0002/ abs(length(p)- radius2);
            float radius3 = uTime - 0.4;// 時間で半径をアニメーションさせる
            float lightness3 = 0.0002/ abs(length(p)- radius3);

            float radiusP = uTime + 0.0;// 時間で半径をアニメーションさせる
            float lightnessP = 0.0002/ abs(length(p)- radiusP);// 半径を距離で割る


            vec3 outColor = (lightness + lightness2 + lightness3 +lightnessP)* color2;
            gl_FragColor = vec4( vec3( outColor ),0.5 );

        }
        `;

        // シェーダーソースを渡してマテリアルを作成
        this.meshMatRing = new ShaderMaterial({
            vertexShader: vertexSource,
            fragmentShader: fragmentSource,
            // wireframe: true,
            uniforms: this.uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
        });


        return this.meshMatRing;
    }



    createMeshMaterial_Grade(){
        
        // uniform変数を定義
        this.uniforms = {
            // uAspect: { value: this.w / this.h},
            uAspect:    { value: 1 / 1 },
            uTime:    { value: 100.0 },
            color:    { value: new THREE.Color(0x734ca4) },
            color2:    { value: new THREE.Color(0x4ea78e) },//0x4ea78
            // alpha:    {},
            resolution:    { value: new THREE.Vector2()} 
        };

        this.uniforms.resolution.value.x = 100;
        this.uniforms.resolution.value.y = 100;


        // 頂点シェーダーのソース
        const vertexSource = `
        varying vec2 vUv;
        uniform float uAspect;

        void main() {
            vUv = uv;

            // vec3 pos = position;
            // gl_Position = vec4(pos, 1.0);

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;

        // ピクセルシェーダーのソース
        const fragmentSource = `
        varying vec2 vUv;
        uniform float uAspect;
        uniform float uTime;
        uniform vec3 color;
        uniform vec3 color2;

        void main() {


            vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            vec2 center = vec2( 0.5 * uAspect, 0.0 );
            vec2  p = uv - center;
            
            // //グラデ
            // vec2 q = mod(p, 0.142857) - 0.0;
            // float f = 0.2 / abs(q.x) ; 
            // vec3 gradate  = color2 /(f) ; 
            // // vec3 gradate = color * uv.x + color2 * (1.0 - uv.x);
            // // gl_FragColor = vec4(gradate, 0.5 );


            //横ライン
            // vec2 center = vec2( 0.5 * uAspect, 0.0 );
            // vec2  p = uv - center;
            float radius = uTime;// 時間で半径をアニメーションさせる
            float lightness = 0.0002/ abs(length(p)- radius);
            float radius2 = uTime - 0.2;// 時間で半径をアニメーションさせる
            float lightness2 = 0.002/ abs(length(p)- radius2);
            float radius3 = uTime - 0.4;// 時間で半径をアニメーションさせる
            float lightness3 = 0.002/ abs(length(p)- radius3);
            float radius4 = uTime + 0.2;// 時間で半径をアニメーションさせる
            float lightness4 = 0.002/ abs(length(p)- radius4);
            vec3 outColor = (lightness + lightness2 + lightness3 + lightness4)* color2;
            gl_FragColor = vec4( vec3( outColor ),0.5 );
            // gl_FragColor = vec4( vec3( outColor )+vec3( gradate ),0.5 );


        }
        `;

        // シェーダーソースを渡してマテリアルを作成
        this.meshMatGrade = new ShaderMaterial({
            vertexShader: vertexSource,
            fragmentShader: fragmentSource,
            // wireframe: true,
            uniforms: this.uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
        });


        return this.meshMatGrade;
    }





}
