import * as THREE from "three";
import { getWidth, getHeight } from "../Utils/Helper"
// import Stats from "three/examples/jsm/libs/stats.module";



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

    this.masterFrame = 0;
  }

  update()
  {
    //this._stats.update();
    
    this.masterFrame += 1;
    if(this.masterFrame == 2){
        this._scene.update();
        this.masterFrame =0;
    }

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