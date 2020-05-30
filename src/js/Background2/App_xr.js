import * as THREE from "three";

//fps表示とDAT表示に必要なjs
import {GUI} from 'three/examples/jsm/libs/dat.gui.module';
import Stats from "three/examples/jsm/libs/stats.module";
//カメラ系に必要なjs
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {TweenMax} from "gsap";

//シェーダーに必要なjs
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { MaskPass } from "three/examples/jsm/postprocessing/MaskPass";
import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";

import { ColorifyGradientShader } from "./shaders/ColorifyGradientShader.mine";

import { getWidth, getHeight } from "../Utils/Helper"

export default class App
{
  constructor(sceneInstance)
  {
    // this._initStats = this._initStats.bind(this);
    // this._stats = this._initStats();
    this._scene = sceneInstance;

    this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this._renderer.setClearColor(new THREE.Color(0x000000), 0);
    this._renderer.setSize(getWidth() , getHeight());
    this._renderer.setPixelRatio(1);
    this.clock = new THREE.Clock();

    // this.onResize();
  }

  setup()
  {
    // console.dir(this._scene.camera);
    var renderPass1 = new RenderPass(this._scene.scene1, this._scene.camera);
    renderPass1.clear = true;//Lineは線が更新されていくのでtrueにする、falseだと線最初から全部のこっちゃう
    var renderPass2 = new RenderPass(this._scene.scene2, this._scene.camera);
    renderPass2.clear = false;//trueで色がでる
    //**********renderPass両方falseだとopasity0みたいに明るくなりすぎる、ライト二重？ */
    //マスクパス、クリアマスクパス
    let scene1Mask = new MaskPass(this._scene.scene1, this._scene.camera);
    let scene2Mask = new MaskPass(this._scene.scene2, this._scene.camera);
    let clearMask = new ClearPass();
    //エフェクトパス（出力パスの前にかく）
    //グラデパス
    var colorify = new ShaderPass(ColorifyGradientShader);
    colorify.uniforms.color.value = new THREE.Color(0x734ca4);//0x4ea78e
    colorify.uniforms.color2.value = new THREE.Color(0x4ea78);//e0x648
    colorify.uniforms.alpha = 0.8;
    colorify.enabled = true;

    //アンチエイリアスパス
    var FXAA = new ShaderPass(FXAAShader);
    FXAA.enabled = true;
    FXAAShader.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);

    var bloomPass = new BloomPass(2.0, 15, 3.0, 64);
    bloomPass.enabled = true;
    var effectCopy = new ShaderPass(CopyShader);//コピー
    effectCopy.renderToScreen = true;

    this.composer = new EffectComposer(this._renderer);
    this.composer.renderTarget1.stencilBuffer = true;//?
    this.composer.renderTarget2.stencilBuffer = true;//?
    this.composer.addPass(renderPass1);//Scene1(Line)のレンダー
    this.composer.addPass(renderPass2);//Scene2(Plate)のレンダー
    this.composer.addPass(colorify);//Scene2(Plate)のマスクのエフェクト
    this.composer.addPass(bloomPass);
    this.composer.addPass(effectCopy);
  }

  update()
  {
    //this._stats.update();
    // var delta = this.clock.getDelta();
    // this.orbitControls.update(delta);
    // this._renderer.autoClear = false;//これ大事〜！trueだと色が毎回背景白にクリアされちゃう

    this._scene.update();
    // this.composer.render();
  }

  onResize()
  {
    const width = this._wrapper.clientWidth;
    const height = this._wrapper.clientHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    this._renderer.setSize(width, height);

    // this._scene.camera.aspect = width / height;
    // this._scene.camera.updateProjectionMatrix();
  }

  // _initStats()
  // {
  //   this._stats = new Stats();
  //   this._stats.setMode(0); // 0: fps, 1: ms


  //   // Align top-left
  //   this._stats.domElement.style.position = 'absolute';
  //   this._stats.domElement.style.left = '0px';
  //   this._stats.domElement.style.top = '0px';

  //   document.getElementById("Stats-output").appendChild(this._stats.domElement);

  //   return this._stats;
  // }
}