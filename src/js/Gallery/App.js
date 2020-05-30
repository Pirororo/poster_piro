import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';
import { radians, map, distance } from './helpers';
import { posterData } from './posterData';
import PosterBoard from './elements/posterBoard';

import { EVENT, SELECTORS } from "./../Utils/Props";

export default class App
{
  constructor(){}

  init() {
    this.setup();
    this.createScene();
    // this.addNullBox();
    this.createCamera();
    // this.addHelper();
    this.addOrbitControls();
    this.addAmbientLight();
    this.addDirectionalLight();
    // this.addSpotLight();
    // this.addRectLight();
    // this.addPointLight(0xfff000, { x: 0, y: 10, z: -100 });
    // this.addPointLight(0x79573e, { x: 100, y: 10, z: 0 });
    // this.addPointLight(0xc27439, { x: 20, y: 5, z: 20 });

    this.addBorad();

    // this.animate();
    // window.addEventListener('resize', this.onResize.bind(this));
    // window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    // this.onMouseMove({ clientX: 0, clientY: 0 });
  }

  setup()
  {
    this.mesheList = [];
    this.backgroundColor = '#000000';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse3D = new THREE.Vector2();

    this.meshList = [];
    this.raycaster = new THREE.Raycaster();
    this.rayReceiveObjects = []; //光線を受けるオブジェクト配列

    //ポスターデータ
    this.posterData = posterData.a;
    this.boardLength = this.posterData.imgPath.length;
    this.boardPosRadius = 200;
    const totalAnlge = 180;
    this.boardAngle = totalAnlge / this.boardLength;
    this.categoryAngle = totalAnlge + this.boardAngle / 2;
  }

  draw()
  {
    //レイキャスター
    this.raycaster.setFromCamera(this.mouse3D, this.camera);
    const intersects = this.raycaster.intersectObjects(this.rayReceiveObjects);
    // console.log(intersects);
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

  onClick(e)
  {
    const intersects = this.raycaster.intersectObjects(this.rayReceiveObjects);

    if(intersects.length > 0)
    {
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

  addBorad()
  {
    for (let i = 0; i < this.boardLength; i++) {
      const parameter = {
        imgPath: this.posterData.imgPath[i],
        posterTitle: this.posterData.posterTitle[i]
      };

      this.board = new PosterBoard(parameter);
      const mesh = this.board.createPlaneObject();
      // const posterTitle = this.board.createTextObject();

      let posY;
      if (i % 2 === 0) {
        posY = 20;
      } else {
        posY = -50;
      }
      mesh.position.set(
        this.boardPosRadius * Math.cos(THREE.Math.degToRad(i * this.boardAngle + this.categoryAngle)),
        posY,
        this.boardPosRadius * Math.sin(THREE.Math.degToRad(i * this.boardAngle + this.categoryAngle))
      );
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene.add(mesh);


      // 配列に保存
      this.meshList.push(mesh);
      //ポスターに名前をつける
      this.meshList[i].children[1].name = 'poster' + i;
      // レイキャスターの対象に登録
      this.rayReceiveObjects.push(this.meshList[i].children[1]);


      //アニメーション開始位置
      const startA = {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
        alpha: mesh.children[0].material.opacity
      };

      //トゥイーンアニメーション
      const targetA = { x: startA.x, y: startA.y + 100, z: startA.z, alpha: 1 };
      const tweenA = new TWEEN.Tween(startA).to(targetA, 500).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        mesh.position.x = startA.x;
        mesh.position.y = startA.y;
        mesh.position.z = startA.z;
        // mesh.children[0].material.opacity = startA.alpha;
        mesh.children[2].material.opacity = startA.alpha;
      }).delay(1000 + (i * 50)).start();

      const startB = {
        alphaA: 0,
        alphaB: 1
      };
      const targetB = {
        alphaA: 1,
        alphaB: 0
      }


      const tweenB = new TWEEN.Tween(startB).to(targetB, 500).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
        mesh.children[0].material.opacity = startB.alphaA;
        mesh.children[1].material.opacity = startB.alphaA;
        mesh.children[2].material.opacity = startB.alphaB;
      }).delay(1000 + (i * 10));
      tweenA.chain(tweenB);
    }
  }

  addNullBox() {
    const box = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshNormalMaterial();
    this.nullMesh = this.getMesh(box, material);
    this.scene.add(this.nullMesh);

    var position = { x: 0, y: 80, z: -50 };
    this.nullMesh.position.set(position.x, position.y, position.z);
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
    // How far you can orbit vertically, upper and lower limits.
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;
    // // How far you can dolly in and out ( PerspectiveCamera only )
    this.controls.minDistance = 0;
    this.controls.maxDistance = Infinity;
    this.enableZoom = true; // Set to false to disable zooming
    this.zoomSpeed = 1.0;
    this.controls.enablePan = true; // Set to false to disable panning (ie
  }

  addAmbientLight() {
    // const light = new THREE.AmbientLight('#ffffff', 1);
    const light = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(light);
  }

  addDirectionalLight() {
    const ligh = new THREE.DirectionalLight(0xffffff, 1);
    ligh.position.set(0, 300, 30);
    // ligh.castShadow = true;
    this.scene.add(ligh);
  }

  addSpotLight() {
    const ligh = new THREE.SpotLight('#7bccd7', 1, 1000);
    ligh.position.set(0, 27, 0);
    ligh.castShadow = true;
    this.scene.add(ligh);
  }

  addRectLight() {
    const light = new THREE.RectAreaLight('#341212', 1, 2000, 2000);
    light.position.set(5, 50, 50);
    light.lookAt(0, 0, 0);
    this.scene.add(light);
  }

  addPointLight(color, position) {
    const light = new THREE.PointLight(color, 1, 1000, 1);
    light.position.set(position.x, position.y, position.z);
    this.scene.add(light);
  }

  addHelper() {
    const grid = new THREE.GridHelper(500, 50);
    this.scene.add(grid);
    const axes = new THREE.AxesHelper(500);
    this.scene.add(axes);
  }

  getMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}
