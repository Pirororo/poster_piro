import * as THREE from "three";
import "aframe-html-shader";
import { COMPONENTS, SELECTORS } from "./../../Utils/Props";

// const html2canvas = window.html2canvas;

export default class PosterBoard_xr
{
  constructor(parameter)
  {
    this.parameter = parameter || {};
    this.scene = parameter.scene;
    this.index = parameter.index;
    this.name = `poster${this.index}`;
    this.title = {
      container: parameter.titleContainer,
      text: this.parameter.posterTitle,
      position: new THREE.Vector3(),
      rotation: new THREE.Vector3()
    };
    this.imgPath = this.parameter.imgPath;

    this.arrangeRatio = 0.15;
    this.boardWidth = 80 * this.arrangeRatio;
    this.boardHeight = 45 * this.arrangeRatio;
    this.titleOffset = 45 * this.arrangeRatio;
    this.fontSize = 3.5;
    this.entity = null;

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.scale = new THREE.Vector3(this.boardWidth, this.boardHeight, 1);

    this.init();
  }

  init()
  {
    this.createLabel();
    this.createPlaneObject();
  }

  createPlaneObject()
  {
    this.entity = document.createElement("a-entity");
    this.entity.setAttribute("geometry", "primitive: plane");
    this.entity.setAttribute("material", `shader: flat; color: #222; src: ${this.imgPath}`);
    this.entity.setAttribute(COMPONENTS.RaycastTarget, "");
    this.entity.setAttribute("class", SELECTORS.RaycastTarget);
    this.entity.instance = this;

  }

  setPosition(x, y, z)
  {
    this.position.set(x, y, z);
    this.title.position.set(x, y - this.titleOffset, z);
    this.lookAt();
  }

  lookAt()
  {
    const y = 180 + Math.atan2(this.position.x, this.position.z) * 180 / Math.PI;
    const ty = 180 + Math.atan2(this.title.position.x, this.title.position.z) * 180 / Math.PI;

    this.rotation.set(0, y, 0);
    this.title.rotation.set(0, ty, 0);
    this.draw();
  }

  draw()
  {
    const {x:px, y:py, z:pz} = this.position;
    const {x:rx, y:ry, z:rz} = this.rotation;
    const {x:sx, y:sy, z:sz} = this.scale;
    const {x:cpx, y:cpy, z:cpz} = this.title.position;
    const {x:crx, y:cry, z:crz} = this.title.rotation;


    this.entity.setAttribute("position", [px, py, pz].join(" "));
    this.entity.setAttribute("rotation", [rx, ry, rz].join(" "));
    this.entity.setAttribute("scale", [sx, sy, sz].join(" "));

    this.title.entity.setAttribute("position", [cpx, cpy, cpz].join(" "));
    this.title.entity.setAttribute("rotation", [crx, cry, crz].join(" "));
    this.title.entity.setAttribute("scale", [sx, sy, sx].join(" "));
  }

  createLabel()
  {
    this.galleryStage = document.getElementById(SELECTORS.GalleryStage);
    this.title.source = document.createElement("div");
    this.title.source.setAttribute("id", `poster${this.index}`);
    this.title.source.insertAdjacentHTML('afterbegin', `
    <div class="gallery_poster_title">${this.title.text}</div>
    `);
    this.galleryStage.appendChild(this.title.source);


    this.title.entity = document.createElement("a-entity");
    this.title.entity.setAttribute("geometry", "primitive: plane; width: 1; height: 1");
    this.title.entity.setAttribute("material", `shader: html; transparent: true; target: #poster${this.index}`);
    this.title.container.appendChild(this.title.entity);
  }

}
