import * as THREE from "three";
import { EVENT, KEYCODE } from "../utils/props.js";

//fps表示とDAT表示に必要なjs
import {GUI} from 'three/examples/jsm/libs/dat.gui.module';
import Stats from "three/examples/jsm/libs/stats.module";
// カメラ系に必要なjs
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//シェーダーに必要なjs
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { MaskPass } from "three/examples/jsm/postprocessing/MaskPass";
import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";

//自作のグラジエントシェーダ
import { ColorifyGradientEasingShader } from "../shaders/ColorifyGradientEasingShader.mine";
import { CompressedTextureLoader } from "three/build/three";



export default class App
{

  constructor(sceneInstance){

    this.masterFrame = 0;
    
    this._initStats = this._initStats.bind(this);
    this.chooseRoomColor = this.chooseRoomColor.bind(this);
    this.backToColor = this.backToColor.bind(this);

    //fps表示
    this._stats = this._initStats();

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


    // var controls = new function () {

    //     this.select = 'Colorify';

    //     //グラデパス
    //     this.color = 0x734ca4;
    //     this.color2 = 0x4ea78;

    //     // //ブルームパス
    //     // this.strength = 0.1;
    //     // this.kernelSize = 5;
    //     // this.sigma = 1.0;
    //     // this.resolution = 64;

    //     // this.rotate = false;

    //     this.changeColor = function () {
    //         // this.colorify.uniforms.color.value = new THREE.Color(controls.color);
    //         this.colorify.uniforms.color.value = controls.color;

    //     };
    //     this.changeColor2 = function () {
    //         this.colorify.uniforms.color2.value = new THREE.Color(controls.color2);
    //     };
    // };


    // const gui = new GUI();

    // gui.add(controls, "select", [ "colorify" , 'BloomPass']).onChange(controls.switchShader);

    // var clFolder = gui.addFolder("Colorify");
    // clFolder.addColor(controls, "color").onChange(controls.changeColor);
    // // clFolder.addColor(controls, "color").onChange(controls.changeColor);
    // // clFolder.addColor(controls, "color").onChange(controls.changeColor);
    // // clFolder.addColor(controls, "color").onChange(controls.changeColor);

    // clFolder.addColor(controls, "color2").onChange(controls.changeColor2);
    // clFolder.open();

    // var bpFolder = gui.addFolder("BloomPass");
    // // bpFolder.add(controls, "strength", 1, 10).onChange(controls.updateEffectBloom);
    // // bpFolder.add(controls, "kernelSize", 1, 100).onChange(controls.updateEffectBloom);
    // // bpFolder.add(controls, "sigma", 1, 10).onChange(controls.updateEffectBloom);
    // // bpFolder.add(controls, "resolution", 0, 1024).onChange(controls.updateEffectBloom);

  }


  update()
  {

    // // ワールド座標を取得
    // const world = this._scene.camera.getWorldPosition();
    // console.log(world);

    // var delta = this.clock.getDelta();
    // this.orbitControls.update(delta);


    //fps表示の更新
    this._stats.update();

    //２回に１回読む
    this.masterFrame += 1;
    if(this.masterFrame == 2){

      
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
      this._renderer.autoClear = false;//これ大事〜！trueだと色が毎回背景白にクリアされちゃう
      this.composer.render();

      this.masterFrame =0;
    }


  }

  onKeyUp(e)//グラデめも    0x5de2ff, 0x3333a7
  {
      if (e.keyCode == KEYCODE.A){//0x9629CC
      //   if (this.goRoom_A == true){ //キーの代わりにくる変数
          this.chooseRoomColor(this._scene.camTargetBool_A, 0x295FCC, 0x9629CC);
          // this.chooseRoomColor(this._scene.camTargetBool_A, 0x243ac, 0xa800cd);
      }
      if (e.keyCode == KEYCODE.B){//0x295FCC
      //   if (this.goRoom_B == true){ //キーの代わりにくる変数
          this.chooseRoomColor(this._scene.camTargetBool_B, 0x2EC7E5, 0x295FCC);
      }
      if (e.keyCode == KEYCODE.C){//0x24B253
      //   if (this.goRoom_C == true){ //キーの代わりにくる変数
          this.chooseRoomColor(this._scene.camTargetBool_C, 0xa6eb72, 0x24B253);
      }
      if (e.keyCode == KEYCODE.D){//0x29CCBE,0xa297//代わり映えしないんだよなぁ
      //   if (this.goRoom_D == true){ //キーの代わりにくる変数
          this.chooseRoomColor(this._scene.camTargetBool_D, 0x268983, 0xa27b);//
      }
      if (e.keyCode == KEYCODE.E){//0x2EC7E5//もう少し明るくする
      //   if (this.goRoom_E == true){ //キーの代わりにくる変数
          // this.chooseRoomColor(this._scene.camTargetBool_E, 0x295FCC, 0x2EC7E5);
          this.chooseRoomColor(this._scene.camTargetBool_E, 0x3a7d, 0x268983);
      }
      if (e.keyCode == KEYCODE.F){//0x4429CC
      //   if (this.goRoom_F == true){ //キーの代わりにくる変数
          this.chooseRoomColor(this._scene.camTargetBool_F, 0x9629CC, 0x295FCC);
      }
      if (e.keyCode == KEYCODE.G){//0xCC2995
      //   if (this.goRoom_G == true){ //キーの代わりにくる変数
          this.chooseRoomColor(this._scene.camTargetBool_G, 0xCC2995, 0x9629CC);
      }
      if (e.keyCode == KEYCODE.BACKSPACE){
      //   if (this.backToPanels == true){ //キーの代わりにくる変数
          this.backToColor(this._scene.camTargetBool_BACKSPACE);
      }

      this._scene.onKeyUp(e);//これがcamTargetBoolをfalseにするから最後にかく

  }

  chooseRoomColor(camTargetBool,targetGradColor1,targetGradColor2){
    if(camTargetBool == true){//これはsceneで読むからfalseにしない
        this.gradeColorBool = true;
        this.colorify.uniforms.color.value = new THREE.Color(this.gradColor1);
        this.colorify.uniforms.color2.value = new THREE.Color(this.gradColor2);
        this.colorify.uniforms.targetColor.value = new THREE.Color(targetGradColor1);
        this.colorify.uniforms.targetColor2.value = new THREE.Color(targetGradColor2);
    }
    this.saveColor1 = targetGradColor1;
    this.saveColor2 = targetGradColor2;
  }

  backToColor(camTargetBool){
    if(camTargetBool == true){//これはsceneで読むからfalseにしない
        this.gradeColorBool = true;
        this.colorify.uniforms.color.value = new THREE.Color(this.saveColor1);
        this.colorify.uniforms.color2.value = new THREE.Color(this.saveColor2);
        this.colorify.uniforms.targetColor.value = new THREE.Color(this.gradColor1);
        this.colorify.uniforms.targetColor2.value = new THREE.Color(this.gradColor2);
    }
  }

  addEvent()
	{
    this._scene.addEvent(); 
	}

  draw()
  {

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

  _initStats()
  {

    this._stats = new Stats();
    this._stats.setMode(0); // 0: fps, 1: ms


    // Align top-left
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(this._stats.domElement);

    return this._stats;
  }

}