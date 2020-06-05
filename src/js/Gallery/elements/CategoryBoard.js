import * as THREE from 'three';
import GalleryModel from '../GalleryModel';
import CategoryView from './CategoryView';
import GalleryController from '../GalleryController';

export default class CategoryBoard {
  constructor(stage) {
    this.stage = stage;
    this.categoryId = null;
    this.id = null;
    this.model = new GalleryModel(this.categoryId, this.id);
    this.model.setup();
    const categoryData = this.model.createCategory();
    this.view = new CategoryView(this.stage, categoryData);
    this.view.setup();

  }
}
