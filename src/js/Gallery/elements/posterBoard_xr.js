import * as THREE from 'three';


export default class PosterBoard_xr
{
  constructor(parameter)
  {
    this.parameter = parameter || {};
    this.index = this.parameter.index;
    this.imgPath = this.parameter.imgPath;
    this.posterTitle = this.parameter.posterTitle;
    this.boardWidth = 80;
    this.boardHeight = 45;
    this.fontSize = 3.5;

    this.entity = null;

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.scale = new THREE.Vector3(this.boardWidth, this.boardHeight, 1);

  }

  init() {
  }

  lookAt()
  {
    this.rotation.set(
      0,
      180 + Math.atan2(this.position.x, this.position.z) * 180 / Math.PI,
      0
    );
    this.draw();
  }

  createPlaneObject()
  {
    this.entity = document.createElement("a-entity");
    this.entity.setAttribute("geometry", "primitive: plane");
    this.entity.setAttribute("material", `shader: flat; color: #222; src: ${this.imgPath}`);
    this.entity.setAttribute("class", "collidable");

    this.draw();

    return this;
  }

  draw()
  {
    const {x:px, y:py, z:pz} = this.position;
    const {x:rx, y:ry, z:rz} = this.rotation;
    const {x:sx, y:sy, z:sz} = this.scale;

    this.entity.setAttribute("position", [px, py, pz].join(" "));
    this.entity.setAttribute("rotation", [rx, ry, rz].join(" "));
    this.entity.setAttribute("scale", [sx, sy, sz].join(" "));

    console.dir([px, py, pz].join(" "));
  }

  log() {
    console.log('poster call');
  }

  createLabel(text)
  {
    return null;
  }

}
