import * as THREE from "three";
import { ShaderMaterial } from 'three';

export default class MoveRing extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){
        super();

        this.frame = 0;

        // uniform変数を定義
        this.uniforms = {
            // uAspect: { value: this.w / this.h},
            uAspect:    { value: 1600 / 900 },
            uTime:    { value: 100.0 },
            color:    { value: new THREE.Color(0x734ca4) },
            color2:    { value: new THREE.Color(0x4ea78) },
            // alpha:    {},
            resolution:    { value: new THREE.Vector2()} 
        };

        this.uniforms.resolution.value.x = 1600;
        this.uniforms.resolution.value.y = 900;


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


            //グラデ
            // vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            // vec3 gradate = color * uv.y + color2 * (1.0 - uv.y);
            // gl_FragColor = vec4(gradate, 0.5 );


            //輪っか
            vec2 uv = vec2( vUv.x * uAspect, vUv.y );
            vec2 center = vec2( .5 * uAspect, .5 );
            vec2  p = uv - center;
            // float radius = (sin(uTime * 2.0)+ 1.0)/ 2.0 * 0.5;// 時間で半径をアニメーションさせる
            float radius = uTime;// 時間で半径をアニメーションさせる
            float lightness = 0.0005/ abs(length(p)- radius);// 半径を距離で割る
            vec3 outColor = lightness * color2;
            gl_FragColor = vec4( vec3( outColor ),0.5 );


            // lightness = clamp( lightness, 0.0, 1.0 );
            // vec4 color = vec4( vec3( lightness ), 1.0 );
            // color *= vec4( 0.2, 1.0, 0.5, 0.5 );
            // gl_FragColor = color;



        }
        `;

        // シェーダーソースを渡してマテリアルを作成
        const meshMat = new ShaderMaterial({
            vertexShader: vertexSource,
            fragmentShader: fragmentSource,
            // wireframe: true,
            uniforms: this.uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });


        // return meshMat;





        // 平面をつくる（幅, 高さ, 横分割数, 縦分割数）
        const geo = new THREE.PlaneGeometry(1600, 1600, 1, 1);
        // geo.makeRotationX( 70* Math.PI/180);

        var mat = [meshMat,meshMat];
        // const mat = new THREE.MeshFaceMaterial([]);
        
        // this.moveRingGeometry = new THREE.CircleGeometry(500, 64);
        this.moveRingmesh = new THREE.Mesh(geo, mat); 
        this.moveRingmesh.position.set(160, 0, 160);
        // this.moveRingmesh.position.set(100, 0, 0);
        this.moveRingmesh.rotation.x = -90* Math.PI/180;
        
        
        this.add(this.moveRingmesh);

    }

    update(){

        if(this.frame < 1000){
            this.frame += 5;
        }else{
            this.frame = 0;
        }
        // this.RingRadius = this.frame;
        // console.log(this.RingRadius);


        // const sec = performance.now() / 1000;
        const sec = this.frame/1000;
        this.uniforms.uTime.value = sec;// シェーダーに渡す時間を更新
        // console.log(this.uniforms.uTime.value);

        // this.moveRingmesh.rotation.y = 120 * Math.PI/180;




    }

}
