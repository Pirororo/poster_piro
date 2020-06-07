import * as THREE from "three";
import {Camera} from '../camera/camera.js';
import Line from '../objects/line.js';
import { KEYCODE } from "../utils/props.js";
import { EVENT, Action } from "../../Utils/EventManager"


/**
 * シーンクラス：カメラとライト
 */
export class Scene extends THREE.Scene
{
    constructor()
    {
        super();

        this.resetCamTargetBool = this.resetCamTargetBool.bind(this);
        this.openCamTargetBool = this.openCamTargetBool.bind(this);
        this.chooseRoom = this.chooseRoom.bind(this);

        //mainCamera
        this.camera = new Camera();//最終的にはFacade.jsでsceneにaddする
        //7枚パネルの基準のカメラポジション
        this.baseCamTarget = new THREE.Vector3(-200,70,400);//-300,70,300?
        //シーンを統合
        this.scene0 = new Scene0();
        this.add(this.scene0);

        //Target指定なので都度１回だけ読むようにする
        this.frameBool_skipAnime = true;
        this.camTargetBool_openingIsEnd = false;
        this.resetCamTargetBool();
        this.camTargetBool_BACKSPACE = false;

        //☆☆☆【送るイベント】
        // EVENT.selectVRorNot

        //☆☆☆【受け取るイベント】
        // EVENT.skipAnime//アニメをスキップさせ、EVENT.selectVRorNotを送信するスイッチ  <K>
        // EVENT.PCModeContinue//７枚パネル出るタイミングでズームアウトするスイッチ  <SPACE>
        // EVENT.ShowCategoryA// Aの部屋に近づくスイッチ  <A>
        // EVENT.ShowCategoryB// Bの部屋に近づくスイッチ  <B>
        // EVENT.ShowCategoryC// Cの部屋に近づくスイッチ  <C>
        // EVENT.ShowCategoryD// Dの部屋に近づくスイッチ  <D>
        // EVENT.ShowCategoryE// Eの部屋に近づくスイッチ  <E>
        // EVENT.ShowCategoryF// Fの部屋に近づくスイッチ  <F>
        // EVENT.ShowCategoryG// Gの部屋に近づくスイッチ  <G>
        // EVENT.BackToCategory//７枚パネルのとこ戻ってほしいスイッチ  <BACKSPACE>

    }

    update()
    {
        //this.scene0.scene2.openingIsEndは、最初はfalseだけど
        //オープニングのframecountがある値にきたらtrueになる。
        if (this.scene0.scene2.openingIsEnd == true){

            //OP終わったからVR使うかどうか選択してね
            // Action.dispatch(EVENT.selectVRorNot);//送る変数
            console.log("Opening is end and select VR or not");
            this.scene0.scene2.openingIsEnd = false;
            this.camTargetBool_openingIsEnd = true;
            // this.camTargetBool_BACKSPACE = true;//[SPACE]を[BS]で兼ねるならいれる

        }

        this.camera.update();//lookAtで中心みてる
        this.scene0.update();
    }

    onKeyUp(e)
    {
        if (e.keyCode == KEYCODE.K){
        // Action.add(EVENT.skipAnime, () =>{//キーの代わりにくる変数
            if(this.frameBool_skipAnime == true 
                && this.scene0.scene2.frame < this.scene0.scene2.frameSlide-2){//ここ斜めになるtargetPosの時間の一歩手前！！
                this.frameBool_skipAnime = false;
                this.camera.frame = this.scene0.scene2.frameSlide-2;
                this.scene0.scene2.frame = this.scene0.scene2.frameSlide-2;
                console.log("skip animation !");
            }
        }
        
        if (e.keyCode == KEYCODE.SPACE){
        // Action.add(EVENT.PCModeContinue, () =>{ //キーの代わりにくる変数
            if(this.camTargetBool_openingIsEnd == true){
                this.camTargetBool_openingIsEnd = false;
                this.camera.camTarget = this.baseCamTarget;
                this.camera.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
                console.log("continue PC mode!");//zoom out
                this.openCamTargetBool();
            }
        }
        
        if (e.keyCode == KEYCODE.A){
        // Action.add(EVENT.ShowCategoryA, () =>{//キーの代わりにくる変数
            this.chooseRoom(this.camTargetBool_A, 0, "Go to room_A!");
        }
        if (e.keyCode == KEYCODE.B){
        // Action.add(EVENT.ShowCategoryB, () =>{//キーの代わりにくる変数
            this.chooseRoom(this.camTargetBool_B, 1, "Go to room_B!");
        }
        if (e.keyCode == KEYCODE.C){
        // Action.add(EVENT.ShowCategoryC, () =>{ //キーの代わりにくる変数
            this.chooseRoom(this.camTargetBool_C, 3, "Go to room_C!");
        }
        if (e.keyCode == KEYCODE.D){
        // Action.add(EVENT.ShowCategoryD, () =>{ 
            this.chooseRoom(this.camTargetBool_D, 4, "Go to room_D!");
        }
        if (e.keyCode == KEYCODE.E){
        // Action.add(EVENT.ShowCategoryE, () =>{ 
            this.chooseRoom(this.camTargetBool_E, 6, "Go to room_E!");
        }
        if (e.keyCode == KEYCODE.F){
        // Action.add(EVENT.ShowCategoryF, () =>{
            this.chooseRoom(this.camTargetBool_F, 7, "Go to room_F!");
        }
        if (e.keyCode == KEYCODE.G){
        // Action.add(EVENT.ShowCategoryG, () =>{
            this.chooseRoom(this.camTargetBool_G, 9, "Go to room_G!");
        }

        if (e.keyCode == KEYCODE.BACKSPACE){//今部屋の中だけど違う部屋いきたいから７枚パネルのとこ戻ってね
        // Action.add(EVENT.BackToCategory, () =>{ //キーの代わりにくる変数
            // if(this.camTargetBool_openingIsEnd == true){//[SPACE]を[BS]で兼ねるならいれる
                if(this.camTargetBool_BACKSPACE == true){
                    this.camTargetBool_BACKSPACE = false;
                    this.camera.camTarget = this.baseCamTarget;
                    this.camera.lookTarget = new THREE.Vector3(140, 70, 140);//斜めのときの中心
                    console.log("Back to 7 panels!");
                    this.openCamTargetBool();
                }
            // }
        }
    }

    chooseRoom(camTargetBool,l,message){
        if(camTargetBool == true){
            camTargetBool = false;
            this.camera.lookTarget = new THREE.Vector3(
                25*(1.5+l),8+(15*l),25*(1.5+l)
            );
            this.baseCamTarget = new THREE.Vector3(-200,70,400);//ここ書かないと書き換えられちゃってるぽい
            this.camera.camTarget.subVectors(this.camera.lookTarget, this.baseCamTarget);
            this.camera.camTarget.multiplyScalar(0.9);
            this.camera.camTarget.add(this.baseCamTarget);
            console.log(message);
            this.resetCamTargetBool();
        }
    }

    resetCamTargetBool(){
        this.camTargetBool_BACKSPACE = true;
        this.camTargetBool_A = false;
        this.camTargetBool_B = false;
        this.camTargetBool_C = false;
        this.camTargetBool_D = false;
        this.camTargetBool_E = false;
        this.camTargetBool_F = false;
        this.camTargetBool_G = false;
    }

    openCamTargetBool(){
        this.camTargetBool_BACKSPACE = false;
        this.camTargetBool_A = true;
        this.camTargetBool_B = true;
        this.camTargetBool_C = true;
        this.camTargetBool_D = true;
        this.camTargetBool_E = true;
        this.camTargetBool_F = true;
        this.camTargetBool_G = true;
    }


  // addEvent() {}

}



//***********************        Scene0        *************************//


export class Scene0 extends THREE.Scene {

    constructor(){

        super();

        this.scene1 = new Scene1();
        this.add(this.scene1);

        this.scene2 = new Scene2();
        this.add(this.scene2);

    }

    update(){
        this.scene1.update();
        this.scene2.update();
    }

}



//***********************        Scene1        *************************//


export class Scene1 extends THREE.Scene {

    constructor(){

        super();

        // //ライン
        // this._line = new Line();
        // this._line.position.set(150,70,150);
        // this.add(this._line);

        // this._line1in = new Line(0,1);
        // this._line1out = new Line(0,2);
        // this._line1in.position.set(150,70,150);
        // this._line1out.position.set(150,70,150);
        // this.add(this._line1in);
        // this.add(this._line1out);


        // this._line = [this._line1in, this._line1out,this._line2in, this._line2out];
        this._line = [this._line1in, this._line1out];

        //今は関東ー北海道だけなのでi<1
        for (let i = 0 ; i < this._line.length/2; i++){
            for (let j= 0 ; j < 2 ; j++){//ここj=1; j<3にしたら「キャッシュを待機しています」→配列外だった
                this._line[2*i+j] = new Line(i,j+1);//inは１、outは２になるようにjに+1する
                if(j%2 ==0){this._line[2*i+j].position.set(0,0,0);}//outは0,0,0から
                else{this._line[2*i+j].position.set(200,90,200);}//inは離れたとこから
                this.add(this._line[2*i+j]);
            }
        }

        ////meshにまとめようかな、、、groupとか

    }

    setup(){}
    
    update(){
        // this._line.update();

        // this._line1in.update();
        // this._line1out.update();

        for (let i = 0 ; i < this._line.length ; i++){
            this._line[i].update();
        }

    }
}




//***********************        Scene2        *************************//


export class Scene2 extends THREE.Scene {

    constructor(){

        super();

        this.frame = 0;/////////////////////////////1050
        this.frameSlide = 1260;





        //プレート
        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        const material = new THREE.MeshBasicMaterial( { 
            color: 0xffffff, 
            wireframe: true,
            // wireframeLinewidth:3.5,//いみなかった
            opacity: 0.95,
            transparent: true,
        } );

        this.PlateNum = 320;
        this.positions = [];
        this.posTarget = [];

        for (let i = 0; i < this.PlateNum; i++) {

            this.floorsize = 27;//12;
            // this.geometry = new THREE.BoxBufferGeometry(this.floorsize, 0.2, this.floorsize);
            this.geometry = new THREE.PlaneBufferGeometry(this.floorsize, this.floorsize);


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


        this.clock = new THREE.Clock();
        this.tSpeed  =2;
        this.easeElapsedTime =0;
        this.eansingBool = true;

        this.openingIsEnd = false;

    }


    update(){

        if(this.frame < 1800){
            this.frame += 2;//２倍速
        }else{ 
            this.frame = 1800;//1800以上は読まないよー
            this.eansingBool == false;//頂点入れ替えもしない。
        }

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
        if(this.frame == 100){
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

        if(this.frame == 150){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 20; l++) {
                        if(i >=80*j+(20*k)+(1*l) && i<80*j+(20*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 20*j,
                            this.posTarget[3*i+ 1] = 7*l,
                            this.posTarget[3*i+ 2] = 20*k
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed = 3.0;
        }

        if(this.frame == 230){//280
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
            this.tSpeed = 3.0;
        }

        if(this.frame == 310){//430
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
            this.tSpeed = 3.0;
        }


        if(this.frame == 360){//490
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
            this.tSpeed = 3.0;
        }


        if(this.frame == 410){//550
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
            this.tSpeed = 3.0;

        }

        if(this.frame == 460){

            this.frame += (780 - 460);
        }


        // if(this.frame == 600){
        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 8; j++) {
        //         if(i >=40*j && i<40*(j+1)){
        //             for (let k = 0; k < 8; k++) {
        //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        //                 for (let l = 0; l < 5; l++) {
        //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        //                     this.posTarget[3*i+ 0] = 20*j,
        //                     this.posTarget[3*i+ 1] =  (30*Math.sin((30*(j+k)+((this.frame+60)*2))*Math.PI/180)),
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



        // if(this.frame == 660){ this.eansingBool = false;}

        // if(this.frame >= 660 && this.frame < 780){

        //     for (let i = 0; i < this.meshList.length; i++) {
        //         this.meshList[i].position.x = this.positions[3*i+ 0];
        //         this.meshList[i].position.y = this.positions[3*i+ 1];
        //         this.meshList[i].position.z = this.positions[3*i+ 2];
        //     }

        //     for (let i = 0; i < this.meshList.length; i++) {
        //         for (let j = 0; j < 8; j++) {
        //         if(i >=40*j && i<40*(j+1)){
        //             for (let k = 0; k < 8; k++) {
        //             if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
        //                 for (let l = 0; l < 5; l++) {
        //                 if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
        //                     this.positions[3*i+ 0] = 20*j,
        //                     this.positions[3*i+ 1] = (30*Math.sin((30*(j+k)+(this.frame*2))*Math.PI/180)),
        //                     this.positions[3*i+ 2] = 20*k
        //                 }
        //                 }
        //             }
        //             }
        //         }
        //         }
        //     }

           
        // }


        // if(this.frame == 780){ this.eansingBool = true;}

        if(this.frame == 780){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 8; j++) {
                if(i >=40*j && i<40*(j+1)){
                    for (let k = 0; k < 8; k++) {
                    if(i >=40*j+(5*k) && i<40*j+(5*(k+1))){
                        for (let l = 0; l < 5; l++) {
                        if(i >=40*j+(5*k)+(1*l) && i<40*j+(5*k)+(1*(l+1))){
                            this.posTarget[3*i+ 0] = 70*Math.sin((i*2*Math.PI/180))+50,
                            this.posTarget[3*i+ 1] = 0+25,
                            this.posTarget[3*i+ 2] = 70*Math.cos((i*2*Math.PI/180))+50
                        }
                        }
                    }
                    }
                }
                }
            }
            this.easeElapsedTime =0;
            this.tSpeed =5;//30
        }

        if(this.frame == 880){
            for (let i = 0; i < this.meshList.length; i++) {
                for (let j = 0; j < 4; j++) {
                if(i >=80*j && i<80*(j+1)){
                    for (let k = 0; k < 4; k++) {
                    if(i >=80*j+(20*k) && i<80*j+(20*(k+1))){
                        for (let l = 0; l < 10; l++) {
                        if(i >=80*j+(20*k)+(2*l) && i<80*j+(20*k)+(2*(l+1))){
                            this.posTarget[3*i+ 0] = 20*k+50,
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
            this.tSpeed =4.0;
        }



        if(this.frame == 960){
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
            this.tSpeed =7.0;
        }

        if(this.frame == 1080){
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

        if(this.frame == 1150){
            this.frame += (1200-1150);
        }

        if(this.frame == 1200){
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

        if(this.frame == this.frameSlide){//1260
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
            this.tSpeed =6.0;
        }

        if(this.frame == 1420){
            if(this.openingIsEnd == false){
                this.openingIsEnd = true;
            }
        }

    }

}