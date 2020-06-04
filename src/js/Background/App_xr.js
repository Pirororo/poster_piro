import * as THREE from "three";

//fps表示とDAT表示に必要なjs
// import Stats from "three/examples/jsm/libs/stats.module";

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

  onKeyUp(e)
  {
    this._scene.onKeyUp(e);
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