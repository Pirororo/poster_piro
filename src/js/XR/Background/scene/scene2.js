// import * as THREE from '../../libs/three.module.js';
// import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';

import * as THREE from "three";
import {Camera} from '../camera/camera.js';
// import Line from '../objects/line.js';

/**
 * シーンクラス：カメラとライト
 */
export class Scene extends THREE.Scene {

    constructor(){

        super();

        // this._frame = 0;//frame

        //カメラ３種
        //mainCamera
        this.camera = new Camera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする
        // this.camera.position.x = 215;
        // this.camera.position.y = 180;
        // this.camera.position.z = 150;

        // this.camera.position.x = -55;
        // this.camera.position.y = 35;
        // this.camera.position.z = 65;



        // //単純な動きならこっちの書き方のほうがみやすいかも
        // //ここから
        // this.camPos = {x: 215, y: 180, z: 150};
        // this.camera.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

        // // var rndPos = (2*Math.random()-1)*100;//-100~100
        // // this.camTarget= {x:rndPos, y:rndPos, z:rndPos};
        // this.camTarget= {x:50, y:20, z:-100};


        // this.tween = new TWEEN.Tween(this.camPos).to(this.camTarget, 1000).easing(TWEEN.Easing.Elastic.InOut).onUpdate(function(){
        // console.log('update');
        // this.camera.position.x = this.camPos.x;
        // this.camera.position.y = this.camPos.y;
        // this.camera.position.z = this.camPos.z;
        // }).delay(1500).start();//tween.start();も省略されてる
        // //ここまで

        

        // //roomCamera
        // this.roomCamera = new RoomCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする

        // //moveCamera
        // this.moveCamera = new MoveCamera();//thisにすること！！！最終的にはgame2.jsでsceneにaddする


        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        // this.add(ambientLight);

        // 平行光源
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        // this.add(directionalLight);

        //スポットライト
        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.castShadow = true;
        spotLight.position.set(80, 60, 50);
        spotLight.intensity = 1;
        // spotLight.shadow.mapSize.width = 2048;
        // spotLight.shadow.mapSize.height = 2048;
        // spotLight.shadow.camera.fov = 120;
        // spotLight.shadow.camera.near = 1;
        // spotLight.shadow.camera.far = 1000;
        // this.add(spotLight);

        //シェーダーのエフェクトをマスクするためシーン２種類にわけた
        this.scene1 = new Scene1();
        this.add(this.scene1);

        this.scene2 = new Scene2();
        this.scene2.add(ambientLight);
        // this.scene2.add(directionalLight);
        this.scene2.add(spotLight);
        this.add(this.scene2);

        

    }

    update(){
        // TWEEN.update();
        this.camera.update();//lookAtで中心みてる
        this.scene1.update();
        this.scene2.update();
    }

}

export class Scene1 extends THREE.Scene {

    constructor(){

        super();


        // //ライン
        // this._line = new Line();
        // this._line.position.set(0,0,0);
        // this.add(this._line);

        // //ライン2
        // this._line2 = new Line();
        // // this._line2.rotation.x = 180 * Math.PI/180;
        // // this._line2.rotation.z = 90 * Math.PI/180;
        // this.add(this._line2);

        // //ライン3
        // this._line3 = new Line();
        // // this._line3.rotation.x = 90 * Math.PI/180;
        // // this._line3.rotation.y = 90 * Math.PI/180;
        // this.add(this._line3);

        // //ライン4
        // this._line4 = new Line();
        // // this._line4.rotation.z = 180 * Math.PI/180;
        // // this._line4.rotation.y = 90 * Math.PI/180;
        // this.add(this._line4);

        // //BOX
        // this.body = new THREE.Mesh(
        // new THREE.BoxGeometry(10, 10, 10),
        // new THREE.MeshLambertMaterial({
        //     color: 0xff0000,
        // })
        // );
        // this.body.position.set(0,0,0);
        // this.add(this.body);

    }
    
    update(){

        // this._line.update();
        // this._line2.update();
        // this._line3.update();
        // this._line4.update();
    }

}

export class Scene2 extends THREE.Scene {

    constructor(){

        super();
        this.createMesh = this.createMesh.bind(this);

        this.frame = 0;

        //プレート
        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        // const material = new THREE.MeshLambertMaterial({ 
        //     color: 0xffffff, 
        //     opacity: 0.2,
        //     transparent: true,
        //     // depthTest: false,
        //     side: THREE.DoubleSide,
        // });

        this.material = new THREE.MeshBasicMaterial( { 
            color: 0xffffff, 
            wireframe: true,
            opacity: 0.8,
            transparent: true,
           // depthTest: true,
            blending: THREE.AdditiveBlending
        } );

        // const PlateNum = 800;
        const PlateNum = 1;

        this.positions = [];
        this.posTarget = [];


        for (let i = 0; i < PlateNum; i++) {

            this.floorsize = 12;
            this.geometry = new THREE.BoxBufferGeometry(this.floorsize, 1, this.floorsize);

            //もとのやつ
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(0,0,0);
            this.meshGroup.add(this.mesh);

            // 配列に保存
            this.meshList.push(this.mesh);

            // 現在のpositions
            this.positions.push( this.mesh.position.x, this.mesh.position.y, this.mesh.position.z );

            // ターゲット位置のpositions
            this.posTarget.push(0,0,0);
        }
        this.add(this.meshGroup);

    }
    
    update(){

        this.frame += 1;

        for (let i = 0; i < this.meshList.length; i++) {

            // this.meshList[i].geometry.width = 100;//きかない
            // // console.log(this.meshList[i].geometry.width);
            // this.meshList[i].geometry.needUpdate = true;//きかない

            this.meshList[this.PlateNum+i].position.x = this.positions[this.PlateNum+
                (3*i+ 0)];
            this.meshList[this.PlateNum+i].position.y = this.positions[this.PlateNum+
                (3*i+ 1)];
            this.meshList[this.PlateNum+i].position.z = this.positions[this.PlateNum+
                (3*i+ 2)];

            this.positions[this.PlateNum+(3*i+ 0)] 
                += (this.posTarget[this.PlateNum+(3*i+ 0)] 
                - this.positions[this.PlateNum+(3*i+ 0)]) *0.02;
            this.positions[this.PlateNum+(3*i+ 1)] 
                += (this.posTarget[this.PlateNum+(3*i+ 1)] 
                - this.positions[this.PlateNum+(3*i+ 1)]) *0.02;
            this.positions[this.PlateNum+(3*i+ 2)] 
                += (this.posTarget[this.PlateNum+(3*i+ 2)] 
                - this.positions[this.PlateNum+(3*i+ 2)]) *0.02;

            // this.meshList[i].position.x += (this.posTarget[3*i+ 0] - this.positions[3*i+ 0]) *0.02;
            // this.meshList[i].position.y += (this.posTarget[3*i+ 1] - this.positions[3*i+ 1]) *0.02;
            // this.meshList[i].position.z += (this.posTarget[3*i+ 2] - this.positions[3*i+ 2]) *0.02;

        }


        // //500msに１回ターゲットを再設定する
        // if(this.frame %500 == 0){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         let phai = Math.PI/180*Math.random()*180
        //         let theta =  Math.PI/180*Math.random()*360
        //         this.posTarget[3*i+ 0] = 150 *Math.sin(theta)*Math.cos(phai),
        //         this.posTarget[3*i+ 1] = 150 *Math.sin(theta)*Math.sin(phai),
        //         this.posTarget[3*i+ 2] = 150 *Math.cos(phai)
        //     }
        // }



        //ここからアニメーション

        if(this.frame == 200){

            this.createMesh(3);
            for (let i = 0; i < this.meshList.length; i++) {

                // 現在のpositions
                this.positions.push( 0,0,0 );

                // ターゲット位置のpositions
                this.posTarget.push(
                    this.posTarget[3*i+ 0] = i *15,
                    this.posTarget[3*i+ 1] = 0,
                    this.posTarget[3*i+ 2] = 0
                );
            }
        }

        if(this.frame == 400){
            this.createMesh(3);
            for (let i = 0; i < this.meshList.length; i++) {

                // 現在のpositions
                this.positions.push( i*15,0,0 );

                // ターゲット位置のpositions
                this.posTarget.push(
                    this.posTarget[3*i+ 0] = i*15,
                    this.posTarget[3*i+ 1] = 0,
                    this.posTarget[3*i+ 2] = i*15
                );
            }
        }


        // this.meshGroup.rotation.y += 0.01;
        // this.meshGroup.rotation.z += 0.01;

    }

    createMesh(MeshNum){

        for (let i = 0; i < MeshNum; i++) {

            this.floorsize = 12;
            this.geometry = new THREE.BoxBufferGeometry(this.floorsize, 1, this.floorsize);

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(0,0,0);
            this.meshGroup.add(this.mesh);

            this.meshList.push(this.mesh);

        }
        this.add(this.meshGroup);

        this.PlateNum += this.MeshNum;
    }

}