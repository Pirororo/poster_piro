import * as THREE from 'three';
import { AnimationAction } from 'three';
import { EVENT, Action } from "./../Utils/EventManager";

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
  sceneChange(e) {
    e.preventDefault();
    const categoryName = e.target.className;

    switch (categoryName) {
      case 'cat0':
        break;
      case 'cat1':
        break;
      case 'cat2':
        break;
      case 'cat3':
        break;
      case 'cat4':
        break;
      case 'cat5':
        break;
      default:
        break;
    }

    //カテゴリー非表示
    // this.view.destroy();

  }

  sendData() {
    // //
    // Action.add(EVENT.Show, (e) => {
    // });
    // //
    // Action.dispatch(EVENT.ShowDetail, { slug: 'a01' });
    // //param

    // Action.dispatch(EVENT.ShowPoster, data);
  }


  addEvent() {
    document.addEventListener("click", e => this.sceneChange(e));
  }
}
