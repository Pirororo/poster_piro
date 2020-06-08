import * as THREE from 'three';
import { posterData } from '../posterData';

class PosterBaseView {
  constructor(scene, texture) {
    this.texture = texture || {};
    this.scene = scene;
    this.boardWidth = 80;
    this.boardHeight = 45;

    this.imageGeometry, this.imageMaterial, this.imageShape = null;
    this.imagePosition = new THREE.Vector3();

    this.labelGeometry, this.labelMaterial, this.labelShape = null;
    this.labelPosition = new THREE.Vector3();

    this.wireGeometry, this.wireMaterial, this.wireShape = null;
    this.group = new THREE.Object3D();
    this.position = new THREE.Vector3();
  }

  setup() {
    this.scene.add(this.group);
    return this;
  }

  update() {
    if (this.group == null) { return; }
    this.draw();
  }
  draw() {


  }
  destroy() {
    this.scene.remove(this.group);
    this.imageGeometry.dispose();
    this.imageMaterial.dispose();
    // this.imageShape.dispose();

    this.labelGeometry.dispose();
    this.labelMaterial.dispose();
    // this.labelShape.dispose();

    this.wireGeometry.dispose();
    this.wireMaterial.dispose();
    //this.wireShape = null;

    // this.geometry.dispose();
    // this.material.dispose();
    // this.texture.dispose();
  }
  getScene() { return this.scene; }
}


// Shape01
export default class PosterView extends PosterBaseView {
  constructor(scene, texture) {
    super(scene, texture);

    this.imageGeometry = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
    this.imageMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: this.texture.image, transparent: true, opacity: 0 });
    this.imageShape = new THREE.Mesh(this.imageGeometry, this.imageMaterial);
    this.group.add(this.imageShape);

    this.labelGeometry = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
    this.labelMaterial = new THREE.MeshBasicMaterial({ map: this.texture.label, transparent: true, opacity: 0 });
    this.labelShape = new THREE.Mesh(this.labelGeometry, this.labelMaterial);
    this.labelShape.position.y = -45;
    this.group.add(this.labelShape);

    this.wireGeometry = new THREE.WireframeGeometry(this.imageGeometry);
    this.wireMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0 });
    this.wireShape = new THREE.LineSegments(this.wireGeometry, this.wireMaterial);
    this.group.add(this.wireShape);
  }
}
