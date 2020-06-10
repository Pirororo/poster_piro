
import * as THREE from "three";
import ObjectSet from '../objects/objectSet_xr.js';
// import MoveRing from '../objects/moveRing_xr.js';
import LightBar from '../objects/lightBar_xr.js';

export class Scene2 extends THREE.Scene
{
    constructor()
    {
        super();

        //床とビルのオブジェクトセット呼び出し
        this.objectSet = new ObjectSet();
        this.add(this.objectSet);

        // //ムーブリングの呼び出し
        // this.moveRing = new MoveRing();
        // this.add(this.moveRing);

        //ライトバーの呼び出し
        this.lightBar = new LightBar();
        this.add(this.lightBar);

        //メソッド連結
        this.opening = this.opening.bind(this);
        this.backAnimation = this.backAnimation.bind(this);

        //信号
        this.openingFrame = 0;
        this.backAnimationframeStart = 990;
        this.backAnimationframe = this.backAnimationframeStart;
        this.waitingFrame = 0;
        this.openingUpdateBool = true;
        this.backAnimationUpdateBool = false;
        this.openingIsEnd = false;

        //イージング
        this.clock = new THREE.Clock();
        this.tSpeed = 20.0;
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
        //床とビルのオブジェクトのアップデート
        this.objectSet.update();

        // //ムーブリングのアップデート
        // this.moveRing.update();

        //ライトバーのアップデート
        this.lightBar.update();

        //プレートのイージング
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


        //オープニング
        if(this.openingUpdateBool == true){
            this.openingFrame += 1;
            this.opening();
        }

        //バックアニメーション
        if(this.backAnimationUpdateBool == true){

            // if(this.waitingFrame< 240){
            //     this.waitingFrame += 1;
            // }
            // if(this.waitingFrame >= 240){
            //     this.waitingFrame = 240+2;

                this.backAnimationframe += 1;
                this.backAnimation();
            // }
        }
    }


    opening()
    {
        if(this.openingFrame == 220){
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
            this.tSpeed =6.0;
        }

        if(this.openingFrame == 280){
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

        if(this.openingFrame == 430){
            if(this.openingIsEnd == false){
                this.openingIsEnd = true;
                this.openingUpdateBool = false;
                this.openingFrame = 0;
            }
        }
    }




    backAnimation()
    {
        // // console.log(this.backAnimationframe);
        // //ここからアニメーション
        // if(this.backAnimationframe == 50){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             this.posTarget[3*i+ 0] = 25*j,
        //             this.posTarget[3*i+ 1] = 0,
        //             this.posTarget[3*i+ 2] = 0
        //         }
        //         }
        //     }
        //     this.easeElapsedTime = 0;
        //     this.tSpeed = 3.0;
        // }

        // if(this.backAnimationframe == 110){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 this.posTarget[3*i+ 0] = 25*j,
        //                 this.posTarget[3*i+ 1] = 0,
        //                 this.posTarget[3*i+ 2] = 25*k
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        // }


        // if(this.backAnimationframe == 170){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 for (let l = 0; l < 20; l++) {
        //                 if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
        //                     this.posTarget[3*i+ 0] = 25*j,
        //                     this.posTarget[3*i+ 1] = 7*l,
        //                     this.posTarget[3*i+ 2] = 25*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed = 4.0;
        // }

        // if(this.backAnimationframe == 280){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 for (let l = 0; l < 10; l++) {
        //                 if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
        //                     this.posTarget[3*i+ 0] = 45*k,
        //                     this.posTarget[3*i+ 1] = 10*l,//120*Math.random(),
        //                     this.posTarget[3*i+ 2] = 45*j
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime = 0;
        //     this.tSpeed = 4.0;
        // }

        // if(this.backAnimationframe == 430){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 for (let l = 0; l < 10; l++) {
        //                 if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
        //                     this.posTarget[3*i+ 0] = 45*j,
        //                     this.posTarget[3*i+ 1] = 0,
        //                     this.posTarget[3*i+ 2] = 45*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed = 7.0;
        // }

        // if(this.backAnimationframe == 490){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 for (let l = 0; l < 10; l++) {
        //                 if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
        //                     this.posTarget[3*i+ 0] = 15*2*j,
        //                     this.posTarget[3*i+ 1] = 0,
        //                     this.posTarget[3*i+ 2] = 15*2*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed = 4.0;
        // }

        // if(this.backAnimationframe == 550){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 8; j++) {
        //         if(i >=40*j && i<40*(j+1)){
        //             for (let k = 0; k < 8; k++) {
        //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        //                 for (let l = 0; l < 5; l++) {
        //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        //                     this.posTarget[3*i+ 0] = 15*j,
        //                     this.posTarget[3*i+ 1] = 0,
        //                     this.posTarget[3*i+ 2] = 15*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed = 2.0;
        // }

        // // if(this.backAnimationframe == 550){
        // //     for (let i = 0; i < this.meshList.length; i++) {
        // //         for (let j = 0; j < 20; j++) {
        // //         if(i >=16*j && i<16*(j+1)){
        // //             for (let k = 0; k < 16; k++) {
        // //             if(i >=40*j+(1*k) && i<40*j+(1*(k+1))){
        // //                 for (let l = 0; l < 1; l++) {
        // //                 if(i >=40*j+(1*k)+(1*l) && i<40*j+(1*k)+(1*(l+1))){
        // //                     this.posTarget[3*i+ 0] = 15*j,
        // //                     this.posTarget[3*i+ 1] = 0,
        // //                     this.posTarget[3*i+ 2] = 15*k
        // //                 }
        // //                 }
        // //             }
        // //             }
        // //         }
        // //         }
        // //     }
        // //     this.easeElapsedTime =0;
        // //     this.tSpeed = 2.0;
        // // }


        // if(this.backAnimationframe == 600){
        //     for (let i = 0; i < this.meshList.length; i++) {
        // //     for (let i = 0; i < this.meshList.length; i++) {
        // //         for (let j = 0; j < 8; j++) {
        // //         if(i >=40*j && i<40*(j+1)){
        // //             for (let k = 0; k < 8; k++) {
        // //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        // //                 for (let l = 0; l < 5; l++) {
        // //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        //         for (let j = 0; j < 20; j++) {
        //         if(i >=16*j && i<16*(j+1)){
        //             for (let k = 0; k < 16; k++) {
        //             if(i >=16*j+(1*k) && i<16*j+(1*(k+1))){
        //                 for (let l = 0; l < 1; l++) {
        //                 if(i >=16*j+(1*k)+(1*l) && i<16*j+(1*k)+(1*(l+1))){
        //                     this.posTarget[3*i+ 0] = 20*j,
        //                     this.posTarget[3*i+ 1] =  (30*Math.sin((30*(j+k)+((this.backAnimationframe+60)*2))*Math.PI/180)),
        //                     this.posTarget[3*i+ 2] = 20*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        // }




        // if(this.backAnimationframe == 660){ this.eansingBool = false;}

        // if(this.backAnimationframe >= 660 && this.backAnimationframe < 980){

        //     for (let i = 0; i < this.meshList.length; i++) {
        //         this.meshList[i].position.x = this.positions[3*i+ 0];
        //         this.meshList[i].position.y = this.positions[3*i+ 1];
        //         this.meshList[i].position.z = this.positions[3*i+ 2];
        //     }

        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 20; j++) {
        //         if(i >=16*j && i<16*(j+1)){
        //             for (let k = 0; k < 16; k++) {
        //             if(i >=16*j+(1*k) && i<16*j+(1*(k+1))){
        //                 for (let l = 0; l < 1; l++) {
        //                 if(i >=16*j+(1*k)+(1*l) && i<16*j+(1*k)+(1*(l+1))){
        //         // for (let j = 0; j < 8; j++) {
        //         // if(i >=40*j && i<40*(j+1)){
        //         //     for (let k = 0; k < 8; k++) {
        //         //     if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        //         //         for (let l = 0; l < 5; l++) {
        //         //         if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        //                     this.positions[3*i+ 0] = 20*j,
        //                     this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.backAnimationframe*2))*Math.PI/180)),
        //                     this.positions[3*i+ 2] = 20*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }


        // }


        // if(this.backAnimationframe == 980){ this.eansingBool = true;}

        // // if(this.backAnimationframe == 780){
        // //     for (let i = 0; i < this.meshList.length; i++) {
        // //         for (let j = 0; j < 8; j++) {
        // //         if(i >=40*j && i<40*(j+1)){
        // //             for (let k = 0; k < 8; k++) {
        // //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        // //                 for (let l = 0; l < 5; l++) {
        // //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        // //                     this.posTarget[3*i+ 0] = 80*Math.sin((i*2*Math.PI/180))+50,
        // //                     this.posTarget[3*i+ 1] = 0+25,
        // //                     this.posTarget[3*i+ 2] = 80*Math.cos((i*2*Math.PI/180))+50
        // //                 }
        // //                 }
        // //             }
        // //             }
        // //         }
        // //         }
        // //     }
        // //     this.easeElapsedTime =0;
        // //     this.tSpeed =30;
        // // }

        // // if(this.backAnimationframe == 900){
        // //     for (let i = 0; i < this.meshList.length; i++) {
        // //         for (let j = 0; j < 4; j++) {
        // //         if(i >=80*j && i<80*(j+1)){
        // //             for (let k = 0; k < 4; k++) {
        // //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        // //                 for (let l = 0; l < 10; l++) {
        // //                 if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
        // //                     this.posTarget[3*i+ 0] = 4*k+50,
        // //                     this.posTarget[3*i+ 1] = 1.5*l+25,
        // //                     this.posTarget[3*i+ 2] = 4*j+50
        // //                 }
        // //                 }
        // //             }
        // //             }
        // //         }
        // //         }
        // //     }
        // //     this.easeElapsedTime =0;
        // //     this.tSpeed =8.0;
        // // }



        if(this.backAnimationframe == 1000){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 150*Math.sin((4*i*Math.PI/180))+160,
                            this.posTarget[3*i+ 1] = 100*Math.cos((2*20*(j+k+l)*Math.PI/180))+100,
                            this.posTarget[3*i+ 2] = -150*Math.sin((8*i*Math.PI/180))+160
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =15.0;
        }

        if(this.backAnimationframe == 1150){
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

        if(this.backAnimationframe == 1150){
            if(this.openingIsEnd == false){
                this.openingIsEnd = true;
                this.openingUpdateBool = false;
                this.openingFrame = 0;
            }
        }

        // if(this.backAnimationframe == 1150){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 20; j++) {
        //             if(i >=16*j && i<16*(j+1)){
        //                 for (let k = 0; k < 16; k++) {
        //                 if(i >=16*j+(1*k) && i<16*j+(1*(k+1))){
        //                     for (let l = 0; l < 1; l++) {
        //                     if(i >=16*j+(1*k)+(1*l) && i<16*j+(1*k)+(1*(l+1))){
        //         // for (let j = 0; j < 4; j++) {
        //         // if(i >=80*j && i<80*(j+1)){
        //         //     for (let k = 0; k < 4; k++) {
        //         //     if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //         //         for (let l = 0; l < 10; l++) {
        //         //         if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
        //                     this.posTarget[3*i+ 0] = 10*j,
        //                     this.posTarget[3*i+ 1] = 0,
        //                     this.posTarget[3*i+ 2] = 10*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed =4.0;
        // }
    }
}