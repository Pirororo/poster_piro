import * as THREE from 'three';

export default class CategoryView {
  constructor(stage, categoryData) {
    this.stage = stage;
    this.categoryData = categoryData
  }

  setup() {
    //カテゴリーのDOM生成
    //div.categoryWrapperの生成
    this.categoryWrapper = this.createDomElement('div', 'category-wrapper');
    this.stage.appendChild(this.categoryWrapper);

    // categoryWrapper ul
    const categoryWrapperUl = document.createElement('ul');
    this.categoryWrapper.appendChild(categoryWrapperUl);


    const categoryWrapperli = [];
    for (let i = 0; i < this.categoryData.length; i++) {
      // li
      categoryWrapperli[i] = document.createElement('li');
      categoryWrapperUl.appendChild(categoryWrapperli[i]);

      //div.category-container
      const categoryContainer = this.createDomElement('div', 'category-container cat' + i);
      // categoryContainer.setAttribute('class', 'c' + i);
      categoryWrapperli[i].appendChild(categoryContainer);

      //div.caterory-label
      const cateroryLabel = this.createDomElement('div', 'caterory-label', this.categoryData[i].categoryId);
      categoryContainer.appendChild(cateroryLabel);

      //div.categoryEn
      const categoryEn = this.createDomElement('div', 'categoryEn', this.categoryData[i].categoryEn);
      categoryContainer.appendChild(categoryEn);

      //div.categoryJp
      const categoryJp = this.createDomElement('div', 'categoryJp', this.categoryData[i].categoryJp);
      categoryContainer.appendChild(categoryJp);

      //div.categoryCopy
      const categoryCopy = this.createDomElement('div', 'categoryCopy', this.categoryData[i].copy);
      categoryContainer.appendChild(categoryCopy);
    }

    setTimeout(() => {
      this.categoryWrapper.classList.add('fadein');
    }, 1000);

  }

  update() {
    this.draw();
  }
  draw() {

  }

  destroy() {
    //カテゴリーボードをフェードアウトしてDOMを削除
    this.categoryWrapper.classList.remove('fadein');
    setTimeout(() => {
      this.stage.removeChild(this.categoryWrapper);
    }, 1000);
  }


  getScene() { return this }

  createDomElement(tag, attrValue, str) {
    const ele = document.createElement(tag);
    if (!str) {
      ele.setAttribute('class', attrValue);
    } else {
      ele.setAttribute('class', attrValue);
      const txtNode = document.createTextNode(str);
      ele.appendChild(txtNode);
    }
    return ele;
  }

}


