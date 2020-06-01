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
    const texture = {
      image: this.model.loadTexture(),
      label: this.model.createLabel()
    }
    this.model.createCategory();
    this.view = new PosterView(this.scene, texture).setup();
    this.controller = new GalleryController(this.view, this.model, this.id);
  }
}
