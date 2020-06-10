
import * as THREE from "three";
import Line from '../objects/line.js';
// import { EVENT, KEYCODE } from "../utils/props.js";
import { KEYCODE } from "../utils/props.js";
import { EVENT, Action } from "../../Utils/EventManager"
import {Scene2} from './scene2_xr.js';


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
        this.addEvent_VR = this.addEvent_VR.bind(this);


        //7枚パネルの基準のカメラポジション
        // this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);
        // this.baseCamTargetPlus = new THREE.Vector3(220+50,30+25,300+50);
        this.baseCamTarget = new THREE.Vector3(-180-50,-40-25,-220-50);//こっちのが近い
        this.baseCamTargetPlus = new THREE.Vector3(180+50,40+25,220+50);

        // this.scene0 = new Scene0();//onKeyup(e)へ！
        // this.add(this.scene0);//onKeyup(e)へ！

        //最初の位置
        this.camPos = new THREE.Vector3(0, -200, -240);//正面中心に収まる位置
        this.camTarget = new THREE.Vector3(-140, -100, -140);

        //Target指定なので都度１回だけ読むようにする
        this.keyBool_startVRanime = true;
        this.updateBool = false;
        // this.camTargetBool_SPACE = false;//☆VRでは不要！！！
        this.resetCamTargetBool();
        this.camTargetBool_BACKSPACE = false;

        //☆☆☆【送るイベント】
        //EVENT.ShowCategory

        //☆☆☆【受け取るイベント】
        // EVENT.VRModeStart//VRのプチOPをはじめるスイッチ。OP終わったらEVENT.ShowCategory送信  <S>
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
        this.addEvent_VR();
    }

    update()
    {

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
                // console.log("VR_ Show Category!");
                Action.dispatch(EVENT.ShowCategory ,{mode:"VR"});//送る変数

                // if(this.camTargetBool_SPACE == true){
                //     this.camTargetBool_SPACE = false;
                    this.camTarget = this.baseCamTarget;

                    this.openCamTargetBool();
                    this.scene0.scene2.openingIsEnd = false;
                // }
            }
        }
    }

    onKeyUp(e){
        if (e.keyCode == KEYCODE.S){
        Action.dispatch(EVENT.VRModeStart);
        }
        if (e.keyCode == KEYCODE.A){
        Action.dispatch(EVENT.ShowCategory, {category:"A", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.B){
        Action.dispatch(EVENT.ShowCategory, {category:"B", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.C){
        Action.dispatch(EVENT.ShowCategory, {category:"C", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.D){
        Action.dispatch(EVENT.ShowCategory, {category:"D", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.E){
        Action.dispatch(EVENT.ShowCategory, {category:"E", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.F){
        Action.dispatch(EVENT.ShowCategory, {category:"F", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.G){
        Action.dispatch(EVENT.ShowCategory, {category:"G", mode:"VR"});
        }
        if (e.keyCode == KEYCODE.BACKSPACE){
        Action.dispatch(EVENT.BackToCategory, {mode:"VR"});
        }
    
        // if (e.keyCode == KEYCODE.S){
        // Action.dispatch(EVENT.VRModeStart);
        // }
        // if (e.keyCode == KEYCODE.A){
        // Action.dispatch(EVENT.ShowCategory, "A");
        // }
        // if (e.keyCode == KEYCODE.B){
        // Action.dispatch(EVENT.ShowCategory, "B");
        // }
        // if (e.keyCode == KEYCODE.C){
        // Action.dispatch(EVENT.ShowCategory, "C");
        // }
        // if (e.keyCode == KEYCODE.D){
        // Action.dispatch(EVENT.ShowCategory, "D");
        // }
        // if (e.keyCode == KEYCODE.E){
        // Action.dispatch(EVENT.ShowCategory, "E");
        // }
        // if (e.keyCode == KEYCODE.F){
        // Action.dispatch(EVENT.ShowCategory, "F");
        // }
        // if (e.keyCode == KEYCODE.G){
        // Action.dispatch(EVENT.ShowCategory, "G");
        // }
        // if (e.keyCode == KEYCODE.BACKSPACE){
        // Action.dispatch(EVENT.BackToCategory);
        // }
    }


    addEvent_VR(){

        Action.add(EVENT.VRModeStart, () =>{
            if(this.keyBool_startVRanime == true){
                this.keyBool_startVRanime = false;
                this.scene0 = new Scene0();
                this.add(this.scene0);
                this.updateBool = true;
                // console.log("start VR anime!");
                // this.camTargetBool_SPACE = true;
            }
        });

        Action.add(EVENT.ShowCategory, data =>{ 
        // Action.add(EVENT.ShowCategory, category =>{ 
            if(data.mode == "VR"){
                switch(data.category){
                    case "A" :
                        this.chooseRoom(this.camTargetBool_A, 0, "Go to room_A!");
                        break;
                    case "B" :
                        this.chooseRoom(this.camTargetBool_B, 1, "Go to room_B!");
                        break;
                    case "C" :
                        this.chooseRoom(this.camTargetBool_C, 3, "Go to room_C!");
                        break;
                    case "D" :
                        this.chooseRoom(this.camTargetBool_D, 4, "Go to room_D!");
                        break;
                    case "E" :
                        this.chooseRoom(this.camTargetBool_E, 6, "Go to room_E!");
                        break;
                    case "F" :
                        this.chooseRoom(this.camTargetBool_F, 7, "Go to room_F!");
                        break;
                    case "G" :
                        this.chooseRoom(this.camTargetBool_G, 9, "Go to room_G!");
                        break;
                }
            }
        });

        Action.add(EVENT.BackToCategory , data =>{
        // Action.add(EVENT.BackToCategory ,() =>{
            if(data.mode == "VR"){
                if(this.camTargetBool_BACKSPACE == true){
                    this.camTargetBool_BACKSPACE = false;
                    this.scene0.scene2.backAnimationUpdateBool = false;
                    this.scene0.scene2.backAnimationframe = this.scene0.scene2.backAnimationframeStart;
                    this.scene0.scene2.waitingFrame = 0;
                    this.scene0.scene2.openingUpdateBool = true;

                    // this.baseCamTarget = new THREE.Vector3(-220-50,-30-25,-300-50);//ここ書かないと書き換えられちゃってるぽい
                    this.baseCamTarget = new THREE.Vector3(-180-50,-40-25,-220-50);
                    this.camTarget = this.baseCamTarget;
                    console.log("VR_ Back to Category!");
                    this.openCamTargetBool();
                }
            }
        });
    }


    cam_opening(){
        //ここ不要だった、初期設定値だけでokだったので。
    }

    cam_backAnimation(){

        // if(this.scene0.scene2.backAnimationframe == 250){
        //     // this.camTarget = new THREE.Vector3(0, 0, 0);
        //     this.camTarget = new THREE.Vector3(-150, -50,-50);
        // }
        // if(this.scene0.scene2.backAnimationframe == this.scene0.scene2.backAnimationframeStart+2){
        //     this.camTarget = new THREE.Vector3(-150,-100,-150);
        // }//この座標が円中心座標
        // if(this.scene0.scene2.backAnimationframe == 1100){
        //     this.camTarget = new THREE.Vector3(70, -80,-200);
        // }
        // // if(this.scene0.scene2.backAnimationframe == 1350){
        // //     this.camTarget = new THREE.Vector3(-150,-125,-150);
        // // }
    }

    chooseRoom(camTargetBool,l,message){
        if(camTargetBool == true){
            camTargetBool = false;
            this.lookTarget = new THREE.Vector3(
                // 25*(1.5+l),8+(15*l),25*(1.5+l)
                25*1.41*(1.5+l),8+(20*l),25*0*(1.5+l)//ここVRオリジナル！！45度回転してるので。ルート２かけてる
            );
            this.camTarget.subVectors(this.lookTarget, this.baseCamTargetPlus);//Plus
            this.camTarget.multiplyScalar(0.95);
            this.camTarget.add(this.baseCamTargetPlus);
            this.camTarget.multiplyScalar(-1);//ここVRオリジナル！！
            console.log("VR_ " + message);
            this.resetCamTargetBool();

            // this.scene0.scene2.backAnimationUpdateBool = true;///////////////
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
