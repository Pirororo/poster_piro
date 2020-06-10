import * as THREE from 'three';
import GalleryModel from '../GalleryModel';
import PosterDomView from './PosterDomView';
import GalleryController from '../GalleryController';

export default class PosterDomBoard {
  constructor(stage, categoryId) {
    this.stage = stage;
    this.categoryId = categoryId;
    this.id = null;
    this.model = new GalleryModel(this.categoryId, this.id);
    this.model.setup();
    const currentPosterData = this.model.createDom();
    currentPosterData.categoryId = categoryId;
    this.view = new PosterDomView(this.stage, currentPosterData);
    this.view.setup();

  }
}
