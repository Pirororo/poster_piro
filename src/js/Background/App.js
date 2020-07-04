import * as THREE from "three";
import { KEYCODE } from "./utils/props.js";
import { EVENT, Action } from "../Utils/EventManager";

//fps表示とDAT表示に必要なjs
// import {GUI} from 'three/examples/jsm/libs/dat.gui.module';
// import Stats from "./objects/status";
import StatsView from "./objects/statsView";

// カメラ系に必要なjs
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//シェーダーに必要なjs
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { MaskPass } from "three/examples/jsm/postprocessing/MaskPass";
import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";

//自作のグラジエントシェーダ
import { ColorifyGradientEasingShader } from "./shaders/ColorifyGradientEasingShader.mine";
// import { CompressedTextureLoader } from "three/build/three";



export default class App
{

    constructor(sceneInstance){

        this.masterFrame = 0;
        
        
        this.chooseRoomColor = this.chooseRoomColor.bind(this);
        this.backToColor = this.backToColor.bind(this);

        // ////データ通信量表示
        // this._initStats = this._initStats.bind(this);
        // this._stats = this._initStats();
        ////米倉先生バージョン
        this._initStatsView= this._initStatsView.bind(this);
        this._statsView = this._initStatsView();

        // シーン
        this._scene = sceneInstance;


        //レンダラー
        this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this._renderer.setClearColor(new THREE.Color(0x000000), 0);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(1);

        // DOMを追加////あとで簡略化する！順番も
        this._wrapper = document.getElementById('WebGL-output');
        this._wrapper.appendChild(this._renderer.domElement);

        // //カメラ
        // this.orbitControls = new OrbitControls(this._scene.camera, this._renderer.domElement);
        // this.orbitControls.autoRotate = false;
        // this.orbitControls.enableDamping = true;
        // this.orbitControls.dampingFactor = 0.2;
        this.clock = new THREE.Clock();

        // リサイズ
        this.onResize();

        // シェーダー
        //レンダーパス
        // var renderPass = new RenderPass(this._scene.scene0, this._scene.camera);
        var renderPass = new RenderPass(this._scene, this._scene.camera);
        renderPass.clear = true;

        // var renderPass1 = new RenderPass(this._scene.scene0.scene1, this._scene.camera);
        // renderPass1.clear = true;//Lineは線が更新されていくのでtrueにする、falseだと線最初から全部のこっちゃう
        // var renderPass2 = new RenderPass(this._scene.scene0.scene2, this._scene.camera);
        // renderPass2.clear = true;//trueで色がでる
        // //**********renderPass両方falseだとopasity0みたいに明るくなりすぎる、ライト二重？ */

        // マスクパス、クリアマスクパス
        // let sceneMask = new MaskPass(this._scene.scene0, this._scene.camera);
        let sceneMask = new MaskPass(this._scene, this._scene.camera);
        let clearMask = new ClearPass();


        //エフェクトパス（出力パスの前にかく）
        //グラデパス
        this.colorify = new ShaderPass(ColorifyGradientEasingShader);
        this.gradColor1 = 0x734ca4;
        this.gradColor2 = 0x4ea78;
        this.targetGradColor1 = 0x734ca4;
        this.targetGradColor2 = 0x4ea78;

        this.colorify.uniforms.color.value = new THREE.Color(this.gradColor1);//0x4ea78e
        this.colorify.uniforms.color2.value = new THREE.Color(this.gradColor2);//0x648
        this.colorify.uniforms.targetColor.value = new THREE.Color(this.targetGradColor1);
        this.colorify.uniforms.targetColor2.value = new THREE.Color(this.targetGradColor2);
        this.colorify.uniforms.time.value = 0.0;
        this.duration = 60.0;
        this.colorify.uniforms.duration.value = this.duration;
        this.colorify.uniforms.alpha = 0.8;
        this.colorify.enabled = true;

        this.gradeColorBool = false;//グラデ開始スイッチ
        this.gradeColorFrame = 0;
        this.saveColor1 = 0x000000;
        this.saveColor2 = 0x000000;


        //ブルームパス
        // var bloomPass = new BloomPass(1.5, 15, 3.0, 64);
        var bloomPass = new BloomPass(2.0, 15, 3.0, 64);
        bloomPass.enabled = true;

        //出力パス
        //コピーパス
        var effectCopy = new ShaderPass(CopyShader);//コピー
        effectCopy.renderToScreen = true;


        //コンポーザーの定義
        this.composer = new EffectComposer(this._renderer);
        this.composer.renderTarget1.stencilBuffer = true;//?
        this.composer.renderTarget2.stencilBuffer = true;//?

        //コンポーザーに入れていく
        this.composer.addPass(renderPass);//Scene1(Line)のレンダー
        // this.composer.addPass(renderPass1);//Scene1(Line)のレンダー
        // this.composer.addPass(renderPass2);//Scene2(Plate)のレンダー

        // this.composer.addPass(sceneMask);
        this.composer.addPass(this.colorify);//Scene2(Plate)のマスクのエフェクト
        
        // this.composer.addPass(clearMask);
        this.composer.addPass(bloomPass);
        this.composer.addPass(effectCopy);

    }


    update()
    {

        // // ワールド座標を取得
        // const world = this._scene.camera.getWorldPosition();
        // console.log(world);

        // var delta = this.clock.getDelta();
        // this.orbitControls.update(delta);

        this._statsView.update();


        //２回に１回読む
        this.masterFrame += 1;
        if(this.masterFrame == 2){

            // //fps表示の更新
            // this._stats.update();

            // シーンの更新
            this._scene.update();
            //グラデーションのイージング
            if(this.gradeColorBool == true){
              this.gradeColorFrame += 1;
              this.colorify.uniforms.time.value = this.gradeColorFrame;
              if(this.gradeColorFrame > this.duration){//60で変化終える
                this.gradeColorBool = false;
                this.gradeColorFrame = 0;
              }
            }
            // console.log(this.gradeColorFrame);//0~60

            //レンダー
            this._renderer.autoClear = false;//大事！trueだと色が毎回背景色にクリアされる
            this.composer.render();

            this.masterFrame =0;
        }
    }

    onKeyUp(e)
    {
        if (e.keyCode == KEYCODE.A){
          Action.dispatch(EVENT.ShowCategory, {category:"A", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.B){
          Action.dispatch(EVENT.ShowCategory, {category:"B", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.C){
          Action.dispatch(EVENT.ShowCategory, {category:"C", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.D){
          Action.dispatch(EVENT.ShowCategory, {category:"D", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.E){
          Action.dispatch(EVENT.ShowCategory, {category:"E", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.F){
          Action.dispatch(EVENT.ShowCategory, {category:"F", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.G){
          Action.dispatch(EVENT.ShowCategory, {category:"G", mode:"normal"});
        }
        if (e.keyCode == KEYCODE.BACKSPACE){
          Action.dispatch(EVENT.BackToCategory, {mode:"normal"});
        }
        this._scene.onKeyUp(e);//これがcamTargetBoolをfalseにするから最後にかく

    }


    addEvent()//グラデめも    0x5de2ff, 0x3333a7
    {   
        Action.add(EVENT.ShowCategory, data =>{//0x730B1E

            if(data.mode == "normal"){
                switch(data.category){
                    case "A" :
                        //0x666000(0x295FCC, 0x9629CC);//0x2bd6e1
                        this.chooseRoomColor(this._scene.camTargetBool_A, 0xd790b1, 0x9b0a0a);
                        break;
                    case "B" :
                        //(0x2EC7E5, 0x295FCC);//0x14662F
                        this.chooseRoomColor(this._scene.camTargetBool_B,0xa6eb72, 0x14662F);
                        break;
                    case "C" :
                        //0x807B0D(0xa6eb72, 0x24B253);//0x807B0D
                        this.chooseRoomColor(this._scene.camTargetBool_C, 0x825b30, 0xbeba3c);
                        break;
                    case "D" :
                        //(0x268983, 0xa27b);//0x193C80//29CCBE,0xa297//
                        this.chooseRoomColor(this._scene.camTargetBool_D, 0x2EC7E5, 0x295FCC);
                        break;
                    case "E" :
                        //0xbeae3c(0x3a7d, 0x268983);//0x8C5605
                        this.chooseRoomColor(this._scene.camTargetBool_E, 0xa77f01, 0x9b4e0a);
                        break;
                    case "F" :
                        //(0x9629CC, 0x295FCC);//0x2B1980
                        this.chooseRoomColor(this._scene.camTargetBool_F, 0x9629CC, 0x295FCC);
                        break;
                    case "G" :
                        //(0xCC2995, 0x9629CC);//0x8C1C66
                        this.chooseRoomColor(this._scene.camTargetBool_G, 0x730B1E, 0x8C1C66);
                        break;
                }
            }
            // else{
            //     console.log("Someone already called ShowCategory")
            // }
        });
        
        Action.add(EVENT.BackToCategory, data =>{
            if(data.mode == "normal"){
                this.backToColor(this._scene.camTargetBool_BACKSPACE);
            }
            // else{
            //     console.log("Someone already called BackToCategory")
            // }
        });

        this._scene.addEvent();

    }

    chooseRoomColor(camTargetBool,targetGradColor1,targetGradColor2){
        console.log(this._scene.changeColorBool);
        if(this._scene.changeColorBool == true){
            this.gradeColorBool = true;
            this.colorify.uniforms.color.value = new THREE.Color(this.gradColor1);
            this.colorify.uniforms.color2.value = new THREE.Color(this.gradColor2);
            this.colorify.uniforms.targetColor.value = new THREE.Color(targetGradColor1);
            this.colorify.uniforms.targetColor2.value = new THREE.Color(targetGradColor2);
        this.saveColor1 = targetGradColor1;
        this.saveColor2 = targetGradColor2;
        }
    }

    backToColor(camTargetBool){
        // if(camTargetBool == true){//これはsceneで読むからfalseにしない
            this.gradeColorBool = true;
            this.colorify.uniforms.color.value = new THREE.Color(this.saveColor1);
            this.colorify.uniforms.color2.value = new THREE.Color(this.saveColor2);
            this.colorify.uniforms.targetColor.value = new THREE.Color(this.gradColor1);
            this.colorify.uniforms.targetColor2.value = new THREE.Color(this.gradColor2);
        // }

    }


    draw(){

    }

    // /**
    // * マウスイベント
    // */
    // handleMouseMove( event ) {
    //   // calculate mouse position in normalized device coordinates
    //   // (-1 to +1) for both components
    //   this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    //   this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    //   console.log("okMouse");
    // }

    /**
     * リサイズ
     */
    onResize()
    {
        const width = this._wrapper.clientWidth;
        const height = this._wrapper.clientHeight;
        this._renderer.domElement.setAttribute('width', String(width));
        this._renderer.domElement.setAttribute('height', String(height));
        this._renderer.setPixelRatio(window.devicePixelRatio || 1.0);
        this._renderer.setSize(width, height);
        this._scene.camera.aspect = width / height;
        this._scene.camera.updateProjectionMatrix();
    }

    // _initStats()
    // {
    //     this._stats = new Stats();

    //     // Align top-left
    //     this._stats.domElement.style.position = 'absolute';
    //     this._stats.domElement.style.left = '20px';
    //     this._stats.domElement.style.top = '80%';

    //     document.getElementById("Stats-output").appendChild(this._stats.domElement);

    //     return this._stats;
    // }

    //データ通信量表示の初期化（米倉先生のDOMバージョン）
    _initStatsView()
    {
        const backgroundEl = document.getElementById('background_container');
        this._statsView = new StatsView(backgroundEl);
        this._statsView.setup();

    //     // this._statsView = new StatsView();
    //     // this._statsView.setup();//this.statsContainer
    //     // document.getElementById('background_container').appendChild(this._statsView.statsContainer);

        return this._statsView;
    }

}