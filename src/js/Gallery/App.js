import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';
import { radians, map, distance } from './helpers';
import { posterData } from './posterData';
import GalleryModel from './GalleryModel';
import PosterBoard from './elements/posterBoard';
import PosterDomBoard from './elements/PosterDomBoard';
import CategoryBoard from './elements/CategoryBoard';

import { SELECTORS } from "./../Utils/Props";
import { EVENT, Action } from "./../Utils/EventManager";
import { show, hide } from "./../Utils/Helper";
import { SYNTH } from "./../Utils/Sound";
import { Vector2 } from 'three/build/three';

export default class App {
  constructor() {
    this.categoryId = null;
    this.currentPosterData = null;
    this.boardLength = null;
    this.posterData = posterData;
    this.posterFrag = false;
    this.isMobile = false;

    this.isWebGLEnable = false;
  }
  init() {

    //初期カテゴリ
    this.categoryId = 'a';

    // DOM -----------
    //PC版のid付与
    document.querySelector('body').setAttribute('id', 'pc');
    this.category_stage = document.getElementById('category_stage');
    this.gallery_stage = document.getElementById('gallery_stage');

    //初期設定
    this.setup();

    // Three.jsの設定
    this.createScene();
    this.createCamera();
    this.addOrbitControls();
    this.addAmbientLight();
    this.addDirectionalLight();

    //カテゴリーの配置
    this.addCategory();
    this.onResize();

    this.addEvent();
  }

  setup() {
    this.backgroundColor = '#000000';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse3D = new THREE.Vector2();
    this.meshList = []; //ポスターを保存する配列
    this.raycaster = new THREE.Raycaster();
    this.rayReceiveObjects = []; //光線を受けるオブジェクト配列
  }

  draw() {
    if (!this.isWebGLEnable) { return; }

    //レイキャスター
    this.raycaster.setFromCamera(this.mouse3D, this.camera);
    const intersects = this.raycaster.intersectObjects(this.rayReceiveObjects);
    this.rayReceiveObjects.map(mesh => {
      if (intersects.length > 0 && mesh === intersects[0].object) {
        mesh.material.color.setHex(0xFFFFFF);
        document.querySelector('body,html').style.cursor = 'pointer';
      } else {
        mesh.material.color.setHex(0x222222);
        document.querySelector('body,html').style.cursor = 'default';
      }
    });


    this.controls.update();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove({ clientX, clientY }) {
    if (this.mouse3D == null) { return; }
    this.mouse3D.x = (clientX / this.width) * 2 - 1;
    this.mouse3D.y = -(clientY / this.height) * 2 + 1;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);

    //ToDo: レスポンシブの対応
    if (this.width < 1367) {
      this.isMobile = true;
      this.isWebGLEnable = false;
    } else {
      this.isMobile = false;
      this.isWebGLEnable = true;
    }
    console.log('this.width: ' + this.width + 'isMoble: ' + this.isMobile);

  }

  onClick(e) {
    // e.preventDefault();
    console.log('poster flag: ' + this.posterFrag);

    if (!this.posterFrag) {
      this.onCategoryHandler(e);
    } else {
      this.onPosterBackHandler(e);
      this.onPosterRaycasterHandler(e);
    }
  }

  onTouchStart(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (this.mouse3D != null && this.mouse3D instanceof THREE.Vector2) {
      this.mouse3D.set(touch.pageX, touch.pageY, 0);
      console.log(`Touch Position: ${touch.pageX + ", " + touch.pageY}`);
    }
  }



  /**
   * Methods
   */

  addCategory() {
    //カテゴリを配置する
    const categoryStage = document.getElementById('category_stage');
    this.category = new CategoryBoard(categoryStage);
    // setTimeout(() => {
    //   SYNTH.categoryIn();
    // }, 1000);
  }


  addPosterCanvasBoard() {

    hide(SELECTORS.CategoryContainer);
    show(SELECTORS.GalleryContainer);

    //Canvasを表示
    this.gallery_canvas = this.gallery_stage.querySelector('canvas');
    this.gallery_canvas.classList.add('in');

    //ポスターデータ
    this.setPosterData(this.categoryId);
    this.boardPosRadius = 150; //中心からポスターまでの半径
    const totalAnlge = 180; //円弧の角度
    this.boardAngle = (totalAnlge / this.boardLength) - 2; //分割する円弧の角度
    // this.halfAngle = totalAnlge + this.boardAngle; //円弧の調整角度
    this.halfAngle = totalAnlge + this.boardAngle; //円弧の調整角度
    console.log('this.halfAngle' + this.halfAngle, 'this.boardAngle' + this.boardAngle);

    const topPosY = 120;
    const bottomPosY = 30;
    const topAxixVec3 = new THREE.Vector3(0, 120, 0);
    const bottomAxixVec3 = new THREE.Vector3(0, 30, 0);

    //レイキャスターを格納する配列を初期化
    this.rayReceiveObjects = [];

    for (let i = 0; i < this.boardLength; i++) {
      this.board = new PosterBoard(this.scene, this.categoryId, i);
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
      this.meshList[i].view.imageShape.slug = this.categoryId + (i + 1 < 10 ? "0" : "") + (i + 1);
      // レイキャスターの対象に登録
      this.rayReceiveObjects.push(this.meshList[i].view.imageShape);
    }
    this.setPosterCanvasBoardAnime();
    this.addBackBtn();
  }


  setPosterCanvasBoardAnime() {
    for (let i = 0; i < this.boardLength; i++) {
      const startA = {
        y: this.meshList[i].view.group.position.y - 160,
        alpha: 0
      };
      const targetA = {
        y: startA.y + 80,
        alpha: 1
      };
      const startB = {
        alphaIn: 0,
        alphaOut: 1
      };
      const targetB = {
        alphaIn: 1,
        alphaOut: 0
      }
      //トゥイーンアニメーション
      const tweenA = new TWEEN.Tween(startA).to(targetA, 500).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.group.position.y = startA.y;
        this.meshList[i].view.wireMaterial.opacity = startA.alpha;
      }).delay(1000 + (i * 50)).start();

      const tweenB = new TWEEN.Tween(startB).to(targetB, 300).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.imageMaterial.opacity = startB.alphaIn;
        this.meshList[i].view.labelMaterial.opacity = startB.alphaIn;
      }).delay(1000 + (i * 10));
      tweenA.chain(tweenB);
      const tweenC = new TWEEN.Tween(startB).to(targetB, 300).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.wireMaterial.opacity = startB.alphaOut;
      }).delay(3000 + (i * 20)).start();
      setTimeout(() => {
        SYNTH.categoryIn();
      }, 1000 + 100 * i);
    }
    this.posterFrag = true;
  }


  removePosterCanvasBoard() {
    const gllery_canvas = this.gallery_stage.querySelector('canvas');
    gllery_canvas.classList.remove('in');
    setTimeout(() => {
      for (let i = 0; i < this.meshList.length; i++) {
        this.meshList[i].destroy();
      }

      setTimeout(() => {
        this.meshList = [];
        //Backgroundのアニメーションを2秒待つ
        this.category.reset(); //カテゴリを表示
      }, 1000);
      this.posterFrag = false;
    }, 500);
  }

  removePosterCanvasBoardAnime() {
    let completeCounter = 0;
    for (let i = 0; i < this.boardLength; i++) {
      //アニメーション開始位置
      const startA = {
        alphaIn: 0,
        alphaOut: 1,
      };
      //到達位置
      const targetA = {
        alphaIn: 1,
        alphaOut: 0,
      };
      const startB = {
        y: this.meshList[i].view.group.position.y,
        alpha: 1,
      };
      const targetB = {
        y: startB.y - 160,
        alpha: 0,
      };
      //トゥイーンアニメーション
      const tweenA = new TWEEN.Tween(startA).to(targetA, 500).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.wireMaterial.opacity = startA.alphaIn;
        this.meshList[i].view.imageMaterial.opacity = startA.alphaOut;
        this.meshList[i].view.labelMaterial.opacity = startA.alphaOut;
      }).delay(100 + (i * 50)).start();

      const tweenB = new TWEEN.Tween(startB).to(targetB, 500).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        this.meshList[i].view.group.position.y = startB.y;
        this.meshList[i].view.wireMaterial.opacity = startB.alpha;
      }).delay(300 + (i * 10))
      tweenA.chain(tweenB);
      // setTimeout(() => {
      //   SYNTH.categoryIn();
      // }, 1000 + 100 * i);
    }
    setTimeout(() => {
      this.removePosterCanvasBoard();
    }, 1600);

  }

  addBackBtn() {
    //Backボタン
    this.backBtn = document.createElement('div');
    this.backBtn.setAttribute('id', 'back_btn');
    const backBtnImg = document.createElement('img');
    backBtnImg.setAttribute('src', '/img/ui/btn_back.png');
    backBtnImg.setAttribute('alt', 'back');
    this.backBtn.appendChild(backBtnImg);
    this.gallery_stage.appendChild(this.backBtn);
    setTimeout(() => {
      this.backBtn.classList.add('in');
    }, 2000);
    //

  }




  // レスポンシブ用DOMのポスター
  addPosterDomBorad() {
    const galleryStage = document.getElementById('gallery_stage');
    const domBoard = new PosterDomBoard(galleryStage, this.categoryId);
    this.addBackBtn();
    this.posterFrag = true;

    hide(SELECTORS.CategoryContainer);
    show(SELECTORS.GalleryContainer);
  }

  removePosterDomBorad() {
    const posterWrapper = this.gallery_stage.querySelector('.poster-wrapper');
    posterWrapper.classList.remove('in');
    setTimeout(() => {
      posterWrapper.remove();
      this.category.reset(); //再度カテゴリを表示
      this.posterFrag = false;
    }, 2000);
    // }, 2000);
  }



  setPosterData(categoryId) {
    switch (categoryId) {
      case 'a':
        this.currentPosterData = this.posterData.a;
        break;
      case 'b':
        this.currentPosterData = this.posterData.b;
        break;
      case 'c':
        this.currentPosterData = this.posterData.c;
        break;
      case 'd':
        this.currentPosterData = this.posterData.d;
        break;
      case 'e':
        this.currentPosterData = this.posterData.e;
        break;
      case 'f':
        this.currentPosterData = this.posterData.f;
        break;
      default:
        this.currentPosterData = this.posterData.s;
        break;
    }
    this.boardLength = this.currentPosterData.imgPath.length; //ポスターの数
  }






  /**
   * Handler
   */

  onCategoryHandler(e) {
    const categoryName = e.target.className;
    let categoryId = "";
    switch (categoryName) {
      case 'cat0':
        categoryId = "a";
        this.categoryId = categoryId;
        this.category.destroy();
        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "A", mode: "normal" });
        break;
      case 'cat1':
        categoryId = "b";
        this.categoryId = categoryId;
        this.category.destroy();
        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "B", mode: "normal" });
        break;
      case 'cat2':
        categoryId = "c";
        this.categoryId = categoryId;
        this.category.destroy();
        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "C", mode: "normal" });
        break;
      case 'cat3':
        categoryId = "d";
        this.categoryId = categoryId;
        this.category.destroy();
        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "D", mode: "normal" });
        break;
      case 'cat4':
        categoryId = "e";
        this.categoryId = categoryId;
        this.category.destroy();

        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "E", mode: "normal" });
        break;
      case 'cat5':
        categoryId = "f";
        this.categoryId = categoryId;
        this.category.destroy();
        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "F", mode: "normal" });
        break;
      case 'cat6':
        categoryId = "s";
        this.categoryId = categoryId;
        this.category.destroy();
        this.checkResponsiveBoard();
        Action.dispatch(EVENT.ShowCategory, { category: "G", mode: "normal" });
        break;
      default:
        break;
    }

    if (categoryName != null) {
      Action.dispatch(EVENT.ShowCategory, { mode: "normal", category: categoryId.toUpperCase() });
    }

  }


  checkResponsiveBoard() {
    console.log('this.isMobile: '+this.isMobile);

    //モバイルのチェック
    if (!this.isMobile) {
      this.addPosterCanvasBoard();
    } else {
      this.addPosterDomBorad();
    }
    SYNTH.btnSound();

  }


  onPosterRaycasterHandler(e) {
    //レイキャスター
    this.raycaster.setFromCamera(this.mouse3D, this.camera);
    const intersects = this.raycaster.intersectObjects(this.rayReceiveObjects);
    if (intersects.length > 0) {
      const slug = intersects[0].object.slug;

      console.log(`ShowDetail: ${slug}`);

      Action.dispatch(EVENT.ShowDetail, { slug });
      SYNTH.btnSound();
    }
    this.posterFrag = true;

  }


  onPosterBackHandler(e) {
    //バックボタン
    if (e.target.id === 'back_btn') {

      show(SELECTORS.CategoryContainer);

      if (!this.isMobile) {
        this.removePosterCanvasBoardAnime();
      } else {
        this.removePosterDomBorad();
      }
      this.backBtn.classList.remove('in');

      Action.dispatch(EVENT.BackToCategory, { mode: "normal" });

      setTimeout(() => {
        this.backBtn.remove();
        hide(SELECTORS.GalleryContainer);
      }, 2000);
      SYNTH.btnSound();
    }
  }



  // THREEjsの設定
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
    this.camera.position.set(0, 5, 200);
    this.camera.lookAt(new THREE.Vector3(0, 5, -50));
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

  addEvent() {

    Action.add(EVENT.ShowCategory, data => {
      if (data.mode == "normal" && !("category" in data)) {
        setTimeout(() => {
          show(SELECTORS.CategoryContainer);
          this.init();
        }, 1500);
      }
    });
  }
}
