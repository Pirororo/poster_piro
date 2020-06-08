import * as THREE from 'three';

export default class CategoryView {
  constructor(stage, categoryData) {
    this.stage = stage;
    this.categoryData = categoryData;
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
      const categoryContainer = this.createDomElement('div', 'cat' + i);
      // categoryContainer.setAttribute('class', 'c' + i);
      categoryWrapperli[i].appendChild(categoryContainer);

      //div.caterory-label
      const cateroryLabel = this.createDomElement('p', 'caterory-label', this.categoryData[i].cateroryId);
      categoryContainer.appendChild(cateroryLabel);


      //div.categoryEn
      const categoryEn = this.createDomElement('p', 'categoryEn', this.categoryData[i].categoryEn);
      categoryContainer.appendChild(categoryEn);

      //div.categoryJp
      const categoryJp = this.createDomElement('p', 'categoryJp', this.categoryData[i].categoryJp);
      categoryContainer.appendChild(categoryJp);

      //div.categoryCopy
      const categoryCopy = this.createDomElement('p', 'categoryCopy', this.categoryData[i].copy);
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

  reset(){
    //カテゴリーボードをフェードイン
    this.categoryWrapper.classList.add('fadein');
  }

  destroy() {
    //カテゴリーボードをフェードアウト
    this.categoryWrapper.classList.remove('fadein');
  }


  getScene() { return this.stage }

  createDomElement(tag, attrValue, str) {
    // console.log(str);

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


