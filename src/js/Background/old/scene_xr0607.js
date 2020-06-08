
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

        // this.frame = 1200;

        this.cam_opening = this.cam_opening.bind(this);
        this.cam_backAnimation = this.cam_backAnimation.bind(this);
        this.resetCamTargetBool = this.resetCamTargetBool.bind(this);
        this.openCamTargetBool = this.openCamTargetBool.bind(this);
        this.chooseRoom = this.chooseRoom.bind(this);
        this.VR_action = this.VR_action.bind(this);


        //7枚パネルの基準のカメラポジション
        // this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);
        // this.baseCamTargetPlus = new THREE.Vector3(220+50,30+25,300+50);
        this.baseCamTarget = new THREE.Vector3(-180-50,-40-25,-220-50);//こっちのが近い
        this.baseCamTargetPlus = new THREE.Vector3(180+50,40+25,220+50);

        // this.scene0 = new Scene0();//onKeyup(e)へ！
        // this.add(this.scene0);//onKeyup(e)へ！

        //最初の位置
        this.camPos = new THREE.Vector3(0, -100, -240);//正面中心に収まる位置
        this.camTarget = new THREE.Vector3(-140, 0, -140);

        //Target指定なので都度１回だけ読むようにする
        this.keyBool_startVRanime = true;
        this.updateBool = false;
        // this.camTargetBool_SPACE = false;//☆VRでは不要！！！
        this.resetCamTargetBool();
        this.camTargetBool_BACKSPACE = false;

        //☆☆☆【送るイベント】
        //EVENT.OPisEnd

        //☆☆☆【受け取るイベント】
        // EVENT.VRModeStart//VRのプチOPをはじめるスイッチ。OP終わったらEVENT.OPisEnd送信される  <S>
        // EVENT.ShowCategoryA// Aの部屋に近づくスイッチ  <A>
        // EVENT.ShowCategoryB// Bの部屋に近づくスイッチ  <B>
        // EVENT.ShowCategoryC// Cの部屋に近づくスイッチ  <C>
        // EVENT.ShowCategoryD// Dの部屋に近づくスイッチ  <D>
        // EVENT.ShowCategoryE// Eの部屋に近づくスイッチ  <E>
        // EVENT.ShowCategoryF// Fの部屋に近づくスイッチ  <F>
        // EVENT.ShowCategoryG// Gの部屋に近づくスイッチ  <G>
        // EVENT.BackToCategory//７枚パネルのとこ戻ってほしいスイッチ  <BACKSPACE>

    }

    setup(){//ここ呼ばれてるから空でもかいてあげないとだめ
        //VRでの操作
        this.VR_action();
    }

    update()
    {
        // //iphoneでS押せないから実機検証用
        // if(this.keyBool_startVRanime == true){
        //     this.keyBool_startVRanime = false;
        //     this.scene0 = new Scene0();
        //     this.add(this.scene0);
        //     this.updateBool = true;
        //     console.log("start VR anime!");
        // }


        if(this.updateBool == true){

            //イージング
            this.camPos.x += (this.camTarget.x - this.camPos.x) *0.02;
            this.camPos.y += (this.camTarget.y - this.camPos.y) *0.02;
            this.camPos.z += (this.camTarget.z - this.camPos.z) *0.02;
            this.scene0.position.set(this.camPos.x,this.camPos.y,this.camPos.z);

            //ここはいつもの更新
            this.scene0.rotation.y = 45 *Math.PI/180;
            this.scene0.update();

            //カメラワークの更新
            if(this.scene0.scene2.openingUpdateBool == true){
                this.cam_opening();
            }
            if(this.scene0.scene2.backAnimationUpdateBool == true){
                if(this.scene0.scene2.waitingFrame == 240+2){
                    this.cam_backAnimation();
                }
            }


            //⬇︎最初はfalseだけどオープニングのthis.framecountがある値にきたらtrueで帰ってくる
            if (this.scene0.scene2.openingIsEnd == true){

                //VR版でカメラズームアウトするから７枚パネル出してね
                console.log("VR Opening is end!");
                // Action.dispatch(EVENT.OPisEnd);//送る変数

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

        Action.add(EVENT.VRModeStart, () =>{
            if(this.keyBool_startVRanime == true){
                this.keyBool_startVRanime = false;
                this.scene0 = new Scene0();
                this.add(this.scene0);
                this.updateBool = true;
                console.log("start VR anime!");
                // this.camTargetBool_SPACE = true;
            }
        });

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
                this.scene0.scene2.backAnimationUpdateBool = false;
                this.scene0.scene2.backAnimationframe = this.scene0.scene2.backAnimationframeStart;
                this.scene0.scene2.waitingFrame = 0;
                this.scene0.scene2.openingUpdateBool = true;

                // this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);//ここ書かないと書き換えられちゃってるぽい
                this.baseCamTarget = new THREE.Vector3(-180-50,-40-25,-220-50);
                this.camTarget = this.baseCamTarget;
                console.log("Please back to 7 panels!");
                this.openCamTargetBool();
            }
        });

    }


    onKeyUp(e)
    {
        if (e.keyCode == KEYCODE.S){//ユーザースタート
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

        if (e.keyCode == KEYCODE.A){
            this.chooseRoom(this.camTargetBool_A, 0, "Go to room_A!");
        }
        if (e.keyCode == KEYCODE.B){
            this.chooseRoom(this.camTargetBool_B, 1, "Go to room_B!");
        }
        if (e.keyCode == KEYCODE.C){
            this.chooseRoom(this.camTargetBool_C, 3, "Go to room_C!");
        }
        if (e.keyCode == KEYCODE.D){
            this.chooseRoom(this.camTargetBool_D, 4, "Go to room_D!");
        }
        if (e.keyCode == KEYCODE.E){
            this.chooseRoom(this.camTargetBool_E, 6, "Go to room_E!");
        }
        if (e.keyCode == KEYCODE.F){
            this.chooseRoom(this.camTargetBool_F, 7, "Go to room_F!");
        }
        if (e.keyCode == KEYCODE.G){
            this.chooseRoom(this.camTargetBool_G, 9, "Go to room_G!");
        }

        if (e.keyCode == KEYCODE.BACKSPACE){//今部屋の中にいるんだけど違う部屋いきたいから７枚パネルのとこ戻ってね
            if(this.camTargetBool_BACKSPACE == true){
                this.camTargetBool_BACKSPACE = false;
                this.scene0.scene2.backAnimationUpdateBool = false;
                this.scene0.scene2.backAnimationframe = this.scene0.scene2.backAnimationframeStart;
                this.scene0.scene2.waitingFrame = 0;
                this.scene0.scene2.openingUpdateBool = true;

                // this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);//ここ書かないと書き換えられちゃってるぽい
                this.baseCamTarget = new THREE.Vector3(-180-50,-40-25,-220-50);
                this.camTarget = this.baseCamTarget;
                console.log("Please back to 7 panels!");
                this.openCamTargetBool();
            }
        }
    }


    cam_opening(){
        //ここ不要だった、初期設定値だけでokだったので。
    }
    cam_backAnimation(){

        // console.log("com?")
        // console.log("this.scene0.scene2.backAnimationframe")
        if(this.scene0.scene2.backAnimationframe == 250){
            // this.camTarget = new THREE.Vector3(0, 0, 0);
            this.camTarget = new THREE.Vector3(-150, -50,-50);
        }
        if(this.scene0.scene2.backAnimationframe == this.scene0.scene2.backAnimationframeStart+2){
            this.camTarget = new THREE.Vector3(-150,-100,-150);
        }//この座標が円中心座標
        if(this.scene0.scene2.backAnimationframe == 1100){
            this.camTarget = new THREE.Vector3(70, -80,-200);
        }
        // if(this.scene0.scene2.backAnimationframe == 1350){
        //     this.camTarget = new THREE.Vector3(-150,-125,-150);
        // }
    }

    chooseRoom(camTargetBool,l,message){
        if(camTargetBool == true){
            camTargetBool = false;
            this.lookTarget = new THREE.Vector3(
                // 25*(1.5+l),8+(15*l),25*(1.5+l)
                25*1.41*(1.5+l),8+(15*l),25*0*(1.5+l)//ここVRオリジナル！！45度回転してるので。ルート２かけてる
            );
            this.camTarget.subVectors(this.lookTarget, this.baseCamTargetPlus);//Plus
            this.camTarget.multiplyScalar(0.95);
            this.camTarget.add(this.baseCamTargetPlus);
            this.camTarget.multiplyScalar(-1);//ここVRオリジナル！！
            console.log(message);
            this.resetCamTargetBool();

            this.scene0.scene2.backAnimationUpdateBool = true;///////////////
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

        // this.scene1 = new Scene1();
        // this.add(this.scene1);

        this.scene2 = new Scene2();
        this.add(this.scene2);
    }
    update()
    {
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
    update()
    {
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

        this.opening = this.opening.bind(this);
        this.backAnimation = this.backAnimation.bind(this);


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
            // blending: THREE.AddBlending,


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

    update()
    {
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