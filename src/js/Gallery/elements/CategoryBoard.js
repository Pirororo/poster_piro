import * as THREE from 'three';
import GalleryModel from '../GalleryModel';
import CategoryView from './CategoryView';
import GalleryController from '../GalleryController';

export default class CategoryBoard {
  constructor(categoryId, id = 1) {
    this.id = id;
    this.model = new GalleryModel(categoryId, this.id);
    this.model.setup();
    const texture = {

    }
    this.model.createCategory();
    this.view = new CategoryView(texture).setup();
    // this.controller = new GalleryController(this.view, this.model, this.id);
  }
}
