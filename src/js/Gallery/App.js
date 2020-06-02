import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';
import { radians, map, distance } from './helpers';
import { posterData } from './posterData';
import GalleryModel from './GalleryModel';
import PosterBoard from './elements/posterBoard';
import { EVENT, SELECTORS } from "./../Utils/Props";

export default class App {
  constructor() { }

  init() {
    this.setup();
    this.createScene();
    this.createCamera();
    this.addOrbitControls();
    this.addAmbientLight();
    this.addDirectionalLight();

    //ポスターギャラリーを追加
    this.addBorad();
  }

  setup() {
    this.backgroundColor = '#000000';
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mouse3D = new THREE.Vector2();
    this.meshList = []; //ポスターを保存する配列
    this.raycaster = new THREE.Raycaster();
    this.rayReceiveObjects = []; //光線を受けるオブジェクト配列

    //ポスターデータ
    this.posterData = posterData.a; //一旦 a カテゴリを選択
    this.boardLength = this.posterData.imgPath.length; //ポスターの数
    this.boardPosRadius = 150; //中心からポスターまでの半径
    const totalAnlge = 180; //円弧の角度
    this.boardAngle = totalAnlge / this.boardLength; //分割する円弧の角度
    this.halfAngle = totalAnlge + this.boardAngle; //円弧の調整角度
  }

  draw() {
    //レイキャスター
    this.raycaster.setFromCamera(this.mouse3D, this.camera);
    const intersects = this.raycaster.intersectObjects(this.rayReceiveObjects);
    this.rayReceiveObjects.map(mesh => {
      if (intersects.length > 0 && mesh === intersects[0].object) {
        mesh.material.color.setHex(0xFFFFFF);
        // targetId = mesh.id;
      } else {
        mesh.material.color.setHex(0x222222);
        // targetId = 0;
      }
    });

    this.controls.update();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove({ clientX, clientY }) {
    this.mouse3D.x = (clientX / this.width) * 2 - 1;
    this.mouse3D.y = -(clientY / this.height) * 2 + 1;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  onClick(e) {
    const intersects = this.raycaster.intersectObjects(this.rayReceiveObjects);

    if (intersects.length > 0) {
      const name = intersects[0].object.name;

      console.dir(name);

      document.dispatchEvent(new CustomEvent(EVENT.ShowDetail, {
        detail: {
          message: "Please show me a detail!"
        }
      }));
    }

  }

  /**
   * Methods
   */
  addBorad() {
    const topPosY = 40;
    const bottomPosY = -50;
    const topAxixVec3 = new THREE.Vector3(0, 30, 0);
    const bottomAxixVec3 = new THREE.Vector3(0, -50, 0);

    for (let i = 0; i < this.boardLength; i++) {
      this.board = new PosterBoard(this.scene, 'a', i);
      let axisVec3;
      if (i % 2 === 0) {
        this.board.view.group.position.y = topPosY;
        axisVec3 = topAxixVec3;
      } else {
        this.board.view.group.position.y = bottomPosY;
        axisVec3 = bottomAxixVec3;
      }
      //ポスターの並びの配置
      this.board.view.group.position.set(
        this.boardPosRadius * Math.cos(THREE.Math.degToRad(i * this.boardAngle + this.halfAngle)),
        this.board.view.group.position.y,
        this.boardPosRadius * Math.sin(THREE.Math.degToRad(i * this.boardAngle + this.halfAngle))
      );
      //ポスターの向き
      this.board.view.group.lookAt(axisVec3);
      this.meshList.push(this.board); // 各ポスターを配列に保存
      //ポスターに名前をつける
      this.meshList[i].view.imageShape.name = 'poster' + i;
      // レイキャスターの対象に登録
      this.rayReceiveObjects.push(this.meshList[i].view.imageShape);
    }
    this.setBoardAnime();
  }

  setBoardAnime() {
    for (let i = 0; i < this.boardLength; i++) {
      //アニメーション開始位置
      const startA = {
        x: this.meshList[i].view.group.position.x,
        y: this.meshList[i].view.group.position.y - 100,
        z: this.meshList[i].view.group.position.z,
        alpha: this.meshList[i].view.imageMaterial.opacity
      };
      //到達位置
      const targetA = { x: startA.x, y: this.meshList[i].view.group.position.y, z: startA.z, alpha: 1 };
      //トゥイーンアニメーション
      const tweenA = new TWEEN.Tween(startA).to(targetA, 500).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.group.position.x = startA.x;
        this.meshList[i].view.group.position.y = startA.y;
        this.meshList[i].view.group.position.z = startA.z;
        this.meshList[i].view.labelMaterial.opacity = startB.alpha;
        this.meshList[i].view.imageMaterial.opacity = startB.alpha;
        this.meshList[i].view.wireMaterial.opacity = startA.alpha;
      }).delay(1000 + (i * 50)).start();
      const startB = {
        alphaA: 0,
        alphaB: 1
      };
      const targetB = {
        alphaA: 1,
        alphaB: 0
      }
      const tweenB = new TWEEN.Tween(startB).to(targetB, 300).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.imageMaterial.opacity = startB.alphaA;
        this.meshList[i].view.labelMaterial.opacity = startB.alphaA;
      }).delay(1000 + (i * 10));
      tweenA.chain(tweenB);
      const tweenC = new TWEEN.Tween(startB).to(targetB, 300).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.wireMaterial.opacity = startB.alphaB;
      }).delay(3000 + (i * 20)).start();
    }
  }


  createScene() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(this.backgroundColor); // 背景色
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    // document.body.appendChild(this.renderer.domElement);
    document.getElementById(SELECTORS.GalleryStage).appendChild(this.renderer.domElement);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1);
    this.camera.position.set(0, 80, 150);
    this.camera.lookAt(new THREE.Vector3(0, 50, -80));
    this.scene.add(this.camera);
  }

  addOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minDistance = 0;
    this.controls.maxDistance = Infinity;
    this.enableZoom = true; // Set to false to disable zooming
    this.zoomSpeed = 1.0;
    this.controls.enablePan = true; // Set to false to disable panning (ie
  }

  addAmbientLight() {
    const light = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(light);
  }

  addDirectionalLight() {
    const ligh = new THREE.DirectionalLight(0xffffff, 1);
    ligh.position.set(0, 300, 30);
    this.scene.add(ligh);
  }
}
