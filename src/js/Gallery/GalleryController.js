import * as THREE from 'three';

// Controller
export default class GalleryController {
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
    // this.view.destroy();
    // this.id = (this.id + 1) % 3;
    // switch (this.id) {
    //   case 0:
    //     this.view = new MyView02(this.scene).setup();
    //     break;
    //   case 1:
    //     this.view = new MyView03(this.scene).setup();
    //     break;
    //   default:
    //     this.view = new MyView01(this.scene).setup();
    //     break;
    // }
    // this.view.rotationVelocity.set(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1);
  }
  addEvent() {
    // document.addEventListener("click", e => this.shapeChange(e));
  }
}
