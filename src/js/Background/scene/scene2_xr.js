
import * as THREE from "three";

export class Scene2 extends THREE.Scene
{
    constructor()
    {
        super();

        this.BillandCircle = this.BillandCircle.bind(this);
        this.opening = this.opening.bind(this);
        this.backAnimation = this.backAnimation.bind(this);


        this.BillandCircle();


        this.openingFrame = 0;
        this.backAnimationframeStart = 550;
        this.backAnimationframe = this.backAnimationframeStart;
        this.waitingFrame = 0;
        this.openingUpdateBool = true;
        this.backAnimationUpdateBool = false;


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

            this.floorsize = 27;//12;
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

        this.clock = new THREE.Clock();
        this.tSpeed  =10;
        this.easeElapsedTime =0;
        this.eansingBool = true;

        this.add(this.meshGroup);

        this.openingIsEnd = false;


    }

    BillandCircle(){
        // 空のジオメトリを作成
        const Circle_NUM = 30;
        const Circlegeometry = new THREE.Geometry()
        // Circle
        for (let i = 0; i < Circle_NUM; i++) {
            // 立方体個別の要素を作成
            const CirclesampleGeometry = new THREE.CircleGeometry(
                400*(Math.random()+0.5),
                7
            );
            // 座標調整の行列を作成
            const Circlematrix = new THREE.Matrix4();
            Circlematrix.makeTranslation(
                0+125,0+125,0
            );
            // if(i%70 == 0){angleTerm += 1;}
            // matrix.makeTranslation(
            //     140*(2*Math.random()-1)+ 400*Math.sin(angleTerm*50*Math.PI/180),
            //     0,
            //     140*(2*Math.random()-1)+ 400*Math.cos(angleTerm*50*Math.PI/180)
            // );

            // ジオメトリをマージ（結合）
            Circlegeometry.merge(CirclesampleGeometry, Circlematrix);
        }

        // マテリアルを作成
        const Circlematerial = new THREE.MeshBasicMaterial( {
            // color: 0xC7C7C7,
            wireframe: true,
            color: 0x4ea78e,
            // color: 0x0000ff,
            opacity: 0.9,
            transparent: true,
            // blending: THREE.AdditiveBlending
        } );

        this.circle = new THREE.Mesh( Circlegeometry, Circlematerial );
        this.circle.rotation.x = 90*Math.PI/180;
        this.add( this.circle );



        // 空のジオメトリを作成
        const CELL_NUM = 420;
        const Billgeometry = new THREE.Geometry();
        // Box
        let angleTerm = 0;
        for (let i = 0; i < CELL_NUM; i++) {
            // 立方体個別の要素を作成
            let y = 50*(Math.random()+0.5);
            const BillsampleGeometry = new THREE.BoxGeometry(
                10*(Math.random()+0.5),
                y,
                10*(Math.random()+0.5)
            );
            // 座標調整の行列を作成
            const Billmatrix = new THREE.Matrix4();
            // matrix.makeTranslation(
            //     // 20 * (i - CELL_NUM / 2),
            //     // 0,
            //     // 20 * (j - CELL_NUM / 2)
            if(i%60 == 0){angleTerm += 1;}
            Billmatrix.makeTranslation(
                140*(2*Math.random()-1)+ 400*Math.sin(angleTerm*50*Math.PI/180)+125,
                y/2,
                140*(2*Math.random()-1)+ 400*Math.cos(angleTerm*50*Math.PI/180)+125
            );


            // ジオメトリをマージ（結合）
            Billgeometry.merge(BillsampleGeometry, Billmatrix);
        }
        // マテリアルを作成
        const Billmaterial = new THREE.MeshBasicMaterial( {
            // color: 0xC7C7C7,
            wireframe: true,
            color: 0x4ea78e,
            opacity: 0.4,
            transparent: true,
            blending: THREE.AdditiveBlending,
        } );

        // メッシュを作成
        const Billmesh = new THREE.Mesh(Billgeometry, Billmaterial);
        this.add(Billmesh);



    }


    update()
    {
        this.circle.rotation.x = 90*Math.PI/180;
        
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


        if(this.openingUpdateBool == true){
            this.openingFrame += 1;
            this.opening();
        }

        if(this.backAnimationUpdateBool == true){

            if(this.waitingFrame< 240){
                this.waitingFrame += 1;
            }
            if(this.waitingFrame >= 240){
                this.waitingFrame = 240+2;

                this.backAnimationframe += 1;
                this.backAnimation();
                // console.log(this.backAnimationframe);//問題ない
            }
            // console.log(this.waitingFrame);//ok
            // console.log(this.backAnimationframe);//ok
        }
    }

    opening()
    {
        if(this.openingFrame == 170){
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

        if(this.openingFrame == 230){
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
            this.tSpeed =7.0;
        }


        if(this.openingFrame == 370){
            if(this.openingIsEnd == false){
                this.openingIsEnd = true;
                this.openingUpdateBool = false;
                this.openingFrame = 0;
            }
        }
    }




    backAnimation()
    {
        // console.log(this.backAnimationframe);
        //ここからアニメーション
        if(this.backAnimationframe == 50){
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

        if(this.backAnimationframe == 110){
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


        if(this.backAnimationframe == 170){
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

        if(this.backAnimationframe == 280){
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

        if(this.backAnimationframe == 430){
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

        if(this.backAnimationframe == 490){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 15*2*j,
                            this.posTarget[3*i+ 1] = 0,
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

        if(this.backAnimationframe == 550){
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
            this.tSpeed = 2.0;
        }

        // if(this.backAnimationframe == 550){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 20; j++) {
        //         if(i >=16*j && i<16*(j+1)){
        //             for (let k = 0; k < 16; k++) {
        //             if(i >=40*j+(1*k) && i<40*j+(1*(k+1))){
        //                 for (let l = 0; l < 1; l++) {
        //                 if(i >=40*j+(1*k)+(1*l) && i<40*j+(1*k)+(1*(l+1))){
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


        if(this.backAnimationframe == 600){
            for (let i = 0; i < this.meshList.length; i++) {
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 8; j++) {
        //         if(i >=40*j && i<40*(j+1)){
        //             for (let k = 0; k < 8; k++) {
        //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        //                 for (let l = 0; l < 5; l++) {
        //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                for (let j = 0; j < 20; j++) {
                if(i >=16*j && i<16*(j+1)){
                    for (let k = 0; k < 16; k++) {
                    if(i >=16*j+(1*k) && i<16*j+(1*(k+1))){
                        for (let l = 0; l < 1; l++) {
                        if(i >=16*j+(1*k)+(1*l) && i<16*j+(1*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] =  (30*Math.sin((30*(j+k)+((this.backAnimationframe+60)*2))*Math.PI/180)),
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




        if(this.backAnimationframe == 660){ this.eansingBool = false;}

        if(this.backAnimationframe >= 660 && this.backAnimationframe < 980){

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
                // for (let j = 0; j < 8; j++) {
                // if(i >=40*j && i<40*(j+1)){
                //     for (let k = 0; k < 8; k++) {
                //     if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                //         for (let l = 0; l < 5; l++) {
                //         if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.positions[3*i+ 0] = 20*j,
                            this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.backAnimationframe*2))*Math.PI/180)),
                            this.positions[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }


        }


        if(this.backAnimationframe == 980){ this.eansingBool = true;}

        // if(this.backAnimationframe == 780){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 8; j++) {
        //         if(i >=40*j && i<40*(j+1)){
        //             for (let k = 0; k < 8; k++) {
        //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        //                 for (let l = 0; l < 5; l++) {
        //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        //                     this.posTarget[3*i+ 0] = 80*Math.sin((i*2*Math.PI/180))+50,
        //                     this.posTarget[3*i+ 1] = 0+25,
        //                     this.posTarget[3*i+ 2] = 80*Math.cos((i*2*Math.PI/180))+50
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed =30;
        // }

        // if(this.backAnimationframe == 900){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 4; j++) {
        //         if(i >=80*j && i<80*(j+1)){
        //             for (let k = 0; k < 4; k++) {
        //             if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
        //                 for (let l = 0; l < 10; l++) {
        //                 if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
        //                     this.posTarget[3*i+ 0] = 4*k+50,
        //                     this.posTarget[3*i+ 1] = 1.5*l+25,
        //                     this.posTarget[3*i+ 2] = 4*j+50
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }
        //     this.easeElapsedTime =0;
        //     this.tSpeed =8.0;
        // }



        if(this.backAnimationframe == 1000){
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

        if(this.backAnimationframe == 1150){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 20; j++) {
                    if(i >=16*j && i<16*(j+1)){
                        for (let k = 0; k < 16; k++) {
                        if(i >=16*j+(1*k) && i<16*j+(1*(k+1))){
                            for (let l = 0; l < 1; l++) {
                            if(i >=16*j+(1*k)+(1*l) && i<16*j+(1*k)+(1*(l+1))){
                // for (let j = 0; j < 4; j++) {
                // if(i >=80*j && i<80*(j+1)){
                //     for (let k = 0; k < 4; k++) {
                //     if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                //         for (let l = 0; l < 10; l++) {
                //         if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 10*j,
                            this.posTarget[3*i+ 1] = 0,
                            this.posTarget[3*i+ 2] = 10*k
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
    }
}