import * as THREE from 'three';
import GalleryModel from '../GalleryModel';
import PosterView from './PosterView';
import GalleryController from '../GalleryController';

export default class posterBoard {
  constructor(scene, categoryId, id = 1) {
    this.id = id;
    this.scene = scene;
    this.model = new GalleryModel(categoryId, this.id);
    this.model.setup();
    this.texture = {
      image: this.model.loadTexture(),
      label: this.model.createLabel()
    }
    this.view = new PosterView(this.scene, this.texture).setup();
    this.controller = new GalleryController(this.view, this.model, this.id);
  }

  destroy() {
    this.id = null;
    this.model = null;
    this.texture = null;
    this.view.destroy();
  }
}
