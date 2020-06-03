import * as THREE from "three";

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
import { ColorifyGradientShader } from "./shaders/ColorifyGradientShader.mine";


/**
 * メインアプリクラスです。
 */
export default class App
{
//  export default class App{
    /**
   * @constructor
   * @param sceneInstance
   */
  constructor(sceneInstance){

    this._initStats = this._initStats.bind(this);

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
    var colorify = new ShaderPass(ColorifyGradientShader);
    colorify.uniforms.color.value = new THREE.Color(0x734ca4);//0x4ea78e
    colorify.uniforms.color2.value = new THREE.Color(0x4ea78);//e0x648
    // colorify.uniforms.color2.value = new THREE.Color(0x9629CC);//e0x648
    colorify.uniforms.alpha = 0.8;
    colorify.enabled = true;

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
    this.composer.addPass(colorify);//Scene2(Plate)のマスクのエフェクト
    
    // this.composer.addPass(clearMask);
    this.composer.addPass(bloomPass);
    this.composer.addPass(effectCopy);


    var controls = new function () {

        this.select = 'Colorify';

        //グラデパス
        this.color = 0x734ca4;
        this.color2 = 0x4ea78;

        // //ブルームパス
        // this.strength = 0.1;
        // this.kernelSize = 5;
        // this.sigma = 1.0;
        // this.resolution = 64;

        // this.rotate = false;

        this.changeColor = function () {
            // colorify.uniforms.color.value = new THREE.Color(controls.color);
            colorify.uniforms.color.value = controls.color;

        };
        this.changeColor2 = function () {
            colorify.uniforms.color2.value = new THREE.Color(controls.color2);
        };

    };



    const gui = new GUI();

    gui.add(controls, "select", [ "colorify" , 'BloomPass']).onChange(controls.switchShader);

    var clFolder = gui.addFolder("Colorify");
    clFolder.addColor(controls, "color").onChange(controls.changeColor);
    // clFolder.addColor(controls, "color").onChange(controls.changeColor);
    // clFolder.addColor(controls, "color").onChange(controls.changeColor);
    // clFolder.addColor(controls, "color").onChange(controls.changeColor);

    clFolder.addColor(controls, "color2").onChange(controls.changeColor2);
    clFolder.open();

    var bpFolder = gui.addFolder("BloomPass");
    // bpFolder.add(controls, "strength", 1, 10).onChange(controls.updateEffectBloom);
    // bpFolder.add(controls, "kernelSize", 1, 100).onChange(controls.updateEffectBloom);
    // bpFolder.add(controls, "sigma", 1, 10).onChange(controls.updateEffectBloom);
    // bpFolder.add(controls, "resolution", 0, 1024).onChange(controls.updateEffectBloom);



    // フレーム毎の更新
    // this.update();

  }




  /**
  * フレーム毎の更新をします。
  */
  update()
  {

    // // ワールド座標を取得
    // const world = this._scene.camera.getWorldPosition();
    // console.log(world);

    this._stats.update();

    // //sphere.rotation.y=step+=0.01;

    // var delta = this.clock.getDelta();
    // this.orbitControls.update(delta);


    this._renderer.autoClear = false;//これ大事〜！trueだと色が毎回背景白にクリアされちゃう

    // シーンの更新
    this._scene.update();
    this.composer.render();

  }

  onKeyUp(e)
  {
    this._scene.onKeyUp(e);
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