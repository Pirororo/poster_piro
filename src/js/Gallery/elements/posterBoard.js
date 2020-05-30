import * as THREE from 'three';


export default class PosterBoard {
  constructor(parameter) {
    this.parameter = parameter || {};
    this.imgPath = this.parameter.imgPath;
    this.posterTitle = this.parameter.posterTitle;
    this.boardWidth = 80;
    this.boardHeight = 45;
    this.fontSize = 3.5;
    this.init();
  }


  init() {
    this.textureLoad();
  }

  createPlaneObject() {

    // const geometry = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight, 1);
    // const material = new THREE.MeshBasicMaterial(
    //   { map: this.imgTexture, transparent: true }
    // );
    // this.plane = new THREE.Mesh(geometry, material);

    //画像
    const geometry = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
    const material = new THREE.MeshBasicMaterial(
      { map: this.imgTexture, transparent: true, opacity: 0 }
    );

    this.plane = new THREE.Mesh(geometry, material);
    material.opacity = 0;

    //テキストの読み込み
    const textPlane = this.createLabel(this.posterTitle);

    //ワイヤー
    // const wireGeometry = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);

    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0;
    line.material.transparent = true;

    // const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: true, opacity: 0 });
    // this.wire = new THREE.Mesh(wireGeometry, wireMaterial);
    // wireMaterial.opacity = 0;

    this.poster = new THREE.Group();
    this.poster.add(textPlane);
    this.poster.add(this.plane);
    this.poster.add(line);

    return this.poster;
  }

  textureLoad() {
    const textureLoader = new THREE.TextureLoader();
    this.imgTexture = textureLoader.load(this.imgPath);
  }

  log() {
    console.log('boster call');
  }

  createLabel(text) {
    const canvas = document.createElement('canvas');
    canvas.width = this.boardWidth * 4;
    canvas.height = this.boardHeight * 2;
    const context = canvas.getContext('2d');
    context.scale(4, 4);
    context.font = this.fontSize + 'px ' + 'Arial, meiryo, sans-serif';
    // const textWidth = context.measureText(text).width;
    // context.textAlign = "center";
    // context.textBaseline = "middle";
    //背景色
    // context.fillStyle = 'red';
    // context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255,255,255,1)'; //文字色

    const textList = text.split('\n');//\nで分割
    const lineHeight = context.measureText("あ").width * 1.2; //文字の高さを調べてline-heightに
    // 複数行で表示するためにループさせる
    textList.forEach(function (text, i) {
      context.fillText(text, 0, 10 + lineHeight * i);
    });

    // context.fillText(text, 0, 5, canvas.height, canvas.height);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(canvas.width / 4, canvas.height / 4);
    const material = new THREE.MeshBasicMaterial({
      map: texture, transparent: true, opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    // mesh.overdraw = true;
    mesh.position.y = -35;
    return mesh;
  }

}
