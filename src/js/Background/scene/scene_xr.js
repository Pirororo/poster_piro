
import * as THREE from "three";
import Line from '../objects/line.js';
// import { EVENT, KEYCODE } from "../utils/props.js";
import { KEYCODE } from "../utils/props.js";
import { EVENT, Action } from "../../Utils/EventManager"


export class Scene extends THREE.Scene
{
    constructor()
    {
        super();

        this.frame = 1200;
        this.resetCamTargetBool = this.resetCamTargetBool.bind(this);
        this.openCamTargetBool = this.openCamTargetBool.bind(this);
        this.chooseRoom = this.chooseRoom.bind(this);
        this.VR_action = this.VR_action.bind(this);


        //7枚パネルの基準のカメラポジション
        this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);
        // this.camTarget = new THREE.Vector3(-180-50,-40-25,-220-50);
        this.baseCamTargetPlus = new THREE.Vector3(220+50,30+25,300+50);

        // this.scene0 = new Scene0();//onKeyup(e)へ！
        // this.add(this.scene0);//onKeyup(e)へ！

        //最初の位置
        this.camPos = new THREE.Vector3(0, -100, -240);//(-50, -30, -200);//正面中心に収まる位置
        this.camTarget = new THREE.Vector3(-140, 0, -140);



        //Target指定なので都度１回だけ読むようにする
        this.keyBool_startVRanime = true;
        this.updateBool = false;
        // this.camTargetBool_SPACE = false;//☆VRでは不要！！！
        this.resetCamTargetBool();
        this.camTargetBool_BACKSPACE = false;

        //☆☆☆【はじめfalseだけどtrueにして送る変数】
        this.show7panels = false;

        //☆☆☆【trueで受け取りたい変数】
        // this.startVRanime = true;//VRのプチアニメをはじまるスイッチ。終わったら this.show7panels = trueが送信される  <S>
        // this.goRoom_A = true;// Aの部屋に近づくスイッチ  <A>
        // this.goRoom_B = true;// Bの部屋に近づくスイッチ  <B>
        // this.goRoom_C = true;// Cの部屋に近づくスイッチ  <C>
        // this.goRoom_D = true;// Dの部屋に近づくスイッチ  <D>
        // this.goRoom_E = true;// Eの部屋に近づくスイッチ  <E>
        // this.goRoom_F = true;// Fの部屋に近づくスイッチ  <F>
        // this.goRoom_G = true;// Gの部屋に近づくスイッチ  <G>
        // this.backToPanels;//A〜Fの部屋の中にいるんだけど違う部屋いきたいから７枚パネルのとこ戻ってほしいスイッチ  <BACKSPACE>

    }

    setup(){//ここ呼ばれてるから空でもかいてあげないとだめ
        //VRでの操作
        // this.VR_action();
        Action.add(EVENT.ShowCategoryA, () =>{
            console.log("ふむ");
            this.chooseRoom(this.camTargetBool_A, 0, "Go to room_A!");
        });
    }

    update()
    {
        //iphoneでS押せないから実機検証用
        if(this.keyBool_startVRanime == true){
            this.keyBool_startVRanime = false;
            this.scene0 = new Scene0();
            this.add(this.scene0);
            this.updateBool = true;
            console.log("start VR anime!");

            // this.frame = 0;
        }


        if(this.updateBool == true){

            this.frame += 2;//２倍速

            this.camPos.x += (this.camTarget.x - this.camPos.x) *0.01;
            this.camPos.y += (this.camTarget.y - this.camPos.y) *0.01;
            this.camPos.z += (this.camTarget.z - this.camPos.z) *0.01;
            this.scene0.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

            if(this.frame == 350){this.camTarget = new THREE.Vector3(-150, -100,-50);}
            if(this.frame == 700){this.camTarget = new THREE.Vector3(-50,-25,-50);}//この座標が円中心座標
            if(this.frame == 1100){this.camTarget = new THREE.Vector3(70,-80,-200);}
            // if(this.frame == 1350){this.camTarget = new THREE.Vector3(-150,-125,-150);}


            //ここはいつもの
            this.scene0.rotation.y = 45 *Math.PI/180;
            this.scene0.update();

            //this.scene0.scene2.openingIsEndは、最初はfalseだけどオープニングのframecountがある値にきたらtrueになる。
            if (this.scene0.scene2.openingIsEnd == true){
            //   if (this.show7panels == false){ 
            //     this.show7panels = true; //送る変数

                //VR版でカメラズームアウトするから７枚パネル出してね
                console.log("show 7 panels!");
                // if(this.camTargetBool_SPACE == true){
                //     this.camTargetBool_SPACE = false;
                    this.camTarget = this.baseCamTarget;

                    this.openCamTargetBool();
                    this.scene0.scene2.openingIsEnd = false;
                // }
            //   }
            }
        }
    }

    VR_action(){
        // Action.add(EVENT.VRModeStart, () =>{
        //     if(this.keyBool_startVRanime == true){
        //         this.keyBool_startVRanime = false;
        //         this.scene0 = new Scene0();
        //         this.add(this.scene0);
        //         this.updateBool = true;
        //         console.log("start VR anime!");

        //         // this.camTargetBool_SPACE = true;
        //     }
        // });


        Action.add(EVENT.ShowCategoryA, () =>{
            console.log("ふむ");
            this.chooseRoom(this.camTargetBool_A, 0, "Go to room_A!");
        });

        Action.add(EVENT.ShowCategoryD, () =>{
            this.chooseRoom(this.camTargetBool_D, 0, "Go to room_D!");
        });

        Action.add(EVENT.ShowCategoryG, () =>{
            this.chooseRoom(this.camTargetBool_G, 0, "Go to room_G!");
        });

        Action.add(EVENT.BackToCategory , () =>{
            if(this.camTargetBool_BACKSPACE == true){
                this.camTargetBool_BACKSPACE = false;
                this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);//ここ書かないと書き換えられちゃってるぽい
                this.camTarget = this.baseCamTarget;
                console.log("Please back to 7 panels!");
                this.openCamTargetBool();
            }
        });

    }


    onKeyUp(e)
    {
        if (e.keyCode == KEYCODE.S){//PC版で７枚パネル出すからカメラズームアウトしてね
        //   if (this.startVRanime == true){ //キーの代わりにくる変数
            if(this.keyBool_startVRanime == true){
                this.keyBool_startVRanime = false;
                this.scene0 = new Scene0();
                this.add(this.scene0);
                this.updateBool = true;
                console.log("start VR anime!");

                // this.camTargetBool_SPACE = true;
            }
        }


        if (e.keyCode == KEYCODE.A){//Aの部屋に移動してね//3
        //   if (this.goRoom_A == true){ //キーの代わりにくる変数
            this.chooseRoom(this.camTargetBool_A, 0, "Go to room_A!");
        }
        if (e.keyCode == KEYCODE.B){//Bの部屋に移動してね//3
        //   if (this.goRoom_B == true){ //キーの代わりにくる変数
            this.chooseRoom(this.camTargetBool_B, 1, "Go to room_B!");
        }
        if (e.keyCode == KEYCODE.C){//Cの部屋に移動してね//3
        //   if (this.goRoom_C == true){ //キーの代わりにくる変数
            this.chooseRoom(this.camTargetBool_C, 3, "Go to room_C!");
        }
        if (e.keyCode == KEYCODE.D){
        //   if (this.goRoom_D == true){ 
            this.chooseRoom(this.camTargetBool_D, 4, "Go to room_D!");
        }
        if (e.keyCode == KEYCODE.E){
        //   if (this.goRoom_E == true){ 
            this.chooseRoom(this.camTargetBool_E, 6, "Go to room_E!");
        }
        if (e.keyCode == KEYCODE.F){
        //   if (this.goRoom_F == true){ 
            this.chooseRoom(this.camTargetBool_F, 7, "Go to room_F!");
        }
        if (e.keyCode == KEYCODE.G){
        //   if (this.goRoom_G == true){ 
            this.chooseRoom(this.camTargetBool_G, 9, "Go to room_G!");
        }

        // if (e.keyCode == KEYCODE.A){//Aの部屋に移動してね
        // //   if (this.goRoom_A == true){ //キーの代わりにくる変数
        //     if(this.camTargetBool_A == true){
        //         this.camTargetBool_A = false;
        //         this.camTarget = new THREE.Vector3(-50-(36*2), -25-(15*1), -50+(4*2));
        //         console.log("Please go to room_A!");
        //         this.resetCamTargetBool();

        //         // this.frame = 0;
        //         // this.scene0.scene2.frame = 0;
        //         // if(this.frame >= 1200-2){
        //         //     this.frame = 1200-2;
        //         //     this.scene0.scene2.frame = 1200-2;
        //         //     this.camTarget = new THREE.Vector3(-50-(36*2), -25-(15*1), -50+(4*2));
        //         // }

        //     }
        // }


        if (e.keyCode == KEYCODE.BACKSPACE){//今部屋の中にいるんだけど違う部屋いきたいから７枚パネルのとこ戻ってね
        //   if (this.backToPanels == true){ //キーの代わりにくる変数
            if(this.camTargetBool_BACKSPACE == true){
                this.camTargetBool_BACKSPACE = false;
                this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);//ここ書かないと書き換えられちゃってるぽい
                this.camTarget = this.baseCamTarget;
                console.log("Please back to 7 panels!");
                this.openCamTargetBool();
            }
        }
    }

    chooseRoom(camTargetBool,l,message){
        if(camTargetBool == true){
            camTargetBool = false;
            this.lookTarget = new THREE.Vector3(
                // 25*(1.5+l),8+(15*l),25*(1.5+l)
                25*1.41*(1.5+l),8+(15*l),25*0*(1.5+l)//ここVRオリジナル！！45度回転してるので。ルート２
            );
            this.camTarget.subVectors(this.lookTarget, this.baseCamTargetPlus);//Plus
            this.camTarget.multiplyScalar(0.95);
            this.camTarget.add(this.baseCamTargetPlus);
            this.camTarget.multiplyScalar(-1);//ここVRオリジナル！！
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


}

export class Scene0 extends THREE.Scene
{
    constructor()
    {
        super();

        // this.camera = new Camera();

        // this.scene1 = new Scene1();
        // this.add(this.scene1);

        this.scene2 = new Scene2();
        this.add(this.scene2);
    }
    update()
    {
        // this.camera.update();
        // this.scene1.update();
        this.scene2.update();
    }
}

export class Scene1 extends THREE.Scene
{
    constructor()
    {
        super();

        // this._line = [this._line1in, this._line1out,this._line2in, this._line2out];
        this._line = [this._line1in, this._line1out];

        //今は関東ー北海道だけなのでi<1
        for (let i = 0 ; i < this._line.length/2; i++){
            for (let j= 0 ; j < 2 ; j++){
                this._line[2*i+j] = new Line(i,j);
                if(j%2 ==0){this._line[2*i+j].position.set(0,0,0);}//outは0,0,0から
                else{this._line[2*i+j].position.set(150,70,150);}//inは離れたとこから
                this.add(this._line[2*i+j]);
            }
        }
        
    }
    update(){

        for (let i = 0 ; i < this._line.length ; i++){
            this._line[i].update();
        }

    }

}

export class Scene2 extends THREE.Scene
{
    constructor()
    {
        super();

        this.frame = 1200;





        this.meshList = [];//raycast用
        this.meshGroup = new THREE.Group();

        const material = new THREE.MeshBasicMaterial( {
            color: 0xC7C7C7,
            wireframe: true,
            opacity: 0.9,
            transparent: true,
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

        this.clock = new THREE.Clock();
        this.tSpeed  =2;
        this.easeElapsedTime =0;
        this.eansingBool = true;

        this.add(this.meshGroup);

        this.openingIsEnd = false;
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

        if(this.frame == 1370){
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


        if(this.frame == 1470){
            if(this.openingIsEnd == false){this.openingIsEnd = true;}
        }

    }
}