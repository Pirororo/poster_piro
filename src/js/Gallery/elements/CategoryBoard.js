import * as THREE from 'three';
import { posterData } from '../posterData';

export default class MyView {
  constructor(scene) {
    this.scene = scene;
    this.geometry = null;
    this.material = null;
    this.shape = null;
    this.position = new THREE.Vector3();
  }

  setup() {
    this.scene.add(this.shape);
    return this;
  }
  update() {
    if (this.shape == null) { return; }
    this.draw();
  }
  draw() {

  }
  destroy() {
    this.scene.remove(this.shape);
    this.geometry.dispose();
    this.material.dispose();
    //this.texture.dispose();
  }
  getScene() { return this.scene; }
}


// Shape01
class MyView01 extends MyView {
  constructor(scene) {
    this.boardWidth = 80;
    this.boardHeight = 45;
    super(scene);
    this.geometry = new new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
    this.material = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
    this.shape = new THREE.Mesh(this.geometry, this.material);
  }
}

// Controller

class MyController {
  constructor(view, model, id = 1) {
    this.id = id;
    this.scene = view.getScene();
    this.view = view;
    this.model = model;
    this.addEvent();
  }
  update() {
    this.view.update();
  }
  shapeChange() {
    this.view.destroy();
    this.id = (this.id + 1) % 3;
    switch (this.id) {
      case 0:
        this.view = new MyView02(this.scene).setup();
        break;
      case 1:
        this.view = new MyView03(this.scene).setup();
        break;
      default:
        this.view = new MyView01(this.scene).setup();
        break;
    }
    this.view.rotationVelocity.set(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1);
  }
  addEvent() {
    document.addEventListener("click", e => this.shapeChange(e));
  }
}

// Model (dummy)

class MyModel {
  constructor() {
    this.view = null;
    this.posterData =
  }
  applyView(view) {
    this.view = view;

    // decorate view with some data
    // i.e.
    // this.view.texture = .....
  }
}



class MyModel {
  constructor(id) {
    this.view = null;
    this.id = id;
    this.categoryEn = posterData.id.categoryEn;
    this.categoryJp = posterData.id.categoryJp;
    this.copy = posterData.id.copy;
    this.color = posterData.id.color;
  }
  applyView(view) {
    this.view = view;

    // decorate view with some data
    // const canvas = document.createElement('canvas');
    // const context = canvas.getContext('2d');
    // context.scale(4, 4);
    // context.font = this.fontSize + 'px ' + 'Arial, meiryo, sans-serif';
    // context.fillStyle = 'rgba(255,255,255,1)'; //文字色
    // const textList = text.split('\n');//\nで分割
    // const lineHeight = context.measureText("あ").width * 1.2; //文字の高さを調べてline-heightに
    // // 複数行で表示するためにループさせる
    // textList.forEach(function (this.id, i) {
    //   context.fillText(this.id, 0, 10 + lineHeight * i);
    // });
    // this.view.texture = new THREE.CanvasTexture(canvas);

    // i.e.
    // this.view.texture = .....
  }
}

// Composing MVC element

class MyElement {
  constructor(scene, id = 1) {
    this.id = id;
    this.scene = scene;
    this.model = new MyModel(this.id);
    // Initial Shape is Cube
    // this.view = new MyView01(this.scene).setup();
    // this.controller = new MyController(this.view, this.model, this.id);

    // Apply model to view (Model is dummy)
    // this.model.applyView(this.view);
  }
  update() {
    this.controller.update();
  }
}

