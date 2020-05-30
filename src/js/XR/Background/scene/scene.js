// import * as THREE from '../../libs/three.module.js';
// import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';

import * as THREE from "three";
import {Camera} from '../camera/camera.js';
import {TweenMax, TimelineMax, Cubic, Back} from "gsap";
import Line from '../objects/line.js';

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
        this.add(spotLight);

        //シェーダーのエフェクトをマスクするためシーン２種類にわけた
        this.scene1 = new Scene1();
        // this.scene1.add(ambientLight);
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


        //ライン
        this._line = new Line();
        this._line.position.set(150,70,150);
        this.add(this._line);

        //ライン2
        this._line2 = new Line();
        this._line.position.set(150,70,150);
        // this._line2.rotation.x = 180 * Math.PI/180;
        // this._line2.rotation.z = 90 * Math.PI/180;
        this.add(this._line2);

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
        //     new THREE.BoxGeometry(10, 10, 10),
        //     // new THREE.MeshLambertMaterial({
        //     new THREE.MeshBasicMaterial({
        //     color: 0xff0000,
        //     depthTest: false
        // })
        // );
        // this.body.position.set(0,0,0);
        // this.add(this.body);


    }
    
    update(){

        this._line.update();
        this._line2.update();
        // this._line3.update();
        // this._line4.update();

        // let tl = new TimelineMax();
        // tl.to(this.body.position, 2.0, {
        //     ease: Back.easeOut,
        //     x: -50,
        //     repeatDelay: 0,
        //     yoyo:true
        // });

        // tl.to(this.body.scale, 2.0, {
        //     ease: Cubic.easeOut,
        //     x: 3,
        //     y: 3,
        //     z: 3,
        //     // repeat: -1,//無限回リピート。これついてると終わらないからonCompleteが呼ばれない
        //     onComplete: function(){
        //         // console.log('アニメーション終わり！');
        //     }
        // });

    }

}

export class Scene2 extends THREE.Scene {

    constructor(){

        super();

        this.frame = 0;

        //プレート
        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        // const material = new THREE.MeshLambertMaterial({ 
        //     color: 0xffffff, 
        //     opacity: 0.2,
        //     transparent: true,
        //     // depthTest: false,
        //     // side: THREE.DoubleSide,
        //     // blending: THREE.AdditiveBlending//なくてもaddっぽくなる
        // });

        const material = new THREE.MeshBasicMaterial( { 
        // const material = new THREE.MeshNormalMaterial( { //ライト当たらなくなる
            color: 0xffffff, 
            wireframe: true,
            // wireframeLinewidth:3.5,//いみなかった
            opacity: 0.9,
            transparent: true,
        //    depthTest: true,
            // blending: THREE.AdditiveBlending//なくてもaddっぽくなる
        } );

        this.PlateNum = 320;

        this.positions = [];
        this.posTarget = [];


        for (let i = 0; i < this.PlateNum; i++) {

            this.floorsize = 27;//12;
            // this.geometry = new THREE.BoxBufferGeometry(this.floorsize, 0.2, this.floorsize);
            this.geometry = new THREE.PlaneBufferGeometry(this.floorsize, this.floorsize);

            //もとのやつ
            // let floorPos = this.floorsize +20;
            this.mesh = new THREE.Mesh(this.geometry, material);
            this.mesh.position.set(0,0,0);
            this.mesh.rotation.x = 90 * Math.PI/180;//planeのときだけ、boxでは消す
            this.meshGroup.add(this.mesh);

            // 配列に保存
            this.meshList.push(this.mesh);

            // 現在のpositions
            this.positions.push( this.mesh.position.x, this.mesh.position.y, this.mesh.position.z );

            // ターゲット位置のpositions
            this.posTarget.push(0,0,0);
        }
        this.add(this.meshGroup);

        this.animeScene=0;

        this.platAnime = [0,1,2,3,4,5,6,7,8,9];

        this.clock = new THREE.Clock();

        this.tSpeed  =2;
        this.easeElapsedTime =0;

        this.eansingBool = true;

        this.tl = [];


    }


    update2(){

        this.frame += 1;

        

            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){

                            // if(this.frame < 100){
                                // this.tl[i] = new TimelineMax();
                                // this.tl[i].to(this.meshList[i].position, 4.0, {

                                let tl = new TimelineMax();
                                tl.to(this.meshList[i].position, 4.0, {
                                    ease: Cubic.easeOut,
                                    x:25*j,
                                    y:0,
                                    z:0,
                                    // onComplete: function(){
                                    //     if(i == 319){
                                    //     console.log('アニメーション終わり！');
                                    //     }
                                    // }
                                });
                                
                            // }
                        }
                        }
                    }
                    }
                }
                }
            }

        // // if(this.frame < 100){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 for (let l = 0; l < 10; l++) {
        //                 if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){

        //                     let tl = new TimelineMax();

        //                     if(this.frame < 100){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*j,
        //                             y:0,
        //                             z:25*0
        //                         });

        //                     }

        //                     if(this.frame > 100 && this.frame <= 180){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*j,
        //                             y:0,
        //                             z:25*k
        //                         });
        //                     }

        //                     if(this.frame > 180 && this.frame <= 260){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*j,
        //                             y:20*l,
        //                             z:25*k
        //                         });
        //                     }

        //                     if(this.frame > 260 && this.frame <= 340){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*j,
        //                             y:200*Math.random(),
        //                             z:25*k
        //                         });
        //                     }

        //                     if(this.frame > 340 && this.frame <= 420){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*j,
        //                             y:0,
        //                             z:25*k
        //                         });
        //                     }

        //                     if(this.frame > 420 && this.frame <= 500){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*2*j,
        //                             y:0,
        //                             z:25*2*k
        //                         });
        //                     }

        //                     if(this.frame >500 && this.frame <= 580){
        //                         tl.to(this.meshList[i].position, 4.0, {
        //                             ease: Cubic.easeOut,
        //                             x:25*j,
        //                             y:200*Math.random(),
        //                             z:25*k
        //                         });
        //                     }
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        // // }

    }







    update(){

        this.frame += 1;

        // if(this.clock.elapsedTime >= 5){
            // console.log(this.clock.getElapsedTime());
        // }



        if (this.eansingBool == true){

            this.easeElapsedTime += this.clock.getDelta();
            this.t = this.easeElapsedTime / this.tSpeed;
            if ( this.t > 1.0){this.t = 1.0;}    // クランプ
            this.rate = this.t * this.t * ( 3.0 - 2.0 * this.t );
            

            for (let i = 0; i < this.meshList.length; i++) {
                // this.meshList[i].scale = 10;//きかない
                // // console.log(this.meshList[i].geometry.width);
                // this.meshList[i].geometry.needUpdate = true;//きかない

                this.meshList[i].position.x = this.positions[3*i+ 0];
                this.meshList[i].position.y = this.positions[3*i+ 1];
                this.meshList[i].position.z = this.positions[3*i+ 2];

                for(let j=0; j<3; j++){
                    let A = this.positions[3*i+ j];
                    let B = this.posTarget[3*i+ j];
                    this.positions[3*i+ j] = A * ( 1.0 - this.rate ) + B * this.rate;
                    // this.positions[3*i+ j] += (B- A) * 0.03;
                    // if (i==319 && Math.abs(A - B)<0.01 ){this.frame = 1;}
                }
            }
        }


        //ここからアニメーション
        // if(this.clock.elapsedTime == 1){
        if(this.frame == 50){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    this.posTarget[3*i+ 0] = 25*j,
                    this.posTarget[3*i+ 1] = 0,
                    this.posTarget[3*i+ 2] = 0
                }
                }
            }
            this.easeElapsedTime = 0;
            this.tSpeed = 3.0;
        }

        // if(this.clock.elapsedTime == 2){
        if(this.frame == 110){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        this.posTarget[3*i+ 0] = 25*j,
                        this.posTarget[3*i+ 1] = 0,
                        this.posTarget[3*i+ 2] = 25*k
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
        }

        // if(this.clock.elapsedTime == 3){
        if(this.frame == 170){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 25*j,
                            this.posTarget[3*i+ 1] = 7*l,
                            this.posTarget[3*i+ 2] = 25*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 4.0;
        }

        // if(this.clock.elapsedTime == 4.5){
        if(this.frame == 280){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 45*k,
                            this.posTarget[3*i+ 1] = 10*l,//120*Math.random(),
                            this.posTarget[3*i+ 2] = 45*j
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime = 0;
            this.tSpeed = 4.0;
        }

        // if(this.clock.elapsedTime == 5.7){
        if(this.frame == 430){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 45*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 45*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 7.0;
        }

        // if(this.clock.elapsedTime == 6.0){
        if(this.frame == 490){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 15*2*j,
                            this.posTarget[3*i+ 1] = 0
                            this.posTarget[3*i+ 2] = 15*2*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 4.0;
        }


        // if(this.clock.elapsedTime == 6.3){
        if(this.frame == 550){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 15*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 15*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 4.0;
        }

        // if(this.clock.elapsedTime == 7.3){
        if(this.frame == 600){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] =  (30*Math.sin((30*(j+k)+((this.frame+60)*2))*Math.PI/180)),
                            this.posTarget[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
        }



        if(this.frame == 660){ this.eansingBool = false;}

        if(this.frame >= 660 && this.frame < 780){

            for (let i = 0; i < this.meshList.length; i++) {
                this.meshList[i].position.x = this.positions[3*i+ 0];
                this.meshList[i].position.y = this.positions[3*i+ 1];
                this.meshList[i].position.z = this.positions[3*i+ 2];
            }

            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.positions[3*i+ 0] = 20*j,
                            this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.frame*2))*Math.PI/180)),
                            this.positions[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }

           
        }


        if(this.frame == 780){ this.eansingBool = true;}

        if(this.frame == 780){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 80*Math.sin((i*2*Math.PI/180))+50,
                            this.posTarget[3*i+ 1] = 0+25,
                            this.posTarget[3*i+ 2] = 80*Math.cos((i*2*Math.PI/180))+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =30;
        }

        if(this.frame == 900){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 4*k+50,
                            this.posTarget[3*i+ 1] = 1.5*l+25,
                            this.posTarget[3*i+ 2] = 4*j+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =8.0;
        }

        

        if(this.frame == 1000){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 70*Math.sin((4*i*Math.PI/180))+50,
                            this.posTarget[3*i+ 1] = 70*Math.cos((2*20*(j+k+l)*Math.PI/180))+25,
                            this.posTarget[3*i+ 2] = -70*Math.sin((8*i*Math.PI/180))+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =12.0;
        }

        if(this.frame == 1150){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 25*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 25*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =4.0;
        }

        if(this.frame == 1270){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] = 5*l,
                            this.posTarget[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =4.0;
        }

        if(this.frame == 1470){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                                this.posTarget[3*i+ 0] = 25*(j+l),
                                this.posTarget[3*i+ 1] = 15*l,
                                this.posTarget[3*i+ 2] = 25*(k+l)
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =10.0;
        }



        // this.geometry.width += 0.1;
        // this.meshGroup.rotation.y += 0.01;
        // this.meshGroup.rotation.z += 0.01;
    }

}