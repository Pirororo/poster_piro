import * as THREE from 'three';
import { EVENT, Action } from "./../../Utils/EventManager";
import { SYNTH } from "./../../Utils/Sound";

export default class PosterDomView {
  constructor(stage, posterData) {
    this.stage = stage;
    this.posterData = posterData
    this.sessionUrl = '/session/'
    this.posterWrapperli = [];

    console.dir(posterData);
  }

  setup() {
    //ポスターのDOM生成
    //div.posteryWrapper
    this.posteryWrapper = document.createElement('div');
    this.posteryWrapper.setAttribute('class', 'poster-wrapper');
    this.stage.appendChild(this.posteryWrapper);
    // categoryWrapper ul
    const posterWrapperUl = document.createElement('ul');
    this.posteryWrapper.appendChild(posterWrapperUl);
    for (let i = 0; i < this.posterData.imgPath.length; i++) {
      // li
      this.posterWrapperli[i] = document.createElement('li');
      this.posterWrapperli[i].setAttribute("data-slug", this.posterData.categoryId + (i + 1 < 10 ? "0" : "") + (i + 1));

      posterWrapperUl.appendChild(this.posterWrapperli[i]);
      //div.category-container
      const splitText = this.splitBreakTag(this.posterData.posterTitle[i], '<br>');
      const posterContainer = this.createPosterElement(this.sessionUrl + this.posterData.imgPath[i], splitText, 'poster-container cat' + i);
      // categoryContainer.setAttribute('class', 'c' + i);
      this.posterWrapperli[i].appendChild(posterContainer);
      this.posterWrapperli[i].addEventListener("click", e => this.onClick(this.posterWrapperli[i], e));

      setTimeout(() => {
        SYNTH.categoryIn();
      }, 1000 + 100 * i);

    }
    setTimeout(() => {
      this.posteryWrapper.classList.add('in');
    }, 1000);

  }

  update() {
    this.draw();
  }
  draw() {

  }

  destroy() {
    //ポスターボードをフェードアウトしてDOMを削除
    this.posteryWrapper.classList.remove('fadein');
    setTimeout(() => {
      for (let i = 0; i < this.posterData.imgPath.length; i++) {
        this.posterWrapperli[i].removeEventLister("click", () => this.onClick(this));
      }
      this.stage.removeChild(this.posteryWrapper);
    }, 1000);
  }

  getScene() { return this.stage }

  splitBreakTag(str, tag) {
    const textList = str.split(tag);
    return textList
  }

  createPosterElement(img, str, attrValue) {
    // div
    const divEle = document.createElement('div');
    divEle.setAttribute('class', attrValue);
    // img
    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', img);
    imgEl.setAttribute('alt', str);
    divEle.appendChild(imgEl);
    // p
    const pEle = document.createElement('p');
    const txtNode = document.createTextNode(str);
    pEle.appendChild(txtNode);
    divEle.appendChild(pEle);
    return divEle;
  }

  onClick(target, e) {
    const slug = target.getAttribute("data-slug");
    console.log(`ShowDetail: ${slug}`);
    Action.dispatch(EVENT.ShowDetail, { slug });
  }
}


