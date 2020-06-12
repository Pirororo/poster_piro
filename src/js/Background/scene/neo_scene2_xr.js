
import * as THREE from "three";

export class Scene2 extends THREE.Scene
{
    constructor()
    {
        super();

        //メソッド連結
        this.opening = this.opening.bind(this);
        this.backAnimation = this.backAnimation.bind(this);

        //信号
        this.openingFrame = 0;
        this.backAnimationframeStart = 990;
        this.backAnimationframe = this.backAnimationframeStart;
        this.waitingFrame = 0;
        this.openingUpdateBool = true;
        this.openingIsEnd = false;
        this.backAnimationUpdateBool = false;
        this.backAnimationBeforeEndBool = false;
        this.backAnimationIsEnd = false;
        this.randomAnimeBool = false;
        this.randomAnime = 0;

        //イージング
        this.clock = new THREE.Clock();
        this.tSpeed = 25.0;
        this.easeElapsedTime =0;
        this.eansingBool = true;

        //プレート
        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        const material = new THREE.MeshBasicMaterial( {
            // color: 0xC7C7C7,
            wireframe: true,
            color: 0x4ea78e,
            opacity: 0.5,
            transparent: true,
            blending: THREE.AdditiveBlending,
        } );

        this.PlateNum = 320;
        this.positions = [];
        this.posTarget = [];

        for (let i = 0; i < this.PlateNum; i++) {

            this.floorsize = 22;//12;
            this.geometry = new THREE.PlaneBufferGeometry(this.floorsize, this.floorsize);
            this.mesh = new THREE.Mesh(this.geometry, material);
            this.mesh.position.set(0,0,0);
            // this.mesh.position.set(100,100,70);//ここVR
            this.mesh.rotation.x = 90 * Math.PI/180;//planeのときだけ、boxでは消す
            this.meshGroup.add(this.mesh);
            this.meshList.push(this.mesh);
            // this.positions.push( this.mesh.position.x, this.mesh.position.y, this.mesh.position.z );
            this.positions.push(400*(2*Math.random()-1), 
                                400*(2*Math.random()-1),
                                400*(2*Math.random()-1));
            this.posTarget.push(0,0,0);
        }

        this.add(this.meshGroup);
    }



    update()
    {

        //プレートのイージング
        if (this.eansingBool == true){
            this.easeElapsedTime += this.clock.getDelta();
            this.t = this.easeElapsedTime / this.tSpeed*1.5;
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


        //オープニング
        if(this.openingUpdateBool == true){
            this.openingFrame += 2;
            this.opening();
        }

        //バックアニメーション
        if(this.backAnimationUpdateBool == true){

            // if(this.waitingFrame< 240){
            //     this.waitingFrame += 2;
            // }
            // if(this.waitingFrame >= 240){
            //     this.waitingFrame = 240+2;

                this.backAnimationframe += 2;
                this.backAnimation();
            // }
        }
    }


    opening()
    {
        if(this.openingFrame == 230){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] = 10*l,
                            this.posTarget[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =7.0;
        }

        if(this.openingFrame == 300){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                                this.posTarget[3*i+ 0] = 20*(j+l+2),
                                this.posTarget[3*i+ 1] = 20*l,
                                this.posTarget[3*i+ 2] = 20*(k+l+2)
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =7.0;
        }

        if(this.openingFrame == 550){
            if(this.openingIsEnd == false){
                this.openingIsEnd = true;
                this.openingUpdateBool = false;
                this.openingFrame = 0;
            }
        }
    }




    backAnimation()
    {
        if(this.randomAnimeBool == true){
            this.randomAnime = Math.random();
            this.randomAnimeBool = false;
        }
         
        if(this.randomAnime >= 0.66){
            if(this.backAnimationframe == 1002){ this.eansingBool = false;}
            if(this.backAnimationframe > 1002 && this.backAnimationframe < 1150){//1120でShowCategoryは送られるけど、backAnimationframeとbackAnimationBoolは次のカテゴリ選択するまで生きてる

                for (let i = 0; i < this.meshList.length; i++) {
                    this.meshList[i].position.x = this.positions[3*i+ 0];
                    this.meshList[i].position.y = this.positions[3*i+ 1];
                    this.meshList[i].position.z = this.positions[3*i+ 2];
                }

                for (let i = 0; i < this.meshList.length; i++) {
                    for (let j = 0; j < 20; j++) {
                    if(i >=16*j && i<16*(j+1)){
                        for (let k = 0; k < 16; k++) {
                        if(i >=16*j+(1*k) && i<16*j+(1*(k+1))){
                            for (let l = 0; l < 1; l++) {
                            if(i >=16*j+(1*k)+(1*l) && i<16*j+(1*k)+(1*(l+1))){
                                this.positions[3*i+ 0] = 15*j,
                                this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.backAnimationframe*2))*Math.PI/180))+70,
                                this.positions[3*i+ 2] = 15*k
                            }
                            }
                        }
                        }
                    }
                    }
                }
                this.easeElapsedTime =0;//これかかないとイージング
            }

        }

        else if(this.randomAnime < 0.66 && this.randomAnime >= 0 ){
            if(this.randomAnime < 0.66 && this.randomAnime >= 0.33 ){
                if(this.backAnimationframe == 1000){ this.eansingBool = true;}
                if(this.backAnimationframe == 1000){
                    for (let i = 0; i < this.meshList.length; i++) {
                        for (let j = 0; j < 8; j++) {
                        if(i >=40*j && i<40*(j+1)){
                            for (let k = 0; k < 8; k++) {
                            if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                                for (let l = 0; l < 5; l++) {
                                if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                                    this.posTarget[3*i+ 0] = 120*Math.sin((i*2*Math.PI/180))+160,
                                    this.posTarget[3*i+ 1] = 0+125,
                                    this.posTarget[3*i+ 2] = 120*Math.cos((i*2*Math.PI/180))+160
                                }
                                }
                            }
                            }
                        }
                        }
                    }
                    this.easeElapsedTime =0;
                    this.tSpeed =8;
                }
            }else{
                if(this.backAnimationframe == 1000){ this.eansingBool = true;}
                if(this.backAnimationframe == 1000){
                    for (let i = 0; i < this.meshList.length; i++) {
                        for (let j = 0; j < 4; j++) {
                        if(i >=80*j && i<80*(j+1)){
                            for (let k = 0; k < 4; k++) {
                            if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                                for (let l = 0; l < 10; l++) {
                                if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                                    this.posTarget[3*i+ 0] = 100*Math.sin((4*i*Math.PI/180))+100,
                                    this.posTarget[3*i+ 1] = 80*Math.cos((2*20*(j+k+l)*Math.PI/180))+50,
                                    this.posTarget[3*i+ 2] = -100*Math.sin((8*i*Math.PI/180))+100
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

        if(this.backAnimationframe == 1120){ this.eansingBool = true;}
        if(this.backAnimationframe == 1120){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                                this.posTarget[3*i+ 0] = 20*(j+l+2),
                                this.posTarget[3*i+ 1] = 20*l,
                                this.posTarget[3*i+ 2] = 20*(k+l+2)
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =7.0;
        }



        if(this.backAnimationframe == 1120){
            this.backAnimationBeforeEndBool = true;
        }

        if(this.backAnimationframe == 1850){
            if(this.backAnimationIsEnd == false){
                this.backAnimationIsEnd = true;
                this.backAnimationUpdateBool = false;
                this.backAnimationframe = this.backAnimationframeStart;
                this.openingFrame = 0;
            }
            
        }

    }
}