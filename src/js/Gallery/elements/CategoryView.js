import * as THREE from 'three';
import { posterData } from '../posterData';

class CategoryBaseView {
  constructor(texture) {
    this.boardWidth = 80;
    this.boardHeight = 45;
  }

  setup() {
    return this;
  }

  update() {
    if (this.group == null) { return; }
    this.draw();
  }
  draw() {


  }
  destroy() {
    // this.geometry.dispose();
    // this.material.dispose();
    // this.texture.dispose();
  }
  getScene() { return this }
}


// Shape01
export default class CategoryView extends CategoryBaseView {
  constructor(texture) {
    super(texture);


  }
}
