import * as THREE from 'three';
import { posterData } from './posterData';

export default class GalleryModel {
  constructor(categoryId, id) {
    this.posterData = posterData;
    this.currentCategory = null;
    this.categoryId = categoryId;
    this.id = id;
    this.sessionUrl = 'session/';
    this.imgTexture = null;
    this.canvasTexture = null;
    this.boardWidth = 80;
    this.boardHeight = 45;
    this.fontSize = 6;
    this.categories = posterData.categories;
  }

  setup() {
    switch (this.categoryId) {
      case 'a':
        this.currentCategory = this.posterData.a;
        break;
      case 'b':
        this.currentCategory = this.posterData.b;
        break;
      case 'c':
        this.currentCategory = this.posterData.c;
        break;
      case 'd':
        this.currentCategory = this.posterData.d;
        break;
      case 'e':
        this.currentCategory = this.posterData.e;
        break;
      case 'f':
        this.currentCategory = this.posterData.f;
        break;
      default:
        this.currentCategory = this.posterData.s;
        break;
    }
  }


  createCategory() {
    //カテゴリー一覧用テキスト抽出
    const categoryData = [];
    this.posterData.forIn((categoryId, instance, index) => {
      categoryData[index] = {};
      categoryData[index].cateroryId = instance.categoryId;
      categoryData[index].categoryEn = instance.categoryEn;
      categoryData[index].categoryJp = instance.categoryJp;
      categoryData[index].copy = instance.copy;
    });
    return categoryData;
  }



  loadTexture() {
    //ポスター用Canvasに読み込む画像のローダー
    const textureLoader = new THREE.TextureLoader();
    this.imgTexture = textureLoader.load(this.sessionUrl + this.currentCategory.imgPath[this.id]);
    return this.imgTexture;
  }


  createLabel() {
    // //ポスターCanvasに読み込む2Dテキストの生成

    // console.log('createLabel' + this.currentCategory);
    const labelText = this.currentCategory.posterTitle[this.id];
    const canvas = document.createElement('canvas');
    canvas.width = this.boardWidth * 8;
    canvas.height = this.boardHeight * 8;
    const context = canvas.getContext('2d');
    context.scale(8, 8);
    context.font = this.fontSize + 'px ' + 'Arial, meiryo, sans-serif';
    context.fillStyle = 'rgba(255,255,255,1)';
    const textList = labelText.split('<br>');//\nで分割
    const lineHeight = context.measureText("あ").width * 1.4; //文字の高さを調べてline-heightに
    // 複数行で表示するためにループさせる
    textList.forEach(function (labelText, i) {
      context.fillText(labelText, 0, 10 + lineHeight * i);
    });
    this.canvasTexture = new THREE.Texture(canvas);
    this.canvasTexture.needsUpdate = true;
    return this.canvasTexture;
  }


  createDom() {
    //レスポンシブ用ポスター画像とタイトルを取得
    const currentPosterData = {};
    currentPosterData.imgPath = [];
    currentPosterData.posterTitle = [];
    for (let i = 0; i < this.currentCategory.imgPath.length; i++) {
      currentPosterData.imgPath[i] = this.currentCategory.imgPath[i];
      currentPosterData.posterTitle[i] = this.currentCategory.posterTitle[i];
    }
    return currentPosterData;

  }




}
