import * as THREE from "three";
// import {Camera} from '../camera/camera_xr.js';
// import {TweenMax, TimelineMax, Cubic, Back} from "gsap";
import Line from '../objects/line.js';


export class Scene extends THREE.Scene
{
    constructor()
    {
        super();
    }
    setup()
    {

        this.frame = 0;

        this.scene0 = new Scene0();
        this.add(this.scene0);

        // this.scene0.position.set(100, 100, 120);
        this.scene0.position.set(0, 0, 0);

        // this.camPos = new THREE.Vector3(100, 100, 120);
        // this.camTarget = new THREE.Vector3(-70, 50,120);

        // this.camTarget = {Tgt0: [-70, 100, 120],//0
        //                   Tgt1: [420, 80,-100],//350
        //                   Tgt2: [0,0,0],//700
        //                   Tgt3: [-70,80,300],//1100
        //                   Tgt4: [-170,30,600],//1420
        // };


    }
    update()
    {

        this.frame += 1;

        // this.camPos.x += (this.camTarget.x - this.camPos.x) *0.01;
        // this.camPos.y += (this.camTarget.y - this.camPos.y) *0.01;
        // this.camPos.z += (this.camTarget.z - this.camPos.z) *0.01;
        // this.scene0.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

        // if(this.frame == 350){this.camTarget = new THREE.Vector3(420, 80,-100);}
        // if(this.frame == 700){this.camTarget = new THREE.Vector3(0,0,0);}
        // if(this.frame == 1100){this.camTarget = new THREE.Vector3(-70,80,300);}
        // if(this.frame == 1420){this.camTarget = new THREE.Vector3(-170,30,600);}

        this.scene0.update();

    }
}

export class Scene0 extends THREE.Scene
{
    constructor()
    {
        super();
    // }
    // setup()    //なぜかsetupではエラー。Cannot read property 'update' of undefined
    // {
        // this.camera = new Camera();

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        // var spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.position.set(80, 60, 50);
        // spotLight.intensity = 1;

        this.scene1 = new Scene1();
        this.add(this.scene1);

        this.scene2 = new Scene2();
        // this.scene2.add(ambientLight);
        // this.scene2.add(spotLight);
        this.add(this.scene2);
    }
    update()
    {
        // this.camera.update();
        this.scene1.update();
        this.scene2.update();
    }
}

export class Scene1 extends THREE.Scene
{
    constructor()
    {
        super();

        this._line = new Line();
        this._line.position.set(150,70,150);
        this.add(this._line);

        this._line2 = new Line();
        this._line.position.set(150,70,150);
        this.add(this._line2);
    }
    update(){
        this._line.update();
        this._line2.update();
    }

}

export class Scene2 extends THREE.Scene
{
    constructor()
    {
        super();

        this.frame = 0;
        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        const material = new THREE.MeshBasicMaterial( {
            color: 0xF549C1,//0xffffff,
            wireframe: true,
            opacity: 0.6,//0.9
            transparent: true,
            blending: THREE.AdditiveBlending
            // blending: THREE.MultiplyBlending//背景との差分
            // blending: THREE.SubtractiveBlending//背景との差分
        } );

        this.PlateNum = 320;
        this.positions = [];
        this.posTarget = [];

        for (let i = 0; i < this.PlateNum; i++) {

            this.floorsize = 27;//12;
            this.geometry = new THREE.PlaneBufferGeometry(this.floorsize, this.floorsize);
            this.mesh = new THREE.Mesh(this.geometry, material);
            this.mesh.position.set(0,0,0);
            // this.mesh.position.set(100,100,70);//ここVR
            this.mesh.rotation.x = 90 * Math.PI/180;//planeのときだけ、boxでは消す
            this.meshGroup.add(this.mesh);
            this.meshList.push(this.mesh);
            this.positions.push( this.mesh.position.x, this.mesh.position.y, this.mesh.position.z );
            this.posTarget.push(0,0,0);
        }


        // this.platAnime = [0,1,2,3,4,5,6,7,8,9];
        this.clock = new THREE.Clock();
        this.tSpeed  =2;
        this.easeElapsedTime =0;
        this.eansingBool = true;


        this.camTarget = {Tgt0: [-70, 0, 120],//0
                          Tgt1: [220, 0,-70],//350
                          Tgt2: [100,0,40],//700
                          Tgt3: [-70,0,200],//1100
                          Tgt4: [-70,0,300],//1420
        };


        this.add(this.meshGroup);
    }

    update()
    {
        this.frame += 1;

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
        if(this.frame == 50){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    this.posTarget[3*i+ 0] = 25*j +this.camTarget.Tgt0[0],
                    this.posTarget[3*i+ 1] = 0    +this.camTarget.Tgt0[1],
                    this.posTarget[3*i+ 2] = 0    +this.camTarget.Tgt0[2]
                }
                }
            }
            this.easeElapsedTime = 0;
            this.tSpeed = 3.0;
        }


        if(this.frame == 110){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        this.posTarget[3*i+ 0] = 25*j +this.camTarget.Tgt0[0],
                        this.posTarget[3*i+ 1] = 0    +this.camTarget.Tgt0[1],
                        this.posTarget[3*i+ 2] = 25*k +this.camTarget.Tgt0[2]
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
        }


        if(this.frame == 170){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 25*j +this.camTarget.Tgt0[0],
                            this.posTarget[3*i+ 1] = 7*l  +this.camTarget.Tgt0[1],
                            this.posTarget[3*i+ 2] = 25*k +this.camTarget.Tgt0[2]
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


        if(this.frame == 280){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 45*k +this.camTarget.Tgt0[0],
                            this.posTarget[3*i+ 1] = 10*l +this.camTarget.Tgt0[1],//120*Math.random(),
                            this.posTarget[3*i+ 2] = 45*j +this.camTarget.Tgt0[2]
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


        if(this.frame == 430){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 45*j +this.camTarget.Tgt1[0],
                            this.posTarget[3*i+ 1] = 0    +this.camTarget.Tgt1[1],
                            this.posTarget[3*i+ 2] = 45*k +this.camTarget.Tgt1[2]
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
                            this.posTarget[3*i+ 0] = 15*2*j +this.camTarget.Tgt1[0],
                            this.posTarget[3*i+ 1] = 0      +this.camTarget.Tgt1[1],
                            this.posTarget[3*i+ 2] = 15*2*k +this.camTarget.Tgt1[2]
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
                            this.posTarget[3*i+ 0] = 15*j +this.camTarget.Tgt1[0],
                            this.posTarget[3*i+ 1] = 0    +this.camTarget.Tgt1[1],
                            this.posTarget[3*i+ 2] = 15*k +this.camTarget.Tgt1[2]
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
                            this.posTarget[3*i+ 0] = 20*j +this.camTarget.Tgt2[0],
                            this.posTarget[3*i+ 1] =  (30*Math.sin((30*(j+k)+((this.frame+60)*2))*Math.PI/180)) +this.camTarget.Tgt2[1],
                            this.posTarget[3*i+ 2] = 20*k +this.camTarget.Tgt2[2]
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
                            this.positions[3*i+ 0] = 20*j +this.camTarget.Tgt2[0],
                            this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.frame*2))*Math.PI/180)) +this.camTarget.Tgt2[1],
                            this.positions[3*i+ 2] = 20*k +this.camTarget.Tgt2[2]
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
                            this.posTarget[3*i+ 0] = 25*j +this.camTarget.Tgt3[0],
                            this.posTarget[3*i+ 1] = 0    +this.camTarget.Tgt3[1],
                            this.posTarget[3*i+ 2] = 25*k +this.camTarget.Tgt3[2]
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
                            this.posTarget[3*i+ 0] = 20*j +this.camTarget.Tgt3[0],
                            this.posTarget[3*i+ 1] = 5*l  +this.camTarget.Tgt3[1],
                            this.posTarget[3*i+ 2] = 20*k +this.camTarget.Tgt3[2]
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
                                this.posTarget[3*i+ 0] = 25*(j+l) +this.camTarget.Tgt4[0],
                                this.posTarget[3*i+ 1] = 15*l     +this.camTarget.Tgt4[1],
                                this.posTarget[3*i+ 2] = 25*(k+l) +this.camTarget.Tgt4[2]
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
    }
}